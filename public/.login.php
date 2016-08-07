<?php

require_once ".db_config.php";

/**
 * Notifies the user that the login failed for the given reason why with the
 * given message
 * @param  string $why     the reason why it failed
 * @param  string $message the message explaining the circumstances
 */
function loginFailed ($why, $message, $e, &$d) {
    $e[$why] = $message;
    $d['success'] = false;
    $d['fail_type'] = $why;
    $d['errors'] = $e;
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
                    username = :username
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
 * @param PDO      $c  the database connection
 * @param string   $u  the user to log
 * @param array    $d  the data to check for success
 * @param array    $ip the client's IP address
 */
function addLoginAttempt ($c, $u, $d, $ip) {
    if($d['success']) {
        $was_successful = 1;
        $fail_type = null;
    } else {
        $was_successful = 0;
        $fail_type = $d['fail_type'];
    }

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

    $statement = $c->prepare($query);
    $statement->bindParam(':username', $u);
    $statement->bindParam(':password', $p);
    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
}

function updateLastLogin ($c, $uInfo) {
    $query = <<<SQL
        UPDATE
            members
        SET
            lastlogin=CURDATE()
        WHERE
            id = :id;
SQL;

    $statement = $c->prepare($query);
    $statement->bindParam(':id', $uInfo['id']);
    $statement->execute();
}

function setSessionVariables ($uInfo) {
    $_SESSION['first_name'] = $uInfo['first_name'];
    $_SESSION['last_name']  = $uInfo['last_name'];
    $_SESSION['username']   = $uInfo['username'];
}

function shouldLockUserSignIn($c, $u, $d) {
    return !$d['success'] && $d['fail_type'] == 'credentials'
           && isUsernameValid($c, $u) && checkFailedAttempts($c, $u) >= 3;
}

$ip = $_SERVER['REMOTE_ADDR'];

$errors = array();
$data = array();

$support_email = 'webmaster@rpiambulance.com';

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
    $message = 'Please ensure you entered a username and a password.';
    loginFailed('incomplete', $message, $errors, $data);
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
        // If the user was not found by the query, then the user didn't enter
        // in either a correct username or password. Fail accordingly
        $message = 'Your username and/or password are not correct. Please '
                 . 'contact ' . $support_email . ' for assistance.';
        loginFailed('credentials', $message, $errors, $data);
    } else if($userInfo['active'] != '1') {
        $message = 'Your account is not active. Please contact '
                 . $support_email . ' for assistance.';
        loginFailed('inactive', $message, $errors, $data);
    } else if($userInfo['access_revoked'] == '1') {
        $message = 'Access has been revoked for your account. Please contact '
                 . $support_email . ' if you believe this was done in error.';
        loginFailed('revoked', $message, $errors, $data);
    } else if(checkFailedAttempts($connection, $user) >= 3) {
        $message = 'Your account has been locked for one hour for too many '
                 . 'failed login attempts. Please contact ' . $support_email
                 . ' for assistance.';
        loginFailed('locked', $message, $errors, $data);
    } else {
        updateLastLogin($connection, $userInfo);

        session_start();

        setSessionVariables($userInfo);

        $data['success'] = true;
        $data['session_id'] = session_id();
    }

    addLoginAttempt($connection, $user, $data, $ip);

    // In the event the user failed to enter in the right credentials, we run
    // through a number of checks that, if the user failed enough times in
    // a time period, we disable their account access temporarily

    // Check to ensure that the username entered was valid
    // We found the user and checked to see if the user has failed to
    // enter the correct password at least three times in the past hour.
    // If so, revoke their access.
    if(shouldLockUserSignIn($connection, $user, $data)) {
        $message = 'Your account has been locked for one hour for too many'
                 . ' failed login attempts. Please contact ' . $support_email
                 . ' for assistance.';
        $data['errors']['locked'] = $message;
    }
}

echo json_encode($data);
