<?php
// array to hold validation errors
$errors = array();

// array to pass back data
$data = array();

// Get the input ===============================================================
$formData = file_get_contents('php://input');
$input = json_decode($formData, true);

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
    // ***********************************

    // CONSTANTS *************************
    $email_to = "test@etz.io";
    $email_subject = "RPI Ambulance Coverage Request: " . $orgName;
    // ***********************************

    $email_message = "A coverage request was processed by the RPI Ambulance website. " .
        "Submission details can be found below:\n" .
        "Organization Name: " . $orgName . "\n" .
        "Contact Name: " . $name . "\n" .
        "Email: " . $email_from . "\n" .
        "Phone: " . $phone . "\n" .
        "Event Name: " . $eventName . "\n" .
        "Location: " . $loc . "\n" .
        "Date: " . $date . "\n" .
        "Time: " . $time . "\n" .
        "Type: " . $type . "\n" .
        "Attendance: " . $attendance . "\n" .
        "Duration: " . $duration . "\n";

    $headers = 'From: ' . $email_from . "\r\n" .
        'Reply-To: ' . $email_from . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $email_subject, $email_message, $headers);

    // SELF EMAIL ************************
    // TODO: construct an email to send to the person submitting
}

// return all our data to an AJAX call =========================================
echo json_encode($data);