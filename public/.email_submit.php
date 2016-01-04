<?php
$errors = array(); // array to hold validation errors
$data = array(); // array to pass back data

// Parse the JSON
$formData = file_get_contents('php://input');
$input = json_decode($formData);

// validate the variables ======================================================
if (!isset($input['name'])) {
    $errors['name'] = 'Name is required.';
}
if (!isset($input['email'])) {
    $errors['email'] = 'Email is required.';
}
// return a response ===========================================================
// response if there are errors
if (!empty($errors)) {
    // if there are items in our errors array, return those errors
    $data['success'] = false;
    $data['errors'] = $errors;
    $data['messageError'] = 'Please check the fields in red';
} else {
    // if there are no errors, return a message
    $data['success'] = true;
    $data['messageSuccess'] = 'Hey! Thanks for reaching out. I will get back to you soon';
    // CHANGE THE TWO LINES BELOW
    $email_to = "test@etz.io";
    $email_subject = "message submission";
    $name = $input['name']; // required
    $email_from = $input['email']; // required
    $email_message = "Form details below.nn";
    $email_message .= "Name: " . $name . "n";
    $email_message .= "Email: " . $email_from . "n";
    $headers = 'From: ' . $email_from . "rn" .
        'Reply-To: ' . $email_from . "rn" .
        'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $email_subject, $email_message, $headers);
}
// return all our data to an AJAX call
echo json_encode($data);