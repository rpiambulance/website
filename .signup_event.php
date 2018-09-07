<?php
if($_SERVER['REQUEST_METHOD'] === 'POST') {
  session_id($_POST['session_id']);
  session_start();

  require_once ".db_config.php";

  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  if(!isset($_POST['event_id'])) {
    return;
  }

  $username = $_SESSION['username'];
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

  if($alreadySignedUp) {
    return;
  }

  $sql = "SELECT COUNT(id) AS `count` FROM events_attendees WHERE eventid = :eventId GROUP BY eventid";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->execute();

  if($statement->rowCount() < 1) {
    $currentCount = 0;
  } else {
    $currentCount = $statement->fetchAll(PDO::FETCH_ASSOC)[0]['count'];
  }

  $sql = "SELECT `limit` FROM events WHERE id = :eventId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->execute();
  $limit = $statement->fetchAll(PDO::FETCH_ASSOC)[0]['limit'];

  if($limit == '-1' || ($limit != '0' && $currentCount >= intval($limit))) {
    return;
  }

  $sql = "INSERT INTO events_attendees
    SELECT MAX(id) + 1 AS `id`, :eventId AS `eventid`, :memberId AS `memberid`
    FROM events_attendees;
  ";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
}


?>
