<?php

// grab secret key and to-address
require_once ".db_config.php";

// empty response
$response = null;

$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

// if submitted check response

if ($response == null) {
}

if (!isset($input['username'])) {
    $errors['username'] = 'Username is required.';
}

if (!isset($input['password'])) {
    $errors['pass'] = 'Password is required.';
}

if (!empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors'] = $errors;
    $data['messageError'] = 'Please check the fields in red';
} else {
    // if there are no errors, return a message
    $data['success'] = true;
    $data['messageSuccess'] = 'Logging In!';

    //**************************
    //******SET TEMP VARS*******
    //**************************

    $username  =   $input['username'];
    $pass      =   $input['password'];

    $connection = new PDO("mysql:host=$dhost;dbname=$dname", $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Selecting Database
    //$db = mysql_select_db("$dname", $connection);
    $connection->exec("USE `$dname`");


    $pass = md5($pass);

    // SQL query to fetch information of registerd users and finds user match.
    //$query = mysql_query("SELECT * FROM login WHERE password='$password' AND username='$username'", $connection);
    //$rows = mysql_num_rows($query);
    $sql="SELECT * FROM members WHERE username=:username AND password=:password";
    $stmt=$connection->prepare($sql);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':username', $username);
    $didSucceed = $stmt->execute();
    $rows=$stmt->fetch();
    $num= $rows->rowCount();
    //GET ACTIVE MEMBER STATUS SINCE ONLY ACTIVE MEMBERS CAN SIGN IN
    //echo('Rows' .$rows);

    if ($didSucceed && $num == 1) {
        // Initializing Session
        session_start();
        // $_SESSION['name'] =
        $_SESSION['username'] = $username;

        $data['session_id'] = session_id();
        //header("location:#/night-crews"); // Redirecting To Other Page
    }
    else{
        echo("Wrong");
    }

    $connection= null;
    echo json_encode($data);


}
