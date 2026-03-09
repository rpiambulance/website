<?php

require_once '.oidc_common.php';

function oidc_link_cookie_secret() {
    $secret = oidc_get_env('OIDC_LINK_SECRET', '');
    if (!empty($secret)) {
        return $secret;
    }
    $fallback = oidc_get_env('OIDC_CLIENT_SECRET', '');
    if (!empty($fallback)) {
        return $fallback;
    }
    return oidc_get_env('OIDC_CLIENT_ID', 'oidc-link');
}

function oidc_clear_legacy_link_cookie() {
    setcookie('OIDC_LINK_LEGACY', '', time() - 3600, '/');
}

function oidc_read_legacy_link_cookie() {
    if (empty($_COOKIE['OIDC_LINK_LEGACY'])) {
        return null;
    }

    $raw = $_COOKIE['OIDC_LINK_LEGACY'];
    $parts = explode('.', $raw, 2);
    if (count($parts) !== 2) {
        oidc_clear_legacy_link_cookie();
        return null;
    }

    $payloadB64 = $parts[0];
    $providedSig = $parts[1];
    $expectedSig = hash_hmac('sha256', $payloadB64, oidc_link_cookie_secret());
    if (!hash_equals($expectedSig, $providedSig)) {
        oidc_clear_legacy_link_cookie();
        return null;
    }

    $payloadRaw = oidc_base64url_decode($payloadB64);
    $payload = json_decode($payloadRaw, true);
    if (!is_array($payload) || empty($payload['user_id']) || empty($payload['exp'])) {
        oidc_clear_legacy_link_cookie();
        return null;
    }

    if (time() >= intval($payload['exp'])) {
        oidc_clear_legacy_link_cookie();
        return null;
    }

    return $payload;
}

function oidc_member_by_id($connection, $userId) {
    $stmt = $connection->prepare("SELECT * FROM members WHERE id = :id LIMIT 1");
    $stmt->bindParam(':id', $userId, PDO::PARAM_INT);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? $row : null;
}

function oidc_redirect_login($message, $challengeId = null) {
    $url = '/#/login';
    if ($challengeId) {
        $url = '/#/oidc-onboard?challenge=' . urlencode($challengeId);
    } else if (!empty($message)) {
        $url .= '?oidc_error=' . urlencode($message);
    }
    header('Location: ' . $url);
    exit;
}

if (isset($_GET['error'])) {
    $desc = isset($_GET['error_description']) ? $_GET['error_description'] : $_GET['error'];
    oidc_redirect_login($desc);
}

if (!isset($_GET['code']) || !isset($_GET['state'])) {
    oidc_redirect_login('Invalid OIDC callback request.');
}

if (!isset($_COOKIE['OIDC_STATE']) || !hash_equals($_COOKIE['OIDC_STATE'], $_GET['state'])) {
    oidc_redirect_login('OIDC state validation failed.');
}
setcookie('OIDC_STATE', '', time() - 3600, '/');

$discovery = oidc_get_discovery();
$clientId = oidc_get_env('OIDC_CLIENT_ID', '');
$clientSecret = oidc_get_env('OIDC_CLIENT_SECRET', '');
$redirectUri = oidc_get_env('OIDC_REDIRECT_URI', '');
if (empty($redirectUri)) {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
    $redirectUri = $scheme . '://' . $host . '/.oidc_callback.php';
}

if (!$discovery || empty($discovery['token_endpoint']) || empty($clientId)) {
    oidc_redirect_login('OIDC provider configuration is incomplete.');
}

$postFields = array(
    'grant_type' => 'authorization_code',
    'code' => $_GET['code'],
    'redirect_uri' => $redirectUri,
    'client_id' => $clientId
);
if (!empty($clientSecret)) {
    $postFields['client_secret'] = $clientSecret;
}

$tokenData = oidc_post_form_json($discovery['token_endpoint'], $postFields);
if (!$tokenData) {
    oidc_redirect_login('Unable to exchange OIDC authorization code.');
}
if (!$tokenData || empty($tokenData['id_token'])) {
    oidc_redirect_login('OIDC provider did not return an ID token.');
}

$verified = oidc_verify_id_token($tokenData['id_token'], $discovery, $clientId);
if (!$verified['ok']) {
    oidc_redirect_login($verified['error']);
}
$claims = $verified['payload'];
$legacyLink = oidc_read_legacy_link_cookie();

$connection = openDatabaseConnection();
if (!$connection) {
    oidc_redirect_login('Unable to connect to the database.');
}

$identityStmt = $connection->prepare(
    "SELECT m.*
     FROM oidc_identities oi
     JOIN members m ON m.id = oi.userID
     WHERE oi.issuer = :issuer AND oi.subject = :subject
     LIMIT 1"
);
$identityStmt->bindParam(':issuer', $claims['iss']);
$identityStmt->bindParam(':subject', $claims['sub']);
$identityStmt->execute();
$member = $identityStmt->fetch(PDO::FETCH_ASSOC);

if ($legacyLink) {
    $targetUserId = intval($legacyLink['user_id']);
    $targetMember = oidc_member_by_id($connection, $targetUserId);

    if (!$targetMember) {
        oidc_clear_legacy_link_cookie();
        oidc_redirect_login('Unable to locate your account for linking.');
    }

    if ($targetMember['active'] !== '1') {
        oidc_clear_legacy_link_cookie();
        oidc_redirect_login('Your account is inactive. Please contact support.');
    }
    if (isset($targetMember['access_revoked']) && $targetMember['access_revoked'] === '1') {
        oidc_clear_legacy_link_cookie();
        oidc_redirect_login('Access has been revoked for your account.');
    }

    if ($member && intval($member['id']) !== $targetUserId) {
        oidc_clear_legacy_link_cookie();
        oidc_redirect_login('This provider identity is already linked to another account.');
    }

    if (!empty($claims['email']) && !empty($targetMember['email'])
        && strcasecmp(trim($claims['email']), trim($targetMember['email'])) !== 0) {
        oidc_clear_legacy_link_cookie();
        oidc_redirect_login('Provider email does not match your account email.');
    }

    if (!$member) {
        $insert = $connection->prepare(
            "INSERT INTO oidc_identities (issuer, subject, userID, email) VALUES (:issuer, :subject, :userID, :email)"
        );
        $insert->bindParam(':issuer', $claims['iss']);
        $insert->bindParam(':subject', $claims['sub']);
        $insert->bindParam(':userID', $targetUserId, PDO::PARAM_INT);
        $linkEmail = !empty($claims['email']) ? $claims['email'] : $targetMember['email'];
        $insert->bindParam(':email', $linkEmail);
        $insert->execute();
        $member = $targetMember;
    }

    oidc_clear_legacy_link_cookie();
}

if ($member) {
    if ($member['active'] !== '1') {
        oidc_redirect_login('Your account is inactive. Please contact support.');
    }
    if (isset($member['access_revoked']) && $member['access_revoked'] === '1') {
        oidc_redirect_login('Access has been revoked for your account.');
    }

    oidc_create_session_for_user($connection, intval($member['id']));
    header('Location: /#/night-crews');
    exit;
}

$challengeId = oidc_generate_challenge($connection, $claims, $claims['iss']);
oidc_redirect_login('', $challengeId);

?>
