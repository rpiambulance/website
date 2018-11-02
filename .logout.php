<?php
require_once ".db_config.php";
if(!isset($_GET['session_id'])) {
    http_response_code(400);
} else {
    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $connection->prepare('DELETE FROM sessions WHERE sessionID=:sessionID');
    $stmt->bindParam(":sessionID",$_GET['session_id']);
    $stmt->execute();
    // Expires in the past and therefore is deleted (This is redundent as it is removed in the javascript)
    //setcookie("RPIA-SESSION", $_GET['session_id'], time() - 360000, "/");
    echo 'true';
}

?>
