<?php

require_once '.db_config.php';
include ".functions.php";
require_once '.oidc_common.php';

if(isset($_GET['session_id'])){
  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $user = getUser($_GET['session_id'], $connection);
  if (!$user || !isset($user['id'])) {
    exit();
  }

  $user['identity_managed'] = false;
  $user['identity_provider'] = oidc_get_env('OIDC_PROVIDER_NAME', 'OpenID');
  $user['account_portal_url'] = 'https://account.rpiambulance.com';

  $issuer = rtrim(oidc_get_env('OIDC_ISSUER', ''), '/');
  if (!empty($issuer)) {
    $identityStmt = $connection->prepare(
      "SELECT issuer, subject FROM oidc_identities WHERE userID = :userID AND issuer = :issuer LIMIT 1"
    );
    $identityStmt->bindParam(':userID', $user['id'], PDO::PARAM_INT);
    $identityStmt->bindParam(':issuer', $issuer);
    $identityStmt->execute();
    $identity = $identityStmt->fetch(PDO::FETCH_ASSOC);

    if ($identity) {
      $providerUser = oidc_provider_get_user_by_subject($identity['issuer'], $identity['subject']);
      if (!empty($providerUser['ok']) && !empty($providerUser['found']) && !empty($providerUser['user'])) {
        $p = $providerUser['user'];
        if (!empty($p['firstName'])) {
          $user['first_name'] = $p['firstName'];
        }
        if (!empty($p['lastName'])) {
          $user['last_name'] = $p['lastName'];
        }
        if (!empty($p['username'])) {
          $user['username'] = $p['username'];
        }
        if (!empty($p['email'])) {
          $user['email'] = $p['email'];
        }
        $user['identity_managed'] = true;
      }
    }
  }

  echo json_encode($user);
}else{
  exit();
}
?>
