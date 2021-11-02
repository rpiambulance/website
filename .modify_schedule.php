<?php

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

$secret = "SUPERSECRETADMINKEYWOOHOO";

parse_str(file_get_contents("php://input"), $post);

$weeks = ['currentWeek', 'nextWeek'];
if (checkIfAdmin($connection)){
  $post['data'] = json_decode($post['data'], true);

  foreach($weeks as $w) {
    foreach($post['data'][$w] as $elem) {
      $sql = "UPDATE crews SET cc=:cc, driver=:driver, attendant=:attendant, observer=:observer, dutysup=:dutysup WHERE id=:id";
      $statement = $connection->prepare($sql);
      $statement->bindValue(':cc', $elem["spots"]["cc"]["id"]);
      $statement->bindValue(':driver', $elem["spots"]["driver"]["id"]);
      $statement->bindValue(':attendant', $elem["spots"]["attendant"]["id"]);
      $statement->bindValue(':observer', $elem["spots"]["observer"]["id"]);
      $statement->bindValue(':dutysup', $elem["spots"]["dutysup"]["id"]);
      $statement->bindValue(':id', $elem['id']);
      $result = $statement->execute();
    }
  }
  echo(json_encode(array('success' => true, 'message' => 'Updated')));
} else {
  echo 'Nice Try.';
}

?>
