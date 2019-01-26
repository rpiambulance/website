<?php
require_once '.functions.php';

if(isset($_POST["slack_id"]) && isset($_POST['member_id'])){
    $conn = openDatabaseConnection();
    if(is_null($conn)){
        echo "Database connection failed to initialize!";
        return;
    }
    $statement = $conn->prepare("SELECT * FROM members WHERE id = :memID");
    $statement->bindParam(":memID", $_POST['member_id']);
    $statement->execute();
    $user = $statement->fetch();
    // If the given member ID isn't in our database we return a message stating that
    if(!$user){
        echo "Invalid user id! Please enter another one";
        return;
    }
    $statement = $conn->prepare("UPDATE members SET slackID = :slack WHERE id = :memID");
    $statement->execute(['slack' => $_POST["slack_id"], 'memID' => $_POST['member_id']]);
    echo "Successfully linked " . $_POST['slack_id'] . " to " . $user['first_name'] . " " . $user['last_name'] . " (" . $_POST['member_id'] . ")";
}else{
    echo "Invalid request";
}
?>