<?php

require_once ".db_config.php";

$connection = new PDO($dsn, $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Selecting Database
//$db = mysql_select_db("$db_name", $connection);
$connection->exec("USE `$db_name`");

$statement=$connection->prepare("SELECT * FROM members WHERE username = '$username'");

$usernamecheck = mysql_num_rows($statement);
if($usernamecheck == 0)
{
    $highID = $connection->exec("SELECT MAX(id) FROM members");
    $logid = $highID+1;
    $connection->exec("INSERT INTO members (id, username, password, first_name, last_name, dob, email, rcs_id, rin, rpi_address, home_address, cell_phone, home_phone) VALUES ($logid, '$username', '$password', '$first_name', '$last_name', '$dob', '$email', '$rcs_id', $rin, '$rpi_address', '$home_address', '$cell_phone', '$home_phone')");
}

?>