<?php

require_once '.oidc_common.php';

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

$authUrl = $discovery['authorization_endpoint'] . '?' . http_build_query($params);
header('Location: ' . $authUrl);
exit;

?>
