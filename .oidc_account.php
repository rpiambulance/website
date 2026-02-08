<?php

require_once '.oidc_common.php';
require_once '.db_config.php';

header('Content-Type: application/json');

function oidc_json_error($message, $status = 400) {
    http_response_code($status);
    echo json_encode(array(
        'success' => false,
        'error' => $message
    ));
    exit;
}

function oidc_query_login_credentials($connection, $username) {
    $stmt = $connection->prepare("SELECT * FROM members WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function oidc_build_insert_columns($connection, $merged) {
    $schemaStmt = $connection->prepare(
        "SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'members'"
    );
    $schemaStmt->execute();
    $columns = $schemaStmt->fetchAll(PDO::FETCH_ASSOC);

    $required = array();
    foreach ($columns as $c) {
        if ($c['COLUMN_NAME'] === 'id' || strpos($c['EXTRA'], 'auto_increment') !== false) {
            continue;
        }
        if ($c['IS_NULLABLE'] === 'NO' && $c['COLUMN_DEFAULT'] === null) {
            $required[] = $c['COLUMN_NAME'];
        }
    }

    $missing = array();
    foreach ($required as $column) {
        if (!array_key_exists($column, $merged) || $merged[$column] === '' || $merged[$column] === null) {
            $missing[] = $column;
        }
    }

    return array(
        'missing' => $missing,
        'columns' => $columns
    );
}

function oidc_claim_to_member_values($challenge) {
    $values = oidc_claim_mapped_values($challenge);
    foreach ($values as $key => $value) {
        if ($value === null || $value === '') {
            unset($values[$key]);
        }
    }
    return $values;
}

$connection = openDatabaseConnection();
if (!$connection) {
    oidc_json_error('Unable to open database connection.', 500);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($_GET['challenge_id'])) {
        oidc_json_error('challenge_id is required.');
    }

    $challenge = oidc_get_challenge($connection, $_GET['challenge_id']);
    if (!$challenge) {
        oidc_json_error('The OIDC challenge is invalid or expired.', 404);
    }

    $requirements = oidc_required_member_fields($connection, $challenge);
    echo json_encode(array(
        'success' => true,
        'challenge_id' => $challenge['challenge_id'],
        'profile' => array(
            'email' => $challenge['email'],
            'given_name' => $challenge['given_name'],
            'family_name' => $challenge['family_name'],
            'preferred_username' => $challenge['preferred_username'],
            'name' => $challenge['name']
        ),
        'prefill' => $requirements['mapped'],
        'required_fields' => $requirements['required']
    ));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    oidc_json_error('Method not allowed.', 405);
}

parse_str(file_get_contents("php://input"), $post);
$action = isset($post['action']) ? $post['action'] : '';
$challengeId = isset($post['challenge_id']) ? $post['challenge_id'] : '';
if (empty($action) || empty($challengeId)) {
    oidc_json_error('action and challenge_id are required.');
}

$challenge = oidc_get_challenge($connection, $challengeId);
if (!$challenge) {
    oidc_json_error('The OIDC challenge is invalid or expired.', 404);
}

if ($action === 'link') {
    $username = isset($post['username']) ? $post['username'] : '';
    $password = isset($post['password']) ? $post['password'] : '';
    if (empty($username) || empty($password)) {
        oidc_json_error('Username and password are required for account linking.');
    }

    $userInfo = oidc_query_login_credentials($connection, $username);
    if (empty($userInfo)) {
        oidc_json_error('Invalid username/password combination.');
    }

    $passwordOk = password_verify(hash('sha256', $password), $userInfo['password']) || md5($password) === $userInfo['password'];
    if (!$passwordOk) {
        oidc_json_error('Invalid username/password combination.');
    }

    if ($userInfo['active'] !== '1') {
        oidc_json_error('Your account is inactive.');
    }
    if (isset($userInfo['access_revoked']) && $userInfo['access_revoked'] === '1') {
        oidc_json_error('Access has been revoked for your account.');
    }

    $existingIdentity = $connection->prepare(
        "SELECT userID FROM oidc_identities WHERE issuer = :issuer AND subject = :subject LIMIT 1"
    );
    $existingIdentity->bindParam(':issuer', $challenge['issuer']);
    $existingIdentity->bindParam(':subject', $challenge['subject']);
    $existingIdentity->execute();
    $existing = $existingIdentity->fetch(PDO::FETCH_ASSOC);
    if ($existing && intval($existing['userID']) !== intval($userInfo['id'])) {
        oidc_json_error('This OpenID identity is already linked to another account.');
    }

    if (!$existing) {
        $insertIdentity = $connection->prepare(
            "INSERT INTO oidc_identities (issuer, subject, userID, email) VALUES (:issuer, :subject, :userID, :email)"
        );
        $insertIdentity->bindParam(':issuer', $challenge['issuer']);
        $insertIdentity->bindParam(':subject', $challenge['subject']);
        $insertIdentity->bindParam(':userID', $userInfo['id'], PDO::PARAM_INT);
        $email = $challenge['email'];
        $insertIdentity->bindParam(':email', $email);
        $insertIdentity->execute();
    }

    oidc_consume_challenge($connection, $challengeId);
    $sessionId = oidc_create_session_for_user($connection, intval($userInfo['id']));

    echo json_encode(array(
        'success' => true,
        'session_id' => $sessionId
    ));
    exit;
}

if ($action === 'create') {
    if (!isset($post['data'])) {
        oidc_json_error('data is required for account creation.');
    }

    $input = json_decode($post['data'], true);
    if (!is_array($input)) {
        oidc_json_error('Invalid data payload.');
    }

    $mapped = oidc_claim_to_member_values($challenge);
    $merged = array_merge($mapped, $input);

    if (!isset($merged['lastlogin']) || $merged['lastlogin'] === '') {
        $merged['lastlogin'] = date('Y-m-d');
    }

    if (isset($merged['password']) && $merged['password'] !== '') {
        $merged['password'] = password_hash(hash('sha256', $merged['password']), PASSWORD_DEFAULT);
    }

    $requirements = oidc_build_insert_columns($connection, $merged);
    if (!empty($requirements['missing'])) {
        oidc_json_error('Missing required fields: ' . implode(', ', $requirements['missing']));
    }

    $usernameCheck = $connection->prepare("SELECT id FROM members WHERE username = :username LIMIT 1");
    $usernameCheck->bindParam(':username', $merged['username']);
    $usernameCheck->execute();
    if ($usernameCheck->fetch(PDO::FETCH_ASSOC)) {
        oidc_json_error('The selected username already exists.');
    }

    $maxIdStmt = $connection->query("SELECT MAX(id) AS max_id FROM members");
    $maxId = $maxIdStmt->fetch(PDO::FETCH_ASSOC);
    $newId = intval($maxId['max_id']) + 1;

    $columns = array('id');
    $placeholders = array(':id');
    $bindValues = array(':id' => $newId);

    foreach ($merged as $column => $value) {
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $column) || $column === 'id') {
            continue;
        }
        $columns[] = $column;
        $placeholder = ':' . $column;
        $placeholders[] = $placeholder;
        $bindValues[$placeholder] = $value;
    }

    $sql = "INSERT INTO members (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $placeholders) . ")";
    $insertMember = $connection->prepare($sql);
    foreach ($bindValues as $placeholder => $value) {
        $insertMember->bindValue($placeholder, $value);
    }
    $insertMember->execute();

    $identityInsert = $connection->prepare(
        "INSERT INTO oidc_identities (issuer, subject, userID, email) VALUES (:issuer, :subject, :userID, :email)"
    );
    $identityInsert->bindParam(':issuer', $challenge['issuer']);
    $identityInsert->bindParam(':subject', $challenge['subject']);
    $identityInsert->bindParam(':userID', $newId, PDO::PARAM_INT);
    $email = isset($merged['email']) ? $merged['email'] : $challenge['email'];
    $identityInsert->bindParam(':email', $email);
    $identityInsert->execute();

    oidc_consume_challenge($connection, $challengeId);
    $sessionId = oidc_create_session_for_user($connection, $newId);

    echo json_encode(array(
        'success' => true,
        'session_id' => $sessionId
    ));
    exit;
}

oidc_json_error('Unsupported action.');

?>
