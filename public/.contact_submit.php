<?php

$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

if (!isset($input['name'])) {
    $errors['name'] = 'Name is required.';
}

if (!isset($input['email'])) {
    $errors['email'] = 'Email is required.';
}

if (!isset($input['subject'])) {
    $errors['subject'] = 'Subject is required.';
}

if (!isset($input['message'])) {
    $errors['message'] = 'Message is required.';
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
    $email      =   $input['email'];
    $subject    =   $input['subject'];
    $message    =   $input['message'];

    //THESE AREN'T REQUIRED, SO GIVE A MESSAGE TO AVOID ERRORS AND CONFUSION

    if (isset($input['company'])){
        $company= $input['company'];
    }else{
        $company= "None";
    }

    if (isset($input['phone'])){
        $phone= $input['phone'];
    }else{
        $phone= "Not Provided";
    }

    //**************************
    //********CONSTANTS*********
    //**************************

    $email_to="webmaster@rpiambulance.com";

    // EMAIL TO THE O-BOARD ************************

    $email_message = $message .
        "\n" .
        "\nPhone: ". $phone .
        "\nCompany Name: " . $company;

    $headers = 'From: ' . $email . "\r\n" .
        'Reply-To: ' . $email . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $subject, $email_message, $headers);

    // Email the sender a confirmation:
    $headers = 'From: ' . $email_to . "\r\n" .
        'Reply-To: ' . $email_to . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    $subject = "Thank you for contacting RPI Ambulance!";
    $message = "Dear " . $name . ",\n\nThank you so much for reaching out to RPI Ambulance. We will respond to your " .
        "email as soon as we can.\n\nSincerely,\nThe RPI Ambulance Officer Board";
    @mail($email, $subject, $message, $headers);
}

// return all our data to an AJAX call =========================================
echo json_encode($data);