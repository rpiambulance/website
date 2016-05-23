<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";

$connection = new PDO($dsn, $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Selecting Database
//$db = mysql_select_db("$db_name", $connection);
$connection->exec("USE `$db_name`");

$statement=$connection->prepare("SELECT * FROM crews WHERE id > 1386");
$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);

for ($x = 0; $x <= sizeof($results); $x++) {
    echo "The number is: $x <br>";
}

$json=json_encode($results);

echo($json);
?>