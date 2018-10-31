<?php

  require_once '.db_config.php';

  if(!isset($_GET['session_id'])) {
    http_response_code(400);
  } else {
    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    include ".functions.php";
    $user = getUser($_GET['session_id'], $connection);
    $user = json_decode($user);
    $username = $user->username;

    if(!isset($username)) {
      echo json_encode(array("admin" => false, "scheduling_coordinator" => false));
    } else {
      $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      if(!isset($dname)) {
        $dname = 'ambulanc_web';
      }

      // Selecting Database
      //$db = mysql_select_db("$dname", $connection);
      $connection->exec("USE `$dname`");

      $statement=$connection->prepare("SELECT username, admin, schedco FROM members WHERE username = :username");
      $statement->bindParam(':username', $username);
      $statement->execute();

      $results=$statement->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($results[0]);
    }
  }

?>
