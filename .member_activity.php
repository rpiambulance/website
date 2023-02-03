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

  $game_sql =  "SELECT members.first_name, members.last_name, count(games_crews.memberid) AS games_count
                FROM members 
                INNER JOIN games_crews 
                  ON members.id = games_crews.memberid
                WHERE games_crews.gameid > 290
                GROUP BY members.id";

  $night_sql = "SELECT members.first_name, members.last_name, count(night_crews.memberid) AS nights_count
                FROM members
                INNER JOIN (
                    SELECT id AS crewid, cc AS memberid FROM crews
                    UNION ALL
                    SELECT id AS crewid, driver AS memberid FROM crews
                    UNION ALL
                    SELECT id AS crewid, attendant AS memberid FROM crews
                    UNION ALL
                    SELECT id AS crewid, observer AS memberid FROM crews
                    ORDER BY crewid ) AS night_crews
                  ON members.id = night_crews.memberid
                WHERE night_crews.crewid > 2891
                GROUP BY members.id";


  $game_statement=$connection->prepare($game_sql);
  $game_statement->execute();
  $game_results=$game_statement->fetchAll(PDO::FETCH_ASSOC);

  $night_statement=$connection->prepare($night_sql);
  $night_statement->execute();
  $night_results=$night_statement->fetchAll(PDO::FETCH_ASSOC);


  $json=json_encode($game_results, JSON_NUMERIC_CHECK);


  echo($json);

} else {
  echo 'Nice Try.';
}

?>