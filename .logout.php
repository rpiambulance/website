<?php

if(!isset($_GET['session_id'])) {
    http_response_code(400);
} else {
    session_id($_GET['session_id']);
    session_start();

    if(session_destroy()) {
        unset($_SESSION['username']);
        unset($_SESSION['first_name']);
        unset($_SESSION['last_name']);
        echo 'true';
    } else {
        http_response_code(500);
    }
}

?>
