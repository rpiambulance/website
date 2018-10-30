<?php

require_once '.db_config.php';

function checkIfAdmin() {
  global $dhost, $dname, $duser, $dpassword;

  if(!isset($_GET['session_id'])) {
    return false;
  }

  include ".get_user_metadata.php";
  $user = getUser($_GET['session_id']);
  $user = json_decode($user);
  $username = $user->{'username'};
  if(!isset($username)) {
    return false;
  } else {
    $connection = new PDO("mysql:host={$dhost};dbname={$dname}", $duser, $dpassword);
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
