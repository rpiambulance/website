<?php
if($_SERVER['REQUEST_METHOD'] === 'POST') {
  session_id($_POST['session_id']);

  require_once ".db_config.php";

  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  if(!isset($_POST['event_id'])) {
    return;
  }
  include ".functions.php";
  $user = getUser($_POST['session_id'], $connection);
  $user = json_decode($user);
  $username = $user->{'username'};
  $eventId = $_POST['event_id'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  if($memberInfo['admin'] === '1') {
    $statement = $connection->prepare("DELETE FROM events_attendees WHERE eventid = :eventId");
    $statement->bindParam(':eventId', $eventId);
    $statement->execute();

    $statement = $connection->prepare("DELETE FROM events WHERE id = :eventId");
    $statement->bindParam(':eventId', $eventId);
    $statement->execute();
  }
}


?>
