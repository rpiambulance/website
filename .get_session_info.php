<?php
if (isset($_GET['session_id'])){
  if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 432000)) {
    // last request was more than 5 days ago
    session_unset();     // unset $_SESSION variable for the run-time
    session_destroy();   // destroy session data in storage
}
$_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp
  session_id($_GET['session_id']);
  session_start();
}else{
  session_start();
}
$key = $_GET['key'];
echo json_encode(array($key => $_SESSION[$key]));

?>
