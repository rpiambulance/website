<?php

session_start($_GET['session_id']);
$key = $_GET['key'];
echo json_encode(array($key => $_SESSION[$key]));

?>
