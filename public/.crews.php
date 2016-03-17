<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";

$connection = new mysqli($dsn, $duser, $dpassword);
//$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Selecting Database
//$db = mysql_select_db("$db_name", $connection);
$connection->query("USE `$db_name`");

$query= "select date, cc, driver, attendent, observer from crews";

$result = $connection->query($query) or die($connection->error.__LINE__);

$arr = array(); if($result->num_rows > 0)

{

    while($row = $result->fetch_assoc()) { $arr[] = $row; }

}

//JSON-encode the response

print("Test");

echo $json_response = json_encode($arr);
?>