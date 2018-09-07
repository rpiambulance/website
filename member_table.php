<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");


require_once ".db_config.php";

session_id($_GET['session_id']);
session_start();
if(!isset($_SESSION['username'])) {
  echo 0;
} else {
  $username = $_SESSION['username'];
	

$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
  $dname = 'ambulanc_web';
}

// Selecting Database
//$db = mysql_select_db("$dname", $connection);
$connection->exec("USE `$dname`");

$sql = "SELECT * FROM members WHERE dob != 0000-00-00";

if(isset($_GET['member_id'])) {
  $sql .= ' AND id = :id';
} else if(!isset($_GET['include_inactive'])) {
  $sql .= " AND active = 1";
}

$statement=$connection->prepare($sql);

if(isset($_GET['member_id'])) {
  $statement->bindParam(':id', $_GET['member_id']);
}

$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);
$json=json_encode($results);

echo($json);
}
?>