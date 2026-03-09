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

$discovery = oidc_get_discovery();
$clientId = oidc_get_env('OIDC_CLIENT_ID', '');
$redirectUri = oidc_get_env('OIDC_REDIRECT_URI', '');
if (empty($redirectUri)) {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
    $redirectUri = $scheme . '://' . $host . '/.oidc_callback.php';
}

if (!$discovery || empty($discovery['authorization_endpoint']) || empty($clientId)) {
    header('Location: /#/login?oidc_error=' . urlencode('OIDC is not configured.'));
    exit;
}

$state = bin2hex(random_bytes(16));
$nonce = bin2hex(random_bytes(16));
setcookie('OIDC_STATE', $state, time() + 600, '/');
setcookie('OIDC_NONCE', $nonce, time() + 600, '/');

$scope = oidc_get_env('OIDC_SCOPE', 'openid profile email');

$params = array(
    'response_type' => 'code',
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'scope' => $scope,
    'state' => $state,
    'nonce' => $nonce
);

$isLegacyLink = isset($_GET['link_legacy']) && $_GET['link_legacy'] === '1';
if ($isLegacyLink) {
    $sessionId = isset($_COOKIE['RPIA-SESSION']) ? $_COOKIE['RPIA-SESSION'] : '';
    $connection = openDatabaseConnection();
    $user = ($connection && !empty($sessionId)) ? getUser($sessionId, $connection) : null;
    if (!$user || empty($user['id'])) {
        header('Location: /#/login?oidc_error=' . urlencode('You must be logged in to link your account.'));
        exit;
    }

    $payload = json_encode(array(
        'user_id' => intval($user['id']),
        'email' => isset($user['email']) ? $user['email'] : '',
        'exp' => time() + 600
    ));
    $payloadB64 = oidc_base64url_encode($payload);
    $signature = hash_hmac('sha256', $payloadB64, oidc_link_cookie_secret());
    setcookie('OIDC_LINK_LEGACY', $payloadB64 . '.' . $signature, time() + 600, '/');

    if (!empty($user['email'])) {
        $params['login_hint'] = $user['email'];
    }
}

$authUrl = $discovery['authorization_endpoint'] . '?' . http_build_query($params);
header('Location: ' . $authUrl);
exit;

?>
