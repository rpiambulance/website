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

$user = $input['userid'];
$time = date("h:i:sa");
$date = date("Y-m-d");
$vehicle = $input["vehicle"];
$qty = $input['qty'];
$mileage = $input['miles'];


$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
  $dname = 'ambulanc_web';
}

// Selecting Database
//$db = mysql_select_db("$dname", $connection);
$connection->exec("USE `$dname`");

$statement = $connection->prepare("SELECT MAX(id) FROM fuel_log");
$statement->execute();
$row = $statement->fetchAll(PDO::FETCH_ASSOC)[0];

$logid = $row["MAX(id)"] + 1;

$statement = $connection->prepare("INSERT INTO fuel_log(id, date, time, user, vehicle, amount, mileage) VALUES (:logid, :date, :time, :user, :vehicle, :amount, :mileage)");
$statement->bindValue(':logid', $logid);
$statement->bindValue(':date', $date);
$statement->bindValue(':time', substr($time, 0, 8));
$statement->bindValue(':user', $user);
$statement->bindValue(':vehicle', $vehicle);
$statement->bindValue(':amount', $qty);
$statement->bindValue(':mileage', $mileage);
$statement->execute();

$data['success']= true;

$connection= null;

echo(json_encode($data));

?>
