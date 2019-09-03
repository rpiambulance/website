<?php
if($_SERVER['REQUEST_METHOD'] === 'POST') {
  session_id($_POST['session_id']);
  session_start();

  require_once ".functions.php";
  require_once ".gcal.php";

  $calendar = new GoogleCalendar();
  
  $connection = openDatabaseConnection();

  if(!isset($_POST['game_id'])) {
    return;
  }

  $user = getUser($_POST['session_id'], $connection);
  $username = $user['username'];
  $gameId = $_POST['game_id'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  if($memberInfo['admin'] === '1') {
    $calendar->deleteEvent($gameId, true);
    $statement = $connection->prepare("DELETE FROM games_crews WHERE gameid = :gameId");
    $statement->bindParam(':gameId', $gameId);
    $statement->execute();

    $statement = $connection->prepare("DELETE FROM games WHERE id = :gameId");
    $statement->bindParam(':gameId', $gameId);
    $statement->execute();
  }
}


?>
