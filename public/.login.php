<?php

require_once ".db_config.php";

$ip = $_SERVER['REMOTE_ADDR'];

$errors = array();
$data = array();

$support_email = 'webmaster@rpiambulance.com';

/**
 * Notifies the user that the login failed for the given reason why with the
 * given message
 * @param  string $why     the reason why it failed
 * @param  string $message the message explaining the circumstances
 */
function loginFailed ($why, $message) {
    $errors[$why] = $message;
    $data['success'] = false;
    $data['fail_type'] = $why;
    $data['errors'] = $errors;
}

/**
 * Counts the username's failed login attempts in the past hour and since the
 * last failed attempt override (if applicable).
 * @param  PDO     $c the database connection
 * @param  string  $u the user to check
 * @return int        num of times the user has failed to login the past hour
 */
function checkFailedAttempts ($c, $u) {
    $query = <<<SQL
        SELECT
            COUNT(*) AS num_failed_attempts
        FROM
            `login_attempts`
        WHERE
            username = :username AND
            was_successful = 0 AND
            fail_type = 'credentials' AND
            timestamp >= NOW() - INTERVAL 1 HOUR AND
            timestamp >= IFNULL((
                SELECT
                    timestamp
                FROM
                    `login_overrides`
                WHERE
                    username = 'justetz'
                ORDER BY
                    timestamp DESC
                LIMIT 1
            ), '0000-00-00');
    SQL;

    $statement = $c->prepare($query);
    $statement->bindParam(':username', $u);
    $statement->execute();

    return intval($statement->fetch(PDO::FETCH_ASSOC)['num_failed_attempts']);
}

/**
 * Add an entry to the login_attempts table
 * @param PDO      $c the database connection
 * @param string   $u the user to log
 */
function addLoginAttempt ($c, $u) {
    $was_successful = ($data['success'] ? 1 : 0);
    $fail_type = ($data['success'] ? null : $data['fail_type']);

    $query = <<<SQL
        INSERT INTO `login_attempts`
        (`username`, `was_successful`, `ip_address`, `fail_type`) VALUES
        (:username,  :was_successful,  :ip_address,  :fail_type);
    SQL;

    $statement = $c->prepare($query);
    $statement->bindParam(':username', $u);
    $statement->bindParam(':was_successful', $was_successful);
    $statement->bindParam(':ip_address', $ip);
    $statement->bindParam(':fail_type', $fail_type);
    $statement->execute();
}

/**
 * Checks if the provided username is a valid username.
 * @param  PDO       $c the database connection
 * @param  string    $u the user to check
 * @return boolean      the user
 */
function isUsernameValid ($c, $u) {
    $query = <<<SQL
        SELECT
            COUNT(*) AS user_found
        FROM
            members
        WHERE
            username = :username;
    SQL;

    $statement = $c->prepare($query);
    $statement->bindParam(':username', $user);
    $statement->execute();
    return (intval($statement->fetch(PDO::FETCH_ASSOC)['user_found']) == 1);
}

function queryLoginCredentials ($c, $u, $p) {
    $query = <<<SQL
        SELECT
            *
        FROM
            members
        WHERE
            username = :username AND
            password = :password;
    SQL;

    $statement = $connection->prepare($query);
    $statement->bindParam(':password', $pass);
    $statement->bindParam(':username', $user);
    $statement->execute();

    $userInfo = $statement->fetch(PDO::FETCH_ASSOC);
}


if (!isset($_POST['username'])) {
    // Check if the POST request body contains a username field. If not, error.
    $errors['username'] = 'Username is required.';
}

if (!isset($_POST['password'])) {
    // Check if the POST request body contains a password field. If not, error.
    $errors['password'] = 'Password is required.';
}

if (!empty($errors)) {
    // If either the username or the password were not entered, fail the login.
    loginFailed('incomplete', 'Please ensure you entered a username and a password.');
} else {
    // Otherwise, we have both values. Full speed ahead.

    // Get the values into temp variables, password hashed.
    $user = $_POST['username'];
    $pass = md5($_POST['password']);

    // Connect to the database and prep for error checking
    $connection = new PDO($dsn, $duser, $dpassword);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure we're using the right database. ($dname needed in .db_config.php)
    $connection->exec("USE `$dname`");

    // Find the user given the username and hashed password
    $userInfo = queryLoginCredentials($connection, $user, $pass);

    if (empty($userInfo)) {
        // If the user was not found by the query, then the user didn't enter in
        // either a correct username or password. Fail accordingly
        $message = 'Your username and/or password are not correct. Please '
                 . 'contact ' . $support_email . ' for assistance.';
        loginFailed('credentials', $message);
    } else if($userInfo['active'] != '1') {
        $message = 'Your account is not active. Please contact '
                 . $support_email . ' for assistance.';
        loginFailed('inactive', $message);
    } else if($userInfo['access_revoked'] == '1') {
        loginFailed('revoked', 'Access has been revoked for your account. Please contact ' . $support_email . ' if you believe this was done in error.');
    } else if(checkFailedAttempts($user) >= 3) {
        loginFailed('locked', 'Your account has been locked for one hour for too many failed login attempts. Please contact ' . $support_email . ' for assistance.');
    } else {
        $statement = $connection->prepare("UPDATE members SET lastlogin=CURDATE() WHERE id = :id");
        $statement->bindParam(':id', $userInfo['id']);
        $statement->execute();

        session_start();

        $_SESSION['first_name'] = $userInfo['first_name'];
        $_SESSION['last_name'] = $userInfo['last_name'];
        $_SESSION['username'] = $userInfo['username'];

        $data['success'] = true;
        $data['session_id'] = session_id();
    }

    addLoginAttempt($connection, $user, $data);

    // In the event the user failed to enter in the right credentials, we run
    // through a number of checks that, if the user failed enough times in
    // a time period, we disable their account access temporarily

    // Check to ensure that the username entered was valid
    // We found the user and checked to see if the user has failed to
    // enter the correct password at least three times in the past hour.
    // If so, revoke their access.
    if(!$data['success'] && $data['fail_type'] == 'credentials' && isUsernameValid($connection, $user) && checkFailedAttempts($connection, $user) >= 3) {
        $data['errors']['locked'] = 'Your account has been locked for one hour for too many failed login attempts. Please contact ' . $support_email . ' for assistance.';
    }
}

echo json_encode($data);
