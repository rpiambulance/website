<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";

$connection = new PDO("mysql:host=$dhost:3306;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
    $dname = 'ambulanc_web';
}

// Selecting Database
//$db = mysql_select_db("$dname", $connection);
$connection->exec("USE `$dname`");

$oneWeekOffset = 7 - date("N");
$twoWeekOffset = 14 - date("N");

if($oneWeekOffset == 0) { // Sunday
    $oneWeekOffset = 7;
    $twoWeekOffset = 14;
}

$oneweek = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d") + $oneWeekOffset, date("Y")));
$twoweek = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d") + $twoWeekOffset, date("Y")));

$statement = $connection->prepare("SELECT COUNT(id) FROM $dname.crews WHERE date = :oneweek");
$statement->bindParam(":oneweek", $oneweek);
$statement->execute();
$oneWeekCount = $statement->fetchAll(PDO::FETCH_COLUMN, 0)[0];

$statement = $connection->prepare("SELECT COUNT(id) FROM $dname.crews WHERE date = :twoweek");
$statement->bindParam(":twoweek", $twoweek);
$statement->execute();
$twoWeekCount = $statement->fetchAll(PDO::FETCH_COLUMN, 0)[0];

if($oneWeekCount < 1 || $twoWeekCount < 1) {
    $start = 7;
    $end = 7;
    if($oneWeekCount < 1) {
        $start = 0;
    }
    if($twoWeekCount < 1) {
        $end = 14;
    }

    for($i = $start; $i < $end; $i++) {
        $statement = $connection->prepare("SELECT id FROM crews ORDER BY id DESC LIMIT 1");
        $statement->execute();
        $logid = $statement->fetchColumn() + 1;

        $statement = $connection->prepare("SELECT * FROM default_crews WHERE day = :day");
        $statement->bindValue(":day", ($i % 7));
        $statement->execute();
        $defaultCrew = $statement->fetchAll(PDO::FETCH_ASSOC)[0];

        $newDate = date('Y-m-d', mktime(0, 0, 0, date('m'), date('d') + $i, date('Y')));

        $statement = $connection->prepare("INSERT INTO `crews` (`id`, `date`, `cc`, `driver`, `attendant`, `observer`) VALUES (:logid, :newDate, :cc, :driver, :attendant, :observer)");
        $statement->bindParam(":logid", $logid);
        $statement->bindParam(":newDate", $newDate);
        $statement->bindParam(":cc", $defaultCrew['cc']);
        $statement->bindParam(":driver", $defaultCrew['driver']);
        $statement->bindParam(":attendant", $defaultCrew['attendant']);
        $statement->bindParam(":observer", $defaultCrew['observer']);
        $statement->execute();
    }
}

try {
    $sql = <<<SQL
        SELECT
        	c.*,
            cc.first_name AS cc_first_name,
            cc.last_name AS cc_last_name,
            driver.first_name AS driver_first_name,
            driver.last_name AS driver_last_name,
            attendant.first_name AS attendant_first_name,
            attendant.last_name AS attendant_last_name,
            observer.first_name AS observer_first_name,
            observer.last_name AS observer_last_name
        FROM
        	crews c,
            members cc,
            members driver,
            members attendant,
            members observer
        WHERE
        	c.cc = cc.id AND
            c.driver = driver.id AND
            c.attendant = attendant.id AND
            c.observer = observer.id
        ORDER BY
        	id DESC
        LIMIT 14;
SQL;

    $statement=$connection->prepare($sql);
    $statement->execute();
    $results=$statement->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(array("result" => $results, "success" => true));
} catch (Exception $e) {
    echo json_encode(array("error" => $e, "success" => false));
}

// for ($x = 0; $x <= sizeof($results); $x++) {
//     echo "The number is: $x <br>";
// }

?>
