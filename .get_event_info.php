<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

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

  // Selecting Database
  $connection->exec("USE `$dname`");

  $results = array();

  $sql = "SELECT *, UNIX_TIMESTAMP(start) AS start_epoch, UNIX_TIMESTAMP(end) AS end_epoch FROM events WHERE id = :eventId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->execute();
  $results['event'] = $statement->fetchAll(PDO::FETCH_ASSOC)[0];

  $sql = "SELECT
    a.memberid,
    m.first_name,
    m.last_name,
    (a.memberId = :memberId) as is_viewing_member,
    CONCAT(SUBSTRING(m.first_name, 1, 1), \". \", m.last_name) AS ambulance_name
  FROM
    events_attendees a,
    members m
  WHERE
    a.memberid = m.id AND
    a.eventid = :eventId
  ORDER BY
    a.id ASC
  ";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
  $results['attendees'] = $statement->fetchAll(PDO::FETCH_ASSOC);

  $sql = "SELECT COUNT(*) AS count FROM events_attendees WHERE memberid = :memberId AND eventid = :eventId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':eventId', $eventId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
  $results['alreadySignedUp'] = ($statement->fetchAll(PDO::FETCH_ASSOC)[0]['count'] > 0);

  $results['success'] = true;

  $json=json_encode($results);

  echo($json);
}
?>
