<?php

require_once '.oidc_common.php';

header('Content-Type: application/json');

$clientId = oidc_get_env('OIDC_CLIENT_ID', '');
$provider = oidc_get_env('OIDC_PROVIDER_NAME', 'OpenID');
$issuer = oidc_get_env('OIDC_ISSUER', '');

echo json_encode(array(
    'enabled' => !empty($clientId) && !empty($issuer),
    'provider' => $provider,
    'client_id' => $clientId,
    'issuer' => $issuer,
    'start_url' => '.oidc_start.php'
));

?>
