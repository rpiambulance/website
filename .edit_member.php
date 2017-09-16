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

$modifiableFields = array(
  "username", "password", "first_name", "last_name", "dob", "email",
  "rpi_address", "home_address", "cell_phone", "home_phone", "rcs_id", "rin",
  "radionum", "cpr_exp", "cpr_assoc", "emt_level",
  "emt_num", "emt_exp", "other_training", "dl_state", "dl_exp", "cevo_date",
  "epinipherine", "atropine", "glucometry", "nims100", "nims200", "nims700",
  "nims800", "admin", "rank", "pres", "vicepres", "captain", "firstlt",
  "secondlt", "schedco", "radioco", "traincommchair", "dutysup", "ees",
  "cctrainer", "drivertrainer", "firstresponsecc", "crewchief", "driver",
  "backupcc", "backupdriver", "attendant", "observer", "active",
  "access_revoked"
);

if($_SERVER['REQUEST_METHOD'] === 'POST') {
  if(checkIfAdmin()) {
    $data = json_decode($_POST['data'], true);

    // try {
      // foreach($data as $elem) {
        $sql = "UPDATE members SET";

        if($data['change_password'] != ''){
          if(isset($data['password'])) {
            $data['password'] = md5($data['password']);
          }
        }

        foreach($modifiableFields as $mf) {
          if(isset($data[$mf])) {
            $sql .= " $mf = :$mf,";
          }
        }

        // Eliminate last comma
        $sql = substr($sql, 0, -1);

        $sql .= " WHERE id = :memberId";

        $statement = $connection->prepare($sql);

        foreach($modifiableFields as $mf) {
          if(isset($data[$mf])) {
            $statement->bindValue(":$mf", $data[$mf]);
          }
        }
        $statement->bindValue(':memberId', $data['id']);
        $result = $statement->execute();
      // }
      echo(json_encode(array('success' => true)));
    // } catch (PDOException $e) {
    //   echo $e;
    //   echo(json_encode(array('success' => false, 'error' => $e)));
    // }
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
