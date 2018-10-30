<?php

require_once '.db_config.php';

if(isset($_GET['session_id'])){
  echo getUser($_GET['session_id']);
}else{
  exit();
}
function getUser($sessionID){
  if(isset($sessionID)){
    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
    if(!isset($dname)) {
      $dname = 'ambulanc_web';
    }
  
    $connection->exec("USE `$dname`");
  
    $statement = $connection->prepare('SELECT * FROM members LEFT JOIN sessions on sessions.userID = members.id WHERE sessions.sessionID = :sessionID');
    $statement->bindParam(":sessionID", $sessionID);
    $statement->execute();
    include ".get_session_info.php";
    updateSession($sessionID);
    $results=$statement->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($results[0]);
  }
}
?>
