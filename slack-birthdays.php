<?php

date_default_timezone_set('America/New_York');

function getBirthdays($connection, $date)
{
    $statement = $connection->query("SELECT slackId FROM members WHERE dob = '$date'");
    $statement->execute();
    return $statement->fetchAll(PDO::FETCH_ASSOC);
}

require_once ".db_config.php";

if (!isset($_GET["token"]) || $_GET["token"] != $slacktoken) {
    die("nope.");
}

try {

    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (!isset($dname)) {
        $dname = 'ambulanc_web';
    }

    $connection->exec("USE `$dname`");

    $date = isset($_GET["date"]) ? $_GET["date"] : date("Y-m-d");
    $birthdayPeople = getBirthdays($connection, $_GET["date"]);
    echo $birthdayPeople;

} catch (Exception $e) {
    echo $e;
}

?>
