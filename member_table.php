<?php
//header("Access-Control-Allow-Origin: *");
//header("Content-Type: application/json; charset=UTF-8");


require_once ".db_config.php";
require_once ".functions.php";
require_once ".oidc_common.php";
$connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
$user = getUser($_GET['session_id'], $connection);
$username = $user['username'];
if(!isset($username)) {
  echo 0;
} else {
	
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  // Selecting Database
  //$db = mysql_select_db("$dname", $connection);
  $connection->exec("USE `$dname`");

  $hasOidcTable = false;
  try {
    $tableCheck = $connection->query(
      "SELECT COUNT(*) AS c
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'oidc_identities'"
    );
    $hasOidcTable = intval($tableCheck->fetch(PDO::FETCH_ASSOC)['c']) > 0;
  } catch (Exception $e) {
    $hasOidcTable = false;
  }

  if ($hasOidcTable) {
    $sql = "SELECT m.*, 
              CASE WHEN EXISTS (
                SELECT 1 FROM oidc_identities oi WHERE oi.userID = m.id
              ) THEN 1 ELSE 0 END AS has_oidc_link
            FROM members m
            WHERE m.dob != 0000-00-00";
  } else {
    $sql = "SELECT m.*, 0 AS has_oidc_link
            FROM members m
            WHERE m.dob != 0000-00-00";
  }

  if(isset($_GET['member_id'])) {
    $sql .= ' AND m.id = :id';
  } else if(!isset($_GET['include_inactive'])) {
    $sql .= " AND m.active = 1";
  }

  $statement=$connection->prepare($sql);

  if(isset($_GET['member_id'])) {
    $statement->bindParam(':id', $_GET['member_id']);
  }

  $statement->execute();
  $results=$statement->fetchAll(PDO::FETCH_ASSOC);

  // For single-member edit view, refresh identity-managed fields from OIDC provider.
  if (isset($_GET['member_id']) && count($results) === 1) {
    $issuer = rtrim(oidc_get_env('OIDC_ISSUER', ''), '/');
    if ($hasOidcTable && !empty($issuer) && intval($results[0]['has_oidc_link']) === 1) {
      $idStmt = $connection->prepare(
        "SELECT issuer, subject FROM oidc_identities WHERE userID = :userID AND issuer = :issuer LIMIT 1"
      );
      $idStmt->bindParam(':userID', $results[0]['id'], PDO::PARAM_INT);
      $idStmt->bindParam(':issuer', $issuer);
      $idStmt->execute();
      $identity = $idStmt->fetch(PDO::FETCH_ASSOC);

      if ($identity) {
        $providerUser = oidc_provider_get_user_by_subject($identity['issuer'], $identity['subject']);
        if (!empty($providerUser['ok']) && !empty($providerUser['found']) && !empty($providerUser['user'])) {
          $p = $providerUser['user'];
          if (!empty($p['firstName'])) {
            $results[0]['first_name'] = $p['firstName'];
          }
          if (!empty($p['lastName'])) {
            $results[0]['last_name'] = $p['lastName'];
          }
          if (!empty($p['username'])) {
            $results[0]['username'] = $p['username'];
          }
          if (!empty($p['email'])) {
            $results[0]['email'] = $p['email'];
          }
        }
      }
    }
  }

  $json=json_encode($results);
  echo($json);
}
?>
