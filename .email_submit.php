<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

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

// validate the variables ======================================================
if (!isset($input['orgName'])) {
    $errors['orgName'] = 'Organization Name is required.';
}
if (!isset($input['name'])) {
    $errors['name'] = 'Contact Name is required.';
}
if (!isset($input['email'])) {
    $errors['email'] = 'Email is required.';
}
if (!isset($input['phone'])) {
    $errors['phone'] = 'Phone number is required.';
}
if (!isset($input['eventName'])) {
    $errors['eventName'] = 'Event name is required.';
}
if (!isset($input['loc'])) {
    $errors['loc'] = 'Event location is required.';
}
if (!isset($input['date'])) {
    $errors['date'] = 'Event date is required.';
}
if (!isset($input['time'])) {
    $errors['time'] = 'Event time is required.';
}
if (!isset($input['type'])) {
    $errors['type'] = 'Event type is required.';
}
if (!isset($input['attendance'])) {
    $errors['attendance'] = 'Event attendance is required.';
}
if (!isset($input['duration'])) {
    $errors['duration'] = 'Event duration is required.';
}
if (!isset($input['tier'])) {
    $errors['tier'] = 'Tier is required.';
}


// return a response ===========================================================

if (!empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors'] = $errors;
    $data['messageError'] = 'Please check the fields in red';
} else {
    // if there are no errors, return a message
    $data['success'] = true;
    $data['messageSuccess'] = 'Thanks for reaching out! We will get back to you soon as possible!';

    // LOAD INPUT INTO TEMP VARIABLES ****
    $orgName    = $input['orgName'];
    $name       = $input['name'];
    $email_from = $input['email'];
    $phone      = $input['phone'];
    $eventName  = $input['eventName'];
    $loc        = $input['loc'];
    $date       = $input['date'];
    $time       = $input['time'];
    $type       = $input['type'];
    $attendance = $input['attendance'];
    $duration   = $input['duration'];
    $tier       = $input['tier'];
    // ***********************************

    // CONSTANTS *************************
    $email_subject = "RPI Ambulance Coverage Request: " . $orgName;
    // ***********************************

    // EMAIL TO THE O-BOARD ************************

    $email_message = "A coverage request was processed by the RPI Ambulance website. " .
        "Submission details can be found below:\n" .
        "Tier Requested: " . $tier . "\n" .
        "\nContact Information:\n".
        "\nOrganization Name: " . $orgName . "\n" .
        "\nContact Name: " . $name . "\n" .
        "Email: " . $email_from . "\n" .
        "Phone: " . $phone . "\n" .
        "\nEvent Information:\n".
        "\nEvent Name: " . $eventName . "\n" .
        "Location: " . $loc . "\n" .
        "Date: " . $date . "\n" .
        "Arrival Time: " . $time . "\n" .
        "Type: " . $type . "\n" .
        "Attendance: " . $attendance . "\n" .
        "Duration: " . $duration . " hour(s)\n";

    $headers = 'From: ' . $email_from . "\r\n" .
        'Reply-To: ' . $email_from . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $email_subject, $email_message, $headers);

    $mail = new PHPMailer(false);                              // Passing `true` enables exceptions
try {
    //Server settings
    $mail->SMTPDebug = 2;                                 // Enable verbose debug output
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'mail.rpi.edu';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = '***@rpi.edu';                 // SMTP username
    $mail->Password = '***';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('no-reply-robots@rpiambulance.com', 'RPI Ambulance Events');
    $mail->addAddress('secondlt@rpiambulance.com', "Second Leiutenant");     // Add a recipient
    $mail->addReplyTo($email_from, $name);
    $mail->addCC('officers@rpiambulance.com');

    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Here is the subject';
    $mail->Body    = $email_message;
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();

    $data['success'] = true;
    $data['messageSuccess'] = 'Thanks for reaching out! We will get back to you soon as possible!';

    echo json_encode($data);

} catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}

    // EMAIL TO THE REQUESTER ************************

    // CONSTANTS *************************
    $email_subject_requester = "Your RPI Ambulance Coverage Request for: " . $eventName;
    // ***********************************

    $email_message_requester= "Thanks for asking us to cover your event! Since this is an automated email message, one ".
    "of our officers should be reaching out to you regarding your request soon with some more information. For your ".
    "records, we've included a copy of the request below:\n\n".

        "Tier Requested: " . $tier . "\n" .
        "\nContact Information:\n".
        "\nOrganization Name: " . $orgName . "\n" .
        "Contact Name: " . $name . "\n" .
        "Email: " . $email_from . "\n" .
        "Phone: " . $phone . "\n" .
        "\nEvent Information:\n".
        "\nEvent Name: " . $eventName . "\n" .
        "Location: " . $loc . "\n" .
        "Date: " . $date . "\n" .
        "Arrival Time: " . $time . "\n" .
        "Type: " . $type . "\n" .
        "Attendance: " . $attendance . "\n" .
        "Duration: " . $duration . " hour(s)\n".

    "\nPlease verify that the above information is correct. If you do notice an error, just let us know once you receive ".
        "an email from a real-life human. If you have any further questions feel free to reach our to us on our website, ".
        "or at officers@rpiambulance.com.\n".

        "\nThanks again for the request and we'll be in touch with you soon!\n".

        "\n--The RPI Ambulance Team";

    $headers_requester= "From: no-reply-robots@rpiambulance.com \r\n".
        'X-Mailer: PHP/' . phpversion();

    @mail($email_from,$email_subject_requester,$email_message_requester,$headers_requester);

}

// return all our data to an AJAX call =========================================
echo json_encode($data);
