<?php

require '.db_config.php';
require_once '.functions.php';

// Data array
$data = array();

// Verification logic
$verifiedTo = isset($_POST['to']) && $_POST['to'] != '';
$verifiedSubject = isset($_POST['subject']) && $_POST['subject'] != '';
$verifiedBody = isset($_POST['body']) && $_POST['body'] != '';

if (!($verifiedTo && $verifiedSubject && $verifiedBody && $_POST['sessionId'])) {
    $data['success'] = false;
    echo (json_encode($data));
    return;
}

$connection = openDatabaseConnection();

if (getUser($_POST['sessionId'], $connection)['admin'] == 0) {
    $data['success'] = false;
    echo (json_encode($data));
    $connection = null;
    return;
}

$connection = null;

$url = 'http://lp13.rpiambulance.com:3000/sendmail';

$ch = curl_init();

$fields = json_encode(array(
    'to' => $_POST['to'],
    'subject' => $_POST['subject'],
    'body' => $_POST['body'],
    'token' => $slacktoken
));

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

//execute the POST request
$result = curl_exec($ch);

//close cURL resource
curl_close($ch);

echo($result);

?>