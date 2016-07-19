<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");


require_once ".db_config.php";
require_once ".functions.php";

$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
  $dname = 'ambulanc_web';
}

// Selecting Database
//$db = mysql_select_db("$dname", $connection);
$connection->exec("USE `$dname`");

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  if(checkIfAdmin()) {
    $data = json_decode($_POST['data'], true);

    try {
      foreach($data as $elem) {
        $sql = "UPDATE default_crews SET cc=:cc, driver=:driver, attendant=:attendant, observer=:observer WHERE day=:day";
        $statement = $connection->prepare($sql);
        $statement->bindParam(':cc', $elem['cc']);
        $statement->bindParam(':driver', $elem['driver']);
        $statement->bindParam(':attendant', $elem['attendant']);
        $statement->bindParam(':observer', $elem['observer']);
        $statement->bindParam(':day', $elem['day']);
        $result = $statement->execute();
      }
      echo(json_encode(array('success' => true)));
    } catch (PDOException $e) {
      echo(json_encode(array('success' => false, 'error' => $e)));
    }
  } else {
    echo 'nice try';
  }
} else {
  $statement= $connection->prepare("SELECT * FROM default_crews");
  $statement->execute();
  $results=$statement->fetchAll(PDO::FETCH_ASSOC);
  $json=json_encode($results);
  echo($json);
  // LOAD DATA
}

?>
