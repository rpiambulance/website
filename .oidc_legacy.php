<?php

require_once '.oidc_common.php';
require_once '.functions.php';

header('Content-Type: application/json');

function oidc_legacy_json_error($message, $status = 400) {
    http_response_code($status);
    echo json_encode(array(
        'success' => false,
        'error' => $message
    ));
    exit;
}

function oidc_legacy_current_user($connection, $sessionId) {
    if (empty($sessionId)) {
        return null;
    }
    $user = getUser($sessionId, $connection);
    return (!empty($user) && !empty($user['id'])) ? $user : null;
}

function oidc_legacy_is_linked($connection, $userId) {
    $issuer = rtrim(oidc_get_env('OIDC_ISSUER', ''), '/');
    if (empty($issuer)) {
        return false;
    }

    $stmt = $connection->prepare("SELECT id FROM oidc_identities WHERE userID = :userID AND issuer = :issuer LIMIT 1");
    $stmt->bindParam(':userID', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':issuer', $issuer);
    $stmt->execute();
    return !!$stmt->fetch(PDO::FETCH_ASSOC);
}

function oidc_legacy_provider_status($user) {
    if (empty($user['email'])) {
        return array(
            'can_check' => false,
            'has_account' => null,
            'action' => 'unknown'
        );
    }

    $providerLookup = oidc_provider_find_user_by_email($user['email']);
    if (!$providerLookup['ok']) {
        return array(
            'can_check' => false,
            'has_account' => null,
            'action' => 'unknown'
        );
    }

    return array(
        'can_check' => true,
        'has_account' => !!$providerLookup['exists'],
        'action' => $providerLookup['exists'] ? 'link' : 'create'
    );
}

function oidc_legacy_status_payload($connection, $user) {
    $linked = oidc_legacy_is_linked($connection, intval($user['id']));
    $provider = oidc_get_env('OIDC_PROVIDER_NAME', 'OpenID');
    $providerStatus = $linked ? array(
        'can_check' => true,
        'has_account' => true,
        'action' => 'none'
    ) : oidc_legacy_provider_status($user);

    return array(
        'success' => true,
        'provider' => $provider,
        'linked' => $linked,
        'can_check_provider' => $providerStatus['can_check'],
        'provider_has_account' => $providerStatus['has_account'],
        'action' => $linked ? 'none' : $providerStatus['action'],
        'user' => array(
            'username' => $user['username'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email']
        )
    );
}

$connection = openDatabaseConnection();
if (!$connection) {
    oidc_legacy_json_error('Unable to connect to the database.', 500);
}

$sessionId = '';
$post = array();
if (!empty($_COOKIE['RPIA-SESSION'])) {
    $sessionId = $_COOKIE['RPIA-SESSION'];
}
if (!empty($_GET['session_id'])) {
    $sessionId = $_GET['session_id'];
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    parse_str(file_get_contents('php://input'), $post);
    if (!empty($post['session_id'])) {
        $sessionId = $post['session_id'];
    }
}

$user = oidc_legacy_current_user($connection, $sessionId);
if (!$user) {
    oidc_legacy_json_error('Not authenticated.', 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(oidc_legacy_status_payload($connection, $user));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    oidc_legacy_json_error('Method not allowed.', 405);
}

$action = isset($post['action']) ? $post['action'] : '';

if ($action !== 'create') {
    oidc_legacy_json_error('Unsupported action.');
}

if (oidc_legacy_is_linked($connection, intval($user['id']))) {
    oidc_legacy_json_error('This account is already linked.');
}

$username = isset($post['username']) ? trim($post['username']) : '';
$firstName = isset($post['first_name']) ? trim($post['first_name']) : '';
$lastName = isset($post['last_name']) ? trim($post['last_name']) : '';
$email = isset($post['email']) ? trim($post['email']) : '';

if ($username === '' || $firstName === '' || $lastName === '' || $email === '') {
    oidc_legacy_json_error('Username, first name, last name, and email are required.');
}

if ($username !== $user['username'] || $firstName !== $user['first_name'] || $lastName !== $user['last_name'] || strcasecmp($email, $user['email']) !== 0) {
    oidc_legacy_json_error('The confirmation values must match your current profile.');
}

$providerLookup = oidc_provider_find_user_by_email($email);
if ($providerLookup['ok'] && $providerLookup['exists']) {
    oidc_legacy_json_error('A provider account already exists for this email. Use linking instead.');
}

$createResult = oidc_provider_create_user(array(
    'username' => $username,
    'first_name' => $firstName,
    'last_name' => $lastName,
    'email' => $email
));

if (!$createResult['ok']) {
    oidc_legacy_json_error('Unable to create provider account.');
}

$subject = $createResult['subject'];
$issuer = $createResult['issuer'];
$insertIdentity = $connection->prepare(
    "INSERT INTO oidc_identities (issuer, subject, userID, email) VALUES (:issuer, :subject, :userID, :email)"
);
$insertIdentity->bindParam(':issuer', $issuer);
$insertIdentity->bindParam(':subject', $subject);
$insertIdentity->bindParam(':userID', $user['id'], PDO::PARAM_INT);
$insertIdentity->bindParam(':email', $email);
$insertIdentity->execute();

echo json_encode(array(
    'success' => true,
    'linked' => true
));
exit;

?>
