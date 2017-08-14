<?php

require_once ".db_config.php";

// empty response
$response = null;

//array to hold errors
$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

$event_name = $input['event_name'];
$event_location = $input['event_location'];
$start_time = $input['startstamp'];
$end_time = $input['endstamp'];
$date = $input['datestamp'];
$type = $input['type'];
$ees = 0;
$mode = $input['mode'];

if($mode == 'edit') {
  $id = $input['id'];
}

if ($type == '3') {
  $ees = 0;
}
else{
  $ees = 1;
}

try {
  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  // Selecting Database
  $connection->exec("USE `$dname`");

  if($mode == 'add') {
    $statement = $connection->query("SELECT MAX(id) as max FROM games");

    $logid = $statement->fetchAll(PDO::FETCH_ASSOC)[0]['max'] + 1;

    $statement = $connection->prepare("INSERT INTO games(id, `date`, start, `end`, description, location, ees, hide) VALUES (:logid, :date, :start_time, :end_time, :event_name, :event_location, :ees, 0)");

    $statement->bindParam(":logid", $logid);
    $statement->bindParam(":date", $date);
    $statement->bindParam(":start_time", $start_time);
    $statement->bindParam(":end_time", $end_time);
    $statement->bindParam(":event_name", $event_name);
    $statement->bindParam(":event_location", $event_location);
    $statement->bindParam(":ees", $ees);

    $result = $statement->execute();
  } else {
    $statement = $connection->prepare("UPDATE games SET
      `date`=:date,
      `start`=:start_time,
      `end`=:end_time,
      `description`=:event_name,
      `location`=:event_location,
      `hide`=0
    WHERE id=:id");

    $statement->bindParam(":id", $id);
    $statement->bindParam(":date", $date);
    $statement->bindParam(":start_time", $start_time);
    $statement->bindParam(":end_time", $end_time);
    $statement->bindParam(":event_name", $event_name);
    $statement->bindParam(":event_location", $event_location);

    $result = $statement->execute();
  }

  if($result) {
    $data['success'] = true;
  } else {
    $data['success'] = false;
  }
} catch(PDOException $e) {
  $data['success'] = false;
  $data['error'] = $e;
}

echo(json_encode($data));

?>
