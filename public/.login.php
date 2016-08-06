<?php

// grab secret key and to-address
require_once ".db_config.php";

// empty response
$response = null;

$errors = array();
$data = array();

$support_email = 'webmaster@rpiambulance.com';

// if submitted check response

if ($response == null) {
}

if (!isset($_POST['username'])) {
    $errors['username'] = 'Username is required.';
}

if (!isset($_POST['password'])) {
    $errors['pass'] = 'Password is required.';
}

if (!empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors'] = $errors;
} else {

    $user = $_POST['username'];
    $pass = $_POST['password'];

    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Selecting Database
    //$db = mysql_select_db("$dname", $connection);
    $connection->exec("USE `$dname`");


    $pass = md5($pass);

    $statement=$connection->prepare("SELECT * FROM members WHERE username=:username AND password=:password");
    $statement->bindParam(':password', $pass);
    $statement->bindParam(':username', $user);
    $statement->execute();
    $rows=$statement->fetch(PDO::FETCH_ASSOC);



    //GET ACTIVE MEMBER STATUS SINCE ONLY ACTIVE MEMBERS CAN SIGN IN
    //echo('Rows' .$rows);

    if (!empty($user)) {
        if($user['active'] != '1') {
            $errors['inactive'] = 'Your account is not active. Please contact ' . $support_email . ' for assistance.';
            $data['success'] = false;
            $data['errors'] = $errors;
        } else if($user['access_revoked'] == '1') {
            $errors['inactive'] = 'Access has been revoked for your account. Please contact ' . $support_email . ' if you believe this was done in error.';
            $data['success'] = false;
            $data['errors'] = $errors;
        } else {
            $statement = $connection->prepare("UPDATE members SET lastlogin=CURDATE() WHERE id = :id");
            $statement->prepare(':id', $user['id']);
            $statement->execute();

            session_start();
            // $_SESSION['name'] =
            $_SESSION['username'] = $username;

            $data['session_id'] = session_id();
        }





        echo json_encode($rows);
    } else {
        $errors['inactive'] = 'Your username and/or password are not correct. Please contact ' . $support_email . ' for assistance.';
        $data['success'] = false;
        $data['errors'] = $errors;
    }

    $connection= null;
    echo json_encode($data);
}
