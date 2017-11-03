<?php

require_once ".db_config.php";
require_once ".functions.php";

$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
  $dname = 'ambulanc_web';
}
if (checkIfAdmin()){
  // Selecting Database
  $connection->exec("USE `$dname`");

  $CPR_QUERY = "SELECT id, username, first_name, last_name, cpr_exp AS exp, cpr_assoc, 'CPR' as type FROM members WHERE active = 1 AND";
  $EMT_QUERY = "SELECT id, username, first_name, last_name, emt_exp AS exp, emt_num, emt_level, 'EMT' as type FROM members WHERE active = 1 AND";
  $DL_QUERY  = "SELECT id, username, first_name, last_name, dl_exp AS exp, dl_state, 'DL' as type FROM members WHERE active = 1 AND";

  if(isset($_GET['type']) && $_GET['type'] == 'expiring') {
    $CPR_QUERY .= " cpr_exp < DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AND cpr_exp >= CURDATE() AND cpr_exp != '0000-00-00'";
    $EMT_QUERY .= " emt_exp < DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AND emt_exp >= CURDATE() AND emt_exp != '0000-00-00'";
    $DL_QUERY  .= " dl_exp  < DATE_ADD(CURDATE(), INTERVAL 1 MONTH) AND dl_exp  >= CURDATE() AND dl_exp != '0000-00-00'";
  } else {
    $CPR_QUERY .= " cpr_exp < CURDATE() AND cpr_exp != '0000-00-00'";
    $EMT_QUERY .= " emt_exp < CURDATE() AND emt_exp != '0000-00-00'";
    $DL_QUERY  .= " dl_exp  < CURDATE() AND dl_exp != '0000-00-00'";
  }

  $statement=$connection->prepare($CPR_QUERY);
  $statement->execute();
  $cprResults=$statement->fetchAll(PDO::FETCH_ASSOC);

  $statement=$connection->prepare($EMT_QUERY);
  $statement->execute();
  $emtResults=$statement->fetchAll(PDO::FETCH_ASSOC);

  $statement=$connection->prepare($DL_QUERY);
  $statement->execute();
  $dlResults=$statement->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode(array(
    "cpr" => $cprResults,
    "emt" => $emtResults,
    "dl"  => $dlResults
  ));
} else {
  echo "Nice Try";
}

?>
