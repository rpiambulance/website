<?php

require_once ".db_config.php";
require_once ".functions.php";
require_once ".oidc_common.php";

// empty response
$response = null;

//array to hold errors
$errors = array();

// array to pass back data
$data = array();

function add_member_error_message($errorCode, $errorDetail = '') {
  $map = array(
    'missing_username' => 'Username is required.',
    'missing_email' => 'Email is required.',
    'missing_first_name' => 'First name is required.',
    'missing_last_name' => 'Last name is required.',
    'provider_username_exists' => 'That username is already in use in the identity provider.',
    'provider_email_exists' => 'That email is already in use in the identity provider.',
    'provider_account_exists' => 'An account already exists in the identity provider with the submitted details.',
    'admin_client_missing' => 'OIDC client credentials are missing or incomplete.',
    'admin_token_failed' => 'Unable to authenticate to the identity provider admin API.',
    'issuer_invalid' => 'OIDC issuer is not configured correctly.',
    'provider_create_failed' => 'The identity provider rejected account creation.',
    'provider_create_lookup_failed' => 'Account was created but could not be verified in the identity provider.',
    'provider_execute_actions_email_failed' => 'Account was created, but sending the setup email failed.'
  );

  if (isset($map[$errorCode])) {
    if ($errorCode === 'provider_create_failed' && !empty($errorDetail)) {
      return $map[$errorCode] . ' (' . $errorDetail . ')';
    }
    return $map[$errorCode];
  }

  return !empty($errorDetail) ? ($errorCode . ' (' . $errorDetail . ')') : $errorCode;
}

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

$first_name = isset($input['first_name']) ? trim($input['first_name']) : '';
$last_name = isset($input['last_name']) ? trim($input['last_name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$username = isset($input['user_name']) ? trim($input['user_name']) : '';
$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
if (checkIfAdmin($connection)){
  try {
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (empty($first_name) || empty($last_name) || empty($email) || empty($username)) {
      throw new Exception("First name, last name, username, and email are required.");
    }

    // Provision OpenID account only; no legacy members row is created here.
    $result = oidc_provider_create_user(array(
      'username' => $username,
      'email' => $email,
      'first_name' => $first_name,
      'last_name' => $last_name
    ));

    if(!empty($result['ok'])) {
      $data['success'] = true;
      $data['provider_account_created'] = !empty($result['created']);
    } else {
      $data['success'] = false;
      $errorCode = !empty($result['error']) ? $result['error'] : 'provider_create_failed';
      $errorDetail = !empty($result['error_detail']) ? $result['error_detail'] : '';
      $data['error'] = add_member_error_message($errorCode, $errorDetail);
    }
  } catch(PDOException $e) {
    $data['success'] = false;
    $data['error'] = $e->getMessage();
  } catch(Exception $e){
    $data['success'] = false;
    $data['error'] = $e->getMessage();
  }
  echo(json_encode($data));
} else {
  echo "Nice try.";
}

?>
