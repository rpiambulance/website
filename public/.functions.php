<?php

require_once '.db_config.php';

function checkIfAdmin() {
  if(!isset($_GET['session_id'])) {
    return false;
  }

  session_start($_GET['session_id']);

  if(!isset($_SESSION['username'])) {
    return false;
  } else {
    $username = $_SESSION['username'];

    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if(!isset($dname)) {
      $dname = 'ambulanc_web';
    }

    $connection->exec("USE `$dname`");

    $statement=$connection->prepare("SELECT username, admin, schedco FROM members WHERE username = :username");
    $statement->bindParam(':username', $username);
    $statement->execute();

    $results=$statement->fetchAll(PDO::FETCH_ASSOC);

    return ($results[0]['admin'] == 1 || $results[0]['schedco'] == 1);
  }
}
