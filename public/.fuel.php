<?php

require_once ".recaptchalib.php";
require_once ".db_config.php";
require_once ".form_config.php";

$response = null;

// check secret key
$reCaptcha = new ReCaptcha($secret);

$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

// if submitted check response
if (isset($input['g-recaptcha-response'])) {
    $response = $reCaptcha->verifyResponse(
        $_SERVER["REMOTE_ADDR"],
        $input["g-recaptcha-response"]
    );
}

if ($response == null) {
    $errors['reCaptcha'] = 'You did not validate your submission with our reCaptcha.';
} else if($response != null && !$response->success) {
    $errors['reCaptcha'] = 'Your reCaptcha verification did not succeed. Please try again.';
}

$user = $input['name'];
$time = date("h:i:sa");
$date = date("Y-m-d");
$vehicle = $input["vehicle"];
$amount = $input['qty'];
$mileage = $input['mileage'];


$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
  $dname = 'ambulanc_web';
}

// Selecting Database
//$db = mysql_select_db("$dname", $connection);
$connection->exec("USE `$dname`");
//$connection->exec("USE fuel_log");

$highID = $connection->exec("SELECT MAX(id) FROM fuel_log");
  $logid = $highID + 1;

$connection->exec("INSERT INTO fuel_log(id, date, time, user, vehicle, amount, mileage) VALUES ($logid, '$date', '$time', '$user', '$vehicle', '$amount', '$mileage')");
  $data['success']= true;

$connection= null;

echo(json_encode($data));

?>
