<?php

  require_once '.db_config.php';

  if(!isset($_GET['session_id'])) {
    http_response_code(400);
  } else {
    session_start($_GET['session_id']);
    $username = $_SESSION['username'];

    if(!isset($_SESSION['username'])) {
      echo json_encode(array("admin" => false, "scheduling_coordinator" => false));
    } else {
      $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
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
