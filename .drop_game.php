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

  $sql = "SELECT COUNT(*) AS count FROM games_crews WHERE memberid = :memberId AND gameid = :gameId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
  $alreadySignedUp = ($statement->fetchAll(PDO::FETCH_ASSOC)[0]['count'] > 0);

  if(!$alreadySignedUp) {
    return;
  }

  $sql = "DELETE FROM games_crews WHERE gameid = :gameId AND memberid = :memberId";
  $statement=$connection->prepare($sql);
  $statement->bindValue(':gameId', $gameId);
  $statement->bindValue(':memberId', $memberId);
  $statement->execute();
}
?>
