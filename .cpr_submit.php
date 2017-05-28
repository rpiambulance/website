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

if ($response == null) {
    $errors['reCaptcha'] = 'You did not validate your submission with our reCaptcha.';
} else if($response != null && !$response->success) {
    $errors['reCaptcha'] = 'Your reCaptcha verification did not succeed. Please try again.';
}

if (!isset($input['name'])) {
    $errors['name'] = 'Name is required.';
}

if (!isset($input['email'])) {
    $errors['email'] = 'Email is required.';
}

if (!isset($input['availability'])) {
    $errors['days'] = 'Please select which days work for you.';
}

if (!isset($input['interests'])) {
    $errors['type'] = 'Please select which type of training you would like.';
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
    $days    =   $input['availability'];
    $type    =   $input['interests'];

    // EMAIL TO THE O-BOARD ************************

    $subject= "CPR Training Request";

    $email_message = "A CPR training request was processed by the website. Details can be found below:\n" .
        "\nName: " . $name .
        "\nEmail: " . $email .
        "\nDays Available: " . $days .
        "\nTraining Type: " . $type;

    $headers = 'From: ' . $email . "\r\n" .
        'Reply-To: ' . $email . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    @mail($cpr_sub, $subject, $email_message, $headers);
    @mail($email_to, $subject, $email_message, $headers);

    // Email the sender a confirmation:
    $headers_requester= "From: no-reply-robots@rpiambulance.com \r\n".
        'X-Mailer: PHP/' . phpversion();
    $subject = "CPR Training Request";
    $message = "Dear " . $name . ",\n\nThank you so much for reaching out to RPI Ambulance. We will respond to your " .
        "request for CPR training as soon as we can. For your records, details of your request have been included below. " .
        "\n\nSincerely,\n\nThe RPI Ambulance Team" .

        "\n\nDays Available: " . $days .
        "\nTraining Type: " . $type;

    @mail($email, $subject, $message, $headers_requester);
}

// return all our data to an AJAX call =========================================
echo json_encode($data);