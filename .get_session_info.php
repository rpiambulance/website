<?php
require_once ".db_config.php";
include ".functions.php";
if (isset($_GET['session_id'])){
  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  updateSession($sessionID, $connection);
  $key = $_GET['key'];

  if(!isset($key)){
    exit();
  }
  
  if($key == "username"){
    $user = getUser($_GET['session_id'], $connection);
    $user = json_decode($user);
    $username = $user->{'username'};
    echo json_encode(array($key => $username));
  }else{
    echo "Unsupported Key";
  }
}else{
  exit();
}

?>
