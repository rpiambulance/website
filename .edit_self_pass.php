<?php
if($_SERVER['REQUEST_METHOD'] === 'POST') {

  require_once ".db_config.php";

  $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  if(!isset($dname)) {
    $dname = 'ambulanc_web';
  }

  $formData = file_get_contents('php://input');
  $input = json_decode($formData, true);

  $first_name = $input['fn'];
  $last_name = $input['ln'];
  $email = $input['email'];
  $cell_phone = $input['phone'];
  $home_phone = $input['hphone'];
  $home_address= $input['hadd'];
  $rpi_address = $input['add'];
  $pass = password_hash(hash('sha256', $input['pass']), PASSWORD_DEFAULT);
  $sessionID = $input['session_id'];
  session_start($sessionID);

try {
  $username = $_SESSION['username'];

  $statement = $connection->prepare("SELECT * FROM members WHERE username=:username");
  $statement->bindParam(':username', $username);
  $statement->execute();
  $memberInfo = $statement->fetchAll(PDO::FETCH_ASSOC)[0];
  $memberId = $memberInfo['id'];

  $statement = $connection->prepare("UPDATE members SET first_name=:first_name, last_name=:last_name, email=:email, cell_phone=:cell_phone, home_phone=:home_phone, rpi_address=:rpi_address, home_address=:home_address, password=:pass WHERE username = :username");
  $statement->bindParam(':first_name', $first_name);
  $statement->bindParam(':last_name', $last_name);
  $statement->bindParam(':email', $email);
  $statement->bindParam(':cell_phone', $cell_phone);
  $statement->bindParam(':home_phone', $home_phone);
  $statement->bindParam(':rpi_address', $rpi_address);
  $statement->bindParam(':home_address', $home_address);
  $statement->bindParam(':username', $username);
  $statement->bindParam(':pass', $pass);


  $result = $statement->execute();

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

}


?>
