<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";
require_once ".functions.php";

main();

function pullData($connection, $sql, $mindate, $maxdate) {
  $statement=$connection->prepare($sql);
  $statement->bindParam(':mindate', $mindate);
  $statement->bindParam(':maxdate', $maxdate);
  
  $statement->execute();
  $results=$statement->fetchAll(PDO::FETCH_ASSOC);

  return $results;
}

function cleanResults($merged_results) {
  $results = array();
  $columns = array();

  // combine rows that have the same $id value 
  foreach($merged_results as $row) {
    // $id = intval($row['id']);
    $id = $row['id'];
                
    foreach($row as $key=>$value) {
      // initialize the member
      if ($key == 'id' && !array_key_exists($id, $results)) {
        $results[$id] = array();
        continue;
      }

      if (!array_key_exists($key, $results[$id])) {
        $results[$id][$key] = $value;
      }

      if ($key == 'first_name' || $key == 'last_name') continue;
      
      array_push($columns, $key);
    }
  }

  $columns = array_unique($columns);
  foreach($results as &$row) {
    foreach($columns as $col) {
      if (!array_key_exists($col, $row)) {
        $row[$col] = 0;
      }

    }
  }

  return $results;
}

function main() {
  $connection = openDatabaseConnection();

  parse_str(file_get_contents("php://input"), $post);

  $user = getUser($post['session_id'], $connection);

  if ($user['admin'] == 1){

    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if(!isset($dname)) {
      $dname = 'ambulanc_web';
    }

    // Selecting Database
    $connection->exec("USE `$dname`");

    // ensure date range is set
    if((!isset($post['min_date']) || !isset($post['max_date']))) {
      header('Bad Request', true, 400);
      echo 'Bad Request';
      exit;
    }

    $mindate = $post['min_date'];
    $maxdate = $post['max_date'];

    $game_sql =  "SELECT members.id, members.first_name, members.last_name, count(full_games.memberid) AS games_count
                  FROM members 
                  INNER JOIN (
                    SELECT games_crews.memberid, games.date, games_crews.gameid
                    FROM games_crews 
                    INNER JOIN games
                      ON games.id = games_crews.gameid) AS full_games
                    ON members.id = full_games.memberid
                  WHERE full_games.date > :mindate AND full_games.date < :maxdate AND members.id > 0
                  GROUP BY members.id";

    $night_sql = "SELECT members.id, members.first_name, members.last_name, count(night_crews.memberid) AS nights_count
                  FROM members
                  INNER JOIN (
                      SELECT id AS crewid, crews.date, cc AS memberid FROM crews
                      UNION ALL
                      SELECT id AS crewid, crews.date, driver AS memberid FROM crews
                      UNION ALL
                      SELECT id AS crewid, crews.date, attendant AS memberid FROM crews
                      UNION ALL
                      SELECT id AS crewid, crews.date, observer AS memberid FROM crews
                      ORDER BY crewid ) AS night_crews
                    ON members.id = night_crews.memberid
                  WHERE night_crews.date > :mindate AND night_crews.date < :maxdate AND members.id > 0
                  GROUP BY members.id";

    $game_results = pullData($connection, $game_sql, $mindate, $maxdate);
    $night_results = pullData($connection, $night_sql, $mindate, $maxdate);

    $merged_results = array_merge($night_results, $game_results);
    $clean_results = cleanResults($merged_results);
                    
    $json=json_encode($clean_results, JSON_NUMERIC_CHECK);

    header("Content-Type: application/json; charset=UTF-8");  
    echo($json);

  } else {
    echo 'Nice Try.';
  }
}
?>