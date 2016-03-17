<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";

$connection = new PDO($dsn, $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Selecting Database
//$db = mysql_select_db("$db_name", $connection);
$connection->exec("USE `$db_name`");

$result = $connection->prepare("SELECT * FROM crews WHERE id > 490");

$outp = "";
while($rs = $result->fetch(PDO::FETCH_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .= '{"id":"'  . $rs["id"] . '",';
    $outp .= '"date":"'   . $rs["date"]        . '",';
    $outp .= '"cc":"'   . $rs["cc"]        . '",';
    $outp .= '"driver":"'   . $rs["driver"]        . '",';
    $outp .= '"attendant":"'   . $rs["attendant"]        . '",';
    $outp .= '"observer":"'. $rs["observer"]     . '"}';
}
$outp ='{"records":['.$outp.']}';
$connection= null;

echo(json_encode($outp));
?>