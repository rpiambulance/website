<?php

date_default_timezone_set('America/New_York');



function getOos($connection) {
  $statement = $connection->query("SELECT cc, driver FROM `crews` WHERE date = (SELECT DATE(SUBTIME(CURRENT_TIMESTAMP(), '6:0:0')))");
  $statement->execute();
  $oos = $statement->fetchAll(PDO::FETCH_ASSOC);
  if (($oos[0]["cc"] == -2) || ($oos[0]["driver"] == -2)) {
    return 1;
  } else {
    return 0;
  }
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

  echo getOos($connection);

} catch (Exception $e) {
  echo $e;
}

?>
