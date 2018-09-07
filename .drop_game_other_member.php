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
  $memberToDelete = $_POST['member_id'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  if($memberInfo['admin'] === '1') {
    $sql = "DELETE FROM games_crews WHERE gameid = :gameId AND memberid = :memberId";
    $statement=$connection->prepare($sql);
    $statement->bindValue(':gameId', $gameId);
    $statement->bindValue(':memberId', $memberToDelete);
    $statement->execute();
  }
}
?>
