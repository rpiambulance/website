<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");

require_once ".db_config.php";

$connection = new PDO($dsn, $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Selecting Database
//$db = mysql_select_db("$db_name", $connection);
$connection->exec("USE `$db_name`");

$query = <<<EOT
  SELECT
    cc.id,
    cc.date,
    cc.member_id  AS  cc_member_id,
    cc.username   AS  cc_username,
    cc.first_name AS  cc_first_name,
    cc.last_name  AS  cc_last_name,
    d.member_id   AS  driver_member_id,
    d.username    AS  driver_username,
    d.first_name  AS  driver_first_name,
    d.last_name   AS  driver_last_name,
    a.member_id   AS  attendant_member_id,
    a.username    AS  attendant_username,
    a.first_name  AS  attendant_first_name,
    a.last_name   AS  attendant_last_name,
    o.member_id   AS  observer_member_id,
    o.username    AS  observer_username,
    o.first_name  AS  observer_first_name,
    o.last_name   AS  observer_last_name
  FROM
    (SELECT
      c.id,
          c.date,
          m.id as member_id,
          m.username,
      m.first_name,
      m.last_name
    FROM
      ambulanc.crews c
    LEFT JOIN
      ambulanc.members m
    ON
      m.id = c.cc) cc,
    (SELECT
      c.id,
          m.id as member_id,
          m.username,
      m.first_name,
      m.last_name
    FROM
      ambulanc.crews c
    LEFT JOIN
      ambulanc.members m
    ON
      m.id = c.driver) d,
    (SELECT
      c.id,
          m.id as member_id,
          m.username,
      m.first_name,
      m.last_name
    FROM
      ambulanc.crews c
    LEFT JOIN
      ambulanc.members m
    ON
      m.id = c.attendant) a,
    (SELECT
      c.id,
          m.id as member_id,
          m.username,
      m.first_name,
      m.last_name
    FROM
      ambulanc.crews c
    LEFT JOIN
      ambulanc.members m
    ON
      m.id = c.observer) o
  WHERE
    cc.id = d.id AND
    cc.id = a.id AND
    cc.id = o.id
  ORDER BY
    cc.id DESC
  LIMIT 14;
EOT;

$statement=$connection->prepare($query);
$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);

// for ($x = 0; $x <= sizeof($results); $x++) {
//     echo "The number is: $x <br>";
// }

echo json_encode(array("result" => $results, "success" => true));
?>
