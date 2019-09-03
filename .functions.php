<?php

function checkIfAdmin($connection) {

  if(!isset($_GET['session_id'])) {
    return false;
  }

  $user = getUser($_GET['session_id'], $connection);
  $username = $user['username'];
  if(!isset($username)) {
    return false;
  } else {
    
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

function getUser($sessionID, $connection){
  if(isset($sessionID)){
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
    if(!isset($dname)) {
      $dname = 'ambulanc_web';
    }
  
    $connection->exec("USE `$dname`");
  
    $statement = $connection->prepare('SELECT * FROM members LEFT JOIN sessions on sessions.userID = members.id WHERE sessions.sessionID = :sessionID');
    $statement->bindParam(":sessionID", $sessionID);
    $statement->execute();
    $results=$statement->fetchAll(PDO::FETCH_ASSOC);
    updateSession($sessionID, $connection);
    return $results[0];
  }
}

function updateSession($sessionID, $connection){
  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // Just prune the database for expired sessions everytime
  $stmt = $connection->prepare('DELETE FROM sessions WHERE expiration <= NOW()');
  $stmt->execute();
  $stmt = $connection->prepare('SELECT * FROM `sessions` WHERE sessionID = :sessionID');
  $stmt->bindParam(":sessionID", $sessionID);
  $stmt->execute();
  $current_session = $stmt->fetch();
  date_default_timezone_set('America/New_York');
  $current_date = new DateTime();
  $expiration = strtotime($current_session['expiration']);
  if (time() < $expiration){
    $current_date = $current_date->modify('+5 day');
    $current_date = $current_date->format('Y-m-d H:i:s');
    $stmt = $connection->prepare('UPDATE sessions SET expiration=:expiration WHERE sessionID=:sessionID');
    $stmt->bindParam(":sessionID",$sessionID);
    $stmt->bindParam(":expiration", $current_date);
    $stmt->execute();
    setcookie("RPIA-SESSION", $sessionID, strtotime("+5 day", time()), "/");
  }
}

function openDatabaseConnection(){
  try{
    include '.db_config.php';
    $connection = new PDO($dsn, $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
    if(!isset($dname)) {
      $dname = 'ambulanc_web';
    }
  
    // Selecting Database
    $connection->exec("USE `$dname`");
    
    return $connection;
  }catch(PDOException $e){
    echo $e;
    return null;
  }
}