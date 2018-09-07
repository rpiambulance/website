<?php

require_once '.db_config.php';

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

  $connection->exec("USE `$dname`");

  $statement = $connection->prepare('SELECT * FROM members WHERE username = :username');
  $statement->bindParam(":username", $username);
  $statement->execute();

  $results=$statement->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode($results[0]);
}
?>
