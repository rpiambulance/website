<?php
if (isset($_GET['session_id'])){
  updateSession($sessionID);
  $key = $_GET['key'];

  if(!isset($key)){
    exit();
  }
  
  if($key == "username"){
    include ".get_user_metadata.php";
    $user = getUser($_GET['session_id']);
    $user = json_decode($user);
    $username = $user->{'username'};
    echo json_encode(array($key => $username));
  }else{
    echo "Unsupported Key";
  }
}else{
  exit();
}
function updateSession($sessionID){
  require_once ".db_config.php";
  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }
  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $stmt = $connection->prepare('SELECT * FROM `sessions` WHERE sessionID = :sessionID');
  $stmt->bindParam(":sessionID", $_GET['session_id']);
  $stmt->execute();
  $current_session = $stmt->fetch();
  date_default_timezone_set('America/New_York');
  $current_date = new DateTime();
  $expiration = strtotime($current_session['expiration']);
  if (strtotime($current_date) < $expiration){
    $current_date = $current_date->modify('+5 day');
    $current_date = $current_date->format('Y-m-d H:i:s');
    $stmt = $connection->prepare('UPDATE sessions SET expiration=:expiration WHERE sessionID=:sessionID');
    $stmt->bindParam(":sessionID",$_GET['session_id']);
    $stmt->bindParam(":expiration", $current_date);
    $stmt->execute();
    setcookie("RPIA-SESSION", $_GET['session_id'], strtotime("+5 day", time()), "/");
  }else{
    $stmt = $connection->prepare('DELETE FROM `sessions` WHERE sessionID=:sessionID');
    $stmt->bindParam(":sessionID",$_GET['session_id']);
    $stmt->execute();
    // Expires in the past and therefore is deleted
    setcookie("RPIA-SESSION", $_GET['session_id'], time() - 360000, "/");
  }
}

?>
