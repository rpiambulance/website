<?php
require_once '.functions.php';
$conn = openDatabaseConnection();
if(is_null($conn)){
    echo "Database connection failed to initialize!";
    return;
}
if (isset($_GET['slack_id'])){
    $statement = $conn->prepare("SELECT id, first_name, last_name FROM members WHERE slackID = :slack");
    $statement->bindParam(":slack", $_GET['slack_id']);
    $statement->execute();
    $accounts = $statement->fetchAll();
    if(!$accounts){
        echo "No website accounts are associated with this ID!";
        return;
    }else{
        $message = $_GET['slack_id'] . " is linked with";
        foreach($accounts as $account){
            $message .= ", " . $account['first_name'] . " " . $account['last_name'] . " (" . $account['id'] . ")";
        }
        echo $message;
        return;
    }
}
if(isset($_POST["slack_id"]) && isset($_POST['member_id'])){
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