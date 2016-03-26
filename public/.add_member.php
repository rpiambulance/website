<?php

require_once ".db_config.php";

// empty response
$response = null;

//array to hold errors
$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

$first_name = $input['first_name'];
$last_name = $input['last_name'];
$password = $input['password'];
$password= md5($password);
$email = $input['email'];
$rcs = $input['RCS'];
$rin = $input['RIN'];
$home_phone= $input['phone'];
$cell_phone= $input['c_phone'];
$rpi_address= $input['rpi_add'];
$home_address= $input['home_add'];
$dob= $input['dob'];


$connection = new PDO($dsn, $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Selecting Database
//$db = mysql_select_db("$db_name", $connection);
$connection->exec("USE `$db_name`");

$statement = $connection->prepare("SELECT * FROM members WHERE username = '$username'");

$usernamecheck = mysql_num_rows($statement);
if ($usernamecheck == 0) {
    $highID = $connection->exec("SELECT MAX(id) FROM members");
    $logid = $highID + 1;
    $connection->exec("INSERT INTO members (id, username, password, first_name, last_name, dob, email, rcs_id, rin, rpi_address, home_address, cell_phone, home_phone) VALUES ($logid, '$username', '$password', '$first_name', '$last_name', '$dob', '$email', '$rcs_id', $rin, '$rpi_address', '$home_address', '$cell_phone', '$home_phone')");
}

?>