<?php

date_default_timezone_set('America/New_York');

function cleanName($name) {
  if ($name[0]["last_name"] == "OUT OF SERVICE") {
    return "OOS";
  }
  if ($name[0]["first_name"] == "") {
    if ($name[0]["last_name"] != "") {
      return $name[0]["last_name"];
    }
    return "<EMPTY>";
  }
  return substr($name[0]["first_name"],0,1) . "." . " " . $name[0]["last_name"];
}

function getCrew($connection, $date) {
  $statement = $connection->query("SELECT first_name, last_name FROM members WHERE id = (SELECT cc FROM crews WHERE date = '$date')");
  $statement->execute();
  $cc = $statement->fetchAll(PDO::FETCH_ASSOC);

  $statement = $connection->query("SELECT first_name, last_name FROM members WHERE id = (SELECT driver FROM crews WHERE date = '$date')");
  $statement->execute();
  $driver = $statement->fetchAll(PDO::FETCH_ASSOC);

  $statement = $connection->query("SELECT first_name, last_name FROM members WHERE id = (SELECT attendant FROM crews WHERE date = '$date')");
  $statement->execute();
  $attendant1 = $statement->fetchAll(PDO::FETCH_ASSOC);

  $statement = $connection->query("SELECT first_name, last_name FROM members WHERE id = (SELECT observer FROM crews WHERE date = '$date')");
  $statement->execute();
  $attendant2 = $statement->fetchAll(PDO::FETCH_ASSOC);

  return (cleanName($cc) == "OOS") ? "OUT OF SERVICE" : "Crew chief: " . cleanName($cc) . "\n" .
  "Driver: " . cleanName($driver) . "\n" .
  "Attendants: " . cleanName($attendant1) . " and " . cleanName($attendant2);

}

require_once ".db_config.php";

if (!isset($_GET["token"]) || $_GET["token"] != $slacktoken) {
  die("nope.");
}

try {

  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  $connection->exec("USE `$dname`");

  if (!isset($_GET["date"])) {
    
    $today = date("Y-m-d");
    $yesterday = date("Y-m-d", time() - 60 * 60 * 24);

    $today_crew = getCrew($connection, $today);
    $yesterday_crew = getCrew($connection, $yesterday);

    $now = new Datetime("now");
    $shiftstart = new DateTime('18:00');
    $shiftend = new DateTime('06:00');
    $crewchange = new DateTime('09:00');

    if ($now >= $shiftstart) { //handles 1800-0000 hours
      echo "Current crew:" . "\n";
      echo $today_crew;
    } else if ($now <= $shiftend){ //handles 0000-0600 hours
      echo "Current crew:" . "\n";
      echo $yesterday_crew;
    } else if ($now > $shiftend && $now <= $crewchange) { //handles 0600-0900 hours
      echo "Last night's crew:" . "\n";
      echo $yesterday_crew . "\n\n";
      echo "Tonight's crew:" . "\n";
      echo $today_crew;
    } else { //handles 0900-1800 hours
      echo "Tonight's crew:" . "\n";
      echo $today_crew;
    }
  } else {
    $tomorrow = (isset($_GET["tomorrow"]) && ($_GET["tomorrow"]) == 1) ? true : false;
    $yesterday = (isset($_GET["yesterday"]) && ($_GET["yesterday"]) == 1) ? true : false;

    $today = date('l');
    $date = date_create_from_format('Y-m-d', $_GET["date"]);


    $next = ($today == $date->format('l')) ? true : false;

    $crew = getCrew($connection, $_GET["date"]);


    if ($next) {
      echo "Next " . $date->format('l') . "'s crew:" . "\n";
    } else if ($tomorrow) {
      echo "Tomorrow's crew:" . "\n";
    } else if ($yesterday) {
      echo "Yesterday's crew:" . "\n";
    } else {
      echo $date->format('l') . "'s crew:" . "\n";
    }
    echo $crew;
  }

} catch (Exception $e) {
  echo $e;
}

?>
