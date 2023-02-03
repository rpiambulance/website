  <?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");


require_once ".db_config.php";

include ".functions.php";
$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$user = getUser($_GET['session_id'], $connection);
$username = $user['username'];

if (checkIfAdmin($connection)){
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  // Selecting Database
  //$db = mysql_select_db("$dname", $connection);
  $connection->exec("USE `$dname`");

  $sql = "SELECT members.first_name, members.last_name, games_crews.gameid, games.date FROM members INNER JOIN (games_crews INNER JOIN games ON games.id = games_crews.gameid)ON games_crews.memberid = members.id WHERE dob != 0000-00-00";

  $sql .= " AND games_crews.gameid > 300";

  $statement=$connection->prepare($sql);

  if(isset($_GET['member_id'])) {
    $statement->bindParam(':id', $_GET['member_id']);
  }

  $statement->execute();
  $results=$statement->fetchAll(PDO::FETCH_ASSOC);
  $json=json_encode($results);



  // $sql = "SELECT members.first_name, members.last_name, crews.id, crews.date FROM members INNER JOIN crews ON (crews.cc = members.id OR crews.driver = members.id OR crews.attendant = members.id OR crews.observer = members.id)WHERE dob != 0000-00-00";

  // $sql .= " AND crews.id > 3800";

  // $statement=$connection->prepare($sql);

  // if(isset($_GET['member_id'])) {
  //   $statement->bindParam(':id', $_GET['member_id']);
  // }

  // $statement->execute();
  // $results.=$statement->fetchAll(PDO::FETCH_ASSOC);
  // $json=json_encode($results);


  echo($json);

} else {
  echo 'Nice Try.';
}

?>