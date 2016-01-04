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
    $email_to = "officers@rpiambulance.com";
    $email_subject = "RPI Ambulance Coverage Request: " . $orgName;
    // ***********************************

    // EMAIL TO THE O-BOARD ************************

    $email_message = "A coverage request was processed by the RPI Ambulance website. " .
        "Submission details can be found below:\n" .
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
        "Duration: " . $duration . "hour(s)\n";

    $headers = 'From: ' . $email_from . "\r\n" .
        'Reply-To: ' . $email_from . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $email_subject, $email_message, $headers);

    // EMAIL TO THE REQUESTER ************************

    // CONSTANTS *************************
    $email_subject_requester = "Your RPI Ambulance Coverage Request for: " . $eventName;
    // ***********************************

    $email_message_requester= "Thanks for asking us to cover your event! Since this is an automated email message, one ".
    "of our officers should be reaching out to you regarding your request soon with some more information. For your ".
    "records, we've included a copy of the request below:\n".

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
        "Duration: " . $duration . "hour(s)\n".

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