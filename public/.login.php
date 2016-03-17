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

    $user       =   $input['username'];
    $pass      =   $input['password'];

    $connection = new PDO($dsn, $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Selecting Database
    //$db = mysql_select_db("$db_name", $connection);
    $connection->exec("USE `$db_name`");


    $pass = md5($pass);

    // SQL query to fetch information of registerd users and finds user match.
    //$query = mysql_query("SELECT * FROM login WHERE password='$password' AND username='$username'", $connection);
    //$rows = mysql_num_rows($query);
    $sql="SELECT * FROM members WHERE username='$user' AND password='$pass';";
    $stmt=$connection->prepare($sql);
    $stmt->bindParam(':password', $pass);
    $stmt->bindParam(':username', $user);
    $stmt->execute();
    $rows=$stmt->fetch();
    $rows=$rows[57];
    //GET ACTIVE MEMBER STATUS SINCE ONLY ACTIVE MEMBERS CAN SIGN IN
    //echo('Rows' .$rows);

    if ($rows == 1) {
        //echo("RIGHT!");
//        $_SESSION['login_user']=$username; // Initializing Session
        //header("location:#/night-crews"); // Redirecting To Other Page
    }
    else{
        echo("Wrong");
    }

    $connection= null;
    echo json_encode($data);


}
