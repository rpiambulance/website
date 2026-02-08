<?php

require_once '.oidc_common.php';

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
