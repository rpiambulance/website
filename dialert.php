<?php

date_default_timezone_set('America/New_York');

function getDutySup($connection) {
  $statement = $connection->query("SELECT dutysup FROM `crews` WHERE date = curdate()");
  $statement->execute();
  $ds = $statement->fetchAll(PDO::FETCH_ASSOC);
  return $ds[0]["dutysup"];
}

require_once ".db_config.php";

if (!isset($_GET["token"]) || $_GET["token"] != $slacktoken) {
  die("nope.");
}

try {

  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  $connection->exec("USE `$dname`");

  echo getDutySup($connection);

} catch (Exception $e) {
  echo $e;
}

?>
