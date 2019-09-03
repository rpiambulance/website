<?php
if($_SERVER['REQUEST_METHOD'] === 'POST') {
  session_id($_POST['session_id']);

  require_once ".functions.php";
  require_once ".gcal.php";

  $calendar = new GoogleCalendar();

  $connection = openDatabaseConnection();

  if(!isset($_POST['event_id'])) {
    return;
  }

  $user = getUser($_POST['session_id'], $connection);
  $username = $user['username'];
  $eventId = $_POST['event_id'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  if($memberInfo['admin'] === '1') {
    $calendar->deleteEvent($eventId, false);
    $statement = $connection->prepare("DELETE FROM events_attendees WHERE eventid = :eventId");
    $statement->bindParam(':eventId', $eventId);
    $statement->execute();

    $statement = $connection->prepare("DELETE FROM events WHERE id = :eventId");
    $statement->bindParam(':eventId', $eventId);
    $statement->execute();
  }
}


?>
