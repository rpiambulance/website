<?php
if($_SERVER['REQUEST_METHOD'] === 'POST') {

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
  $username = $user['username'];
  $eventId = $_POST['event_id'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  $sql = "SELECT COUNT(*) AS count FROM events_attendees WHERE memberid = :memberId AND eventid = :eventId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
  $alreadySignedUp = ($statement->fetchAll(PDO::FETCH_ASSOC)[0]['count'] > 0);

  if(!$alreadySignedUp) {
    return;
  }

  $sql = "DELETE FROM events_attendees WHERE eventid = :eventId AND memberid = :memberId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
}
?>
