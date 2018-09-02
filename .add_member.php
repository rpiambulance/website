<?php

require_once ".db_config.php";
require_once ".functions.php";

// empty response
$response = null;

//array to hold errors
$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

$first_name = $input['first_name'];
$last_name = $input['last_name'];
$password = $input['password'];
$password = password_hash(hash('sha256', $password), PASSWORD_DEFAULT);
$email = $input['email'];
$rcs = $input['RCS'];
$rin = $input['RIN'];
$home_phone = $input['phone'];
$cell_phone = $input['c_phone'];
$rpi_address = $input['rpi_add'];
$home_address = $input['home_add'];
$dob = $input['dob'];
$username = $input['user_name'];
if (checkkIfAdmin()){
  try {
    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if(!isset($dname)) {
      $dname = 'ambulanc_web';
    }

    // Selecting Database
    $connection->exec("USE `$dname`");

    $sthandler = $connection->prepare("SELECT username FROM members WHERE username = :name");
    $sthandler->bindParam(':name', $username);
    $sthandler->execute();

    if($sthandler->rowCount() > 0){
        throw new Exception("Username already exists! " . $sthandler->rowCount());
    }

    $statement = $connection->query("SELECT MAX(id) as max FROM members");

    $logid = $statement->fetchAll(PDO::FETCH_ASSOC)[0]['max'] + 1;

    $statement = $connection->prepare("INSERT IGNORE INTO members(id, username, password,
      first_name, last_name, dob, email, rcs_id, rin, rpi_address, home_address,
      cell_phone, home_phone) VALUES (:logid, :username, :password, :first_name,
      :last_name, :dob, :email, :rcs, :rin, :rpi_address, :home_address,
      :cell_phone, :home_phone)");

    $statement->bindParam(":logid", $logid);
    $statement->bindParam(":username", $username);
    $statement->bindParam(":password", $password);
    $statement->bindParam(":first_name", $first_name);
    $statement->bindParam(":last_name", $last_name);
    $statement->bindParam(":dob", $dob);
    $statement->bindParam(":email", $email);
    $statement->bindParam(":rcs", $rcs);
    $statement->bindParam(":rin", $rin);
    $statement->bindParam(":rpi_address", $rpi_address);
    $statement->bindParam(":home_address", $home_address);
    $statement->bindParam(":cell_phone", $cell_phone);
    $statement->bindParam(":home_phone", $home_phone);

    $result = $statement->execute();

    if($result) {
      $data['success'] = true;
    } else {
      $data['success'] = false;
    }
  } catch(PDOException $e) {
    $data['success'] = false;
    $data['error'] = $e;
  } catch(Exception $e){
    $data['success'] = false;
    $data['error'] = $e->getMessage();
  }
  echo(json_encode($data));
} else {
  echo "Nice try.";
}

?>
