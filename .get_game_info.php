<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  session_start($_POST['session_id']);

  require_once ".db_config.php";

  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  if(!isset($_POST['game_id'])) {
    return;
  }

  $username = $_SESSION['username'];
  $gameId = $_POST['game_id'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  // Selecting Database
  $connection->exec("USE `$dname`");

  $results = array();

  $sql = "SELECT *, UNIX_TIMESTAMP(start) AS start_epoch, UNIX_TIMESTAMP(end) AS end_epoch FROM games WHERE id = :gameId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->execute();
  $results['game'] = $statement->fetchAll(PDO::FETCH_ASSOC)[0];

  $sql = "SELECT
    c.memberid,
    c.position,
    m.first_name,
    m.last_name,
    (c.memberId = :memberId) as is_viewing_member,
    CONCAT(SUBSTRING(m.first_name, 1, 1), \". \", m.last_name) AS ambulance_name
  FROM
    games_crews c,
    members m
  WHERE
    c.memberid = m.id AND
    c.gameid = :gameId
  ORDER BY
    c.id ASC
  ";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
  $results['attendees'] = $statement->fetchAll(PDO::FETCH_ASSOC);

  $sql = "SELECT id, position FROM games_crews WHERE memberid = :memberId AND gameid = :gameId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
  
  $results['alreadySignedUp'] = ($statement->rowCount() > 0);
  if($results['alreadySignedUp'] > 0) {
    $results['currentPosition'] = $statement->fetchAll(PDO::FETCH_ASSOC)[0]['position'];
  } else {
    $results['currentPosition'] = null;
  }

  $results['eligiblePositions'] = [];

  if($memberInfo['ees'] == 1) {
    $results['eligiblePositions'][] = 'ees';
  }

  if($memberInfo['cctrainer'] == 1 || $memberInfo['crewchief'] == 1 || $memberInfo['backupcc'] == 1) {
    $results['eligiblePositions'][] = 'cc';
  }

  if($memberInfo['drivertrainer'] == 1 || $memberInfo['driver'] == 1 || $memberInfo['backupdriver'] == 1) {
    $results['eligiblePositions'][] = 'driver';
  }

  if($memberInfo['attendant'] == 1 || $memberInfo['cctrainer'] == 1 || $memberInfo['crewchief'] == 1 ||
     $memberInfo['backupcc'] == 1 || $memberInfo['drivertrainer'] == 1 || $memberInfo['driver'] == 1 ||
     $memberInfo['backupdriver'] == 1) {
    $results['eligiblePositions'][] = 'attendant';
  }

  $results['eligiblePositions'][] = 'observer';

  $results['success'] = true;

  $json=json_encode($results);

  echo($json);
}
?>
