<?php

// grab recaptcha library
require_once ".recaptchalib.php";

// grab secret key and to-address
require_once ".form_config.php";

// empty response
$response = null;

// check secret key
$reCaptcha = new ReCaptcha($secret);

$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

// if submitted check response
if (isset($input['g-recaptcha-response'])) {
    $response = $reCaptcha->verifyResponse(
        $_SERVER["REMOTE_ADDR"],
        $input["g-recaptcha-response"]
    );
}

if (!empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors'] = $errors;
    $data['messageError'] = 'Please check the fields in red';
} else {
    // if there are no errors, return a message
    $data['success'] = true;
    $data['messageSuccess'] = 'Thanks for reaching out! We will get back to you soon as possible!';

    //**************************
    //******SET TEMP VARS*******
    //**************************

    $name       =   $input['name'];
    $facility   =   $input['facility'];
    $items      =   $input['items'];

    //**************************
    //********CONSTANTS*********
    //**************************

    // EMAIL TO THE O-BOARD ************************

    $email_message =
        "\nA stocking issue has been reported through the website. Details are included below:\n" .
        "\n".
        "\nFacility: ". $facility.
        "\nItems: " . $items.
        "\nReported by: " . $name;

        $subject= $facility . " stocking issue reported!";
        $email= 'webmaster@rpiambulance.com';
        $headers_requester= "From: no-reply-robots@rpiambulance.com";

        @mail($email, $subject, $message, $headers_requester);
}


// return all our data to an AJAX call =========================================
echo json_encode($data);
