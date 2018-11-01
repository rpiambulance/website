<?php
if($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_once ".db_config.php";

  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  if(!isset($_POST['game_id'])) {
    return;
  }

  include ".functions.php";
  $user = getUser($_POST['session_id'], $connection);
  $username = $user['username'];
  $gameId = $_POST['game_id'];
  $position = $_POST['position'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  $sql = "SELECT ees FROM games WHERE id = :gameId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->execute();
  $canEES = ($statement->fetchAll(PDO::FETCH_ASSOC)[0]['ees'] == 1);

  $sql = "SELECT id, position FROM games_crews WHERE memberid = :memberId AND gameid = :gameId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
  $alreadySignedUp = ($statement->rowCount() > 0);

  if($position == 'ees' && ($memberInfo['ees'] != 1 || !$canEES)) {
    echo 'invalid ees';
    return;
  } else if($position == 'cc' && $memberInfo['cctrainer'] != 1 && $memberInfo['crewchief'] != 1 && $memberInfo['backupcc'] != 1 && $memberInfo['firstresponsecc'] != 1) {
    echo 'invalid cc';
    return;
  } else if($position == 'driver' && $memberInfo['drivertrainer'] != 1 && $memberInfo['driver'] != 1 && $memberInfo['backupdriver'] != 1) {
    echo 'invalid driver';
    return;
  } else if($position == 'attendant' && $memberInfo['attendant'] != 1 && $memberInfo['cctrainer'] != 1 && $memberInfo['crewchief'] != 1 &&
            $memberInfo['backupcc'] != 1 && $memberInfo['firstresponsecc'] != 1 && $memberInfo['drivertrainer'] != 1 &&
            $memberInfo['driver'] != 1 && $memberInfo['backupdriver'] != 1) {
    echo 'invalid attendant';
    return;
  }

  if($alreadySignedUp && $statement->fetchAll(PDO::FETCH_ASSOC)[0]['position'] != $position) {
    $sql = "UPDATE games_crews SET position=:position WHERE memberid=:memberId AND gameid=:gameId";
  } else if(!$alreadySignedUp) {
    $sql = "INSERT INTO games_crews
      SELECT MAX(id) + 1 AS `id`, :gameId AS `gameid`, :memberId AS `memberid`, :position AS `position`
      FROM games_crews;
    ";
  } else {
    return;
  }

  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->bindValue(':memberId', $memberId);
  $statement->bindValue(':position', $position);
  $statement->execute();
}

?>
