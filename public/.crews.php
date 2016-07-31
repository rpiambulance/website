<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";

$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
  $dname = 'ambulanc_web';
}

// Selecting Database
//$db = mysql_select_db("$dname", $connection);
$connection->exec("USE `$dname`");

try {
  $statement=$connection->prepare("SELECT * FROM $dname.night_crews_view");
  $statement->execute();
  $results=$statement->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(array("result" => $results, "success" => true));
} catch (Exception $e) {
  echo json_encode(array("error" => $e, "success" => false));
}

// for ($x = 0; $x <= sizeof($results); $x++) {
//     echo "The number is: $x <br>";
// }

?>
