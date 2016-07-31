<?php

define('URL_WITH_DASHES_ONLY', TRUE);

require_once '.db_config.php';

$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(isset($_GET['vehicle'])) {
  $vehicle = $_GET['vehicle'];
} else {
  $vehicle = 'both';
}

if(isset($_GET['page']) && is_numeric($_GET['page'])) {
  $page = intval($_GET['page']) - 1;
} else {
  $page = 0;
}

$offset = $page * 20;

$query = <<<EOT
  SELECT
    f.*,
    m.username,
    m.first_name,
    m.last_name
  FROM
    fuel_log f
  LEFT JOIN
    members m
  ON
    f.user = m.id
  WHERE
    f.date > '0000-00-00'
EOT;

if($vehicle == '5939' || $vehicle == 'FR-59') {
  $query .= ' AND f.vehicle = :vehicle';
}

$query .= ' ORDER BY f.date DESC, f.time DESC';

if($offset == 0) {
  $query .= ' LIMIT 20;';
} else {
  $query .= ' LIMIT ' . ($offset + 1) . ', 20;';
}

$statement= $connection->prepare($query);

if($vehicle == '5939' || $vehicle == 'FR-59') {
  $statement->bindValue(':vehicle', $vehicle);
}

$statement->execute();
$results=$statement->fetchAll(PDO::FETCH_ASSOC);

$query = "SELECT COUNT(*) FROM fuel_log";

if($vehicle == '5939' || $vehicle == 'FR-59') {
  $query .= ' WHERE vehicle = :vehicle';
}

$statement = $connection->prepare($query);

if($vehicle == '5939' || $vehicle == 'FR-59') {
  $statement->bindValue(':vehicle', $vehicle);
}

$statement->execute();
$count=$statement->fetch(PDO::FETCH_NUM)[0];

echo json_encode(array(
  "total"      => intval($count),
  "totalPages" => ceil(intval($count)/20),
  "results"    => $results
));
