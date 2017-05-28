<?php

if(!isset($_GET['session_id'])) {
    http_response_code(400);
} else {
    session_start($_GET['session_id']);

    if(session_destroy()) {
        echo 'true';
    } else {
        http_response_code(500);
    }
}

?>
