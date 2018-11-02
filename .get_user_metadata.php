<?php

require_once '.db_config.php';
include ".functions.php";

if(isset($_GET['session_id'])){
  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  echo json_encode(getUser($_GET['session_id'], $connection));
}else{
  exit();
}
?>
