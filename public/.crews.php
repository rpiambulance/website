<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";

$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!isset($dname)) {
    $dname = 'ambulanc_web';
}

// Selecting Database
//$db = mysql_select_db("$dname", $connection);
$connection->exec("USE `$dname`");



if(date("D") == "Sun") {
    $oneweek = date("Y-m-d", mktime(0, 0, 0, date("m"), date("d")+7, date("Y")));

    $statement = $connection->prepare("SELECT COUNT(id) FROM $dname.crews WHERE date = :oneweek");
    $statement->bindParam(":oneweek", $oneweek);
    $statement->execute();
    $count = $statement->fetchAll(PDO::FETCH_COLUMN, 0)[0];

    if($count < 1) {
        for($i = 7; $i < 14; $i++) {
            $statement = $connection->prepare("SELECT id FROM crews ORDER BY id DESC LIMIT 1");
            $statement->bindParam(":oneweek", $oneweek);
            $statement->execute();
            $logid = $statement->fetchColumn();

        //
        //     $default = mysql_fetch_array(mysql_query("SELECT * FROM default_crews WHERE day = $i-7"));
        //     $date = date('Y-m-d', mktime(0, 0, 0, date('m')  , date('d')+$i, date('Y')));
        //     $cc = $default['cc'];
        //     $driver = $default['driver'];
        //     $attendant = $default['attendant'];
        //     $observer = $default['observer'];
        //     mysql_query("INSERT INTO crews (id, date, cc, driver, attendant, observer) VALUES ($logid, '$date', $cc, $driver, $attendant, $observer)") or die(mysql_error());
        }
    }
}

try {
    $statement=$connection->prepare("SELECT * FROM $dname.crews ORDER BY id DESC LIMIT 14");
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
