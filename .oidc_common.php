<?php

require_once '.functions.php';

function oidc_get_env($name, $default = '') {
    $value = getenv($name);
    if ($value === false || $value === null || $value === '') {
        if (isset($_ENV[$name]) && $_ENV[$name] !== '') {
            return $_ENV[$name];
        }
        return $default;
    }
    return $value;
}

function oidc_base64url_decode($input) {
    $remainder = strlen($input) % 4;
    if ($remainder > 0) {
        $input .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($input, '-_', '+/'));
}

function oidc_base64url_encode($input) {
    return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
}

function oidc_fetch_json($url) {
    $opts = array(
        'http' => array(
            'method' => 'GET',
            'timeout' => 10,
            'ignore_errors' => true
        )
    );
    $context = stream_context_create($opts);
    $raw = @file_get_contents($url, false, $context);
    if ($raw === false) {
        return null;
    }
    $decoded = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }
    return $decoded;
}

function oidc_post_form_json($url, $data) {
    $opts = array(
        'http' => array(
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($data),
            'timeout' => 15,
            'ignore_errors' => true
        )
    );
    $context = stream_context_create($opts);
    $raw = @file_get_contents($url, false, $context);
    if ($raw === false) {
        return null;
    }
    $decoded = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }
    return $decoded;
}

function oidc_get_discovery() {
    $issuer = rtrim(oidc_get_env('OIDC_ISSUER', ''), '/');
    $discoveryUrl = oidc_get_env('OIDC_DISCOVERY_URL', '');
    if (empty($discoveryUrl) && !empty($issuer)) {
        $discoveryUrl = $issuer . '/.well-known/openid-configuration';
    }

    if (empty($discoveryUrl)) {
        return null;
    }

    $discovery = oidc_fetch_json($discoveryUrl);
    if (!$discovery) {
        return null;
    }

    if (empty($discovery['issuer']) && !empty($issuer)) {
        $discovery['issuer'] = $issuer;
    }

    return $discovery;
}

function oidc_encode_length($length) {
    if ($length <= 0x7f) {
        return chr($length);
    }
    $temp = ltrim(pack('N', $length), chr(0));
    return chr(0x80 | strlen($temp)) . $temp;
}

function oidc_asn1_int($bytes) {
    if (ord($bytes[0]) > 0x7f) {
        $bytes = chr(0) . $bytes;
    }
    return chr(0x02) . oidc_encode_length(strlen($bytes)) . $bytes;
}

function oidc_build_rsa_pem($modulusB64, $exponentB64) {
    $modulus = oidc_base64url_decode($modulusB64);
    $exponent = oidc_base64url_decode($exponentB64);

    $modulusPart = oidc_asn1_int($modulus);
    $exponentPart = oidc_asn1_int($exponent);
    $rsaPublicKey = chr(0x30) . oidc_encode_length(strlen($modulusPart . $exponentPart)) . $modulusPart . $exponentPart;

    $bitString = chr(0x00) . $rsaPublicKey;
    $bitString = chr(0x03) . oidc_encode_length(strlen($bitString)) . $bitString;

    $rsaOid = chr(0x06) . chr(0x09) . hex2bin('2a864886f70d010101');
    $nullParam = chr(0x05) . chr(0x00);
    $algo = chr(0x30) . oidc_encode_length(strlen($rsaOid . $nullParam)) . $rsaOid . $nullParam;

    $spki = chr(0x30) . oidc_encode_length(strlen($algo . $bitString)) . $algo . $bitString;

    return "-----BEGIN PUBLIC KEY-----\n"
        . chunk_split(base64_encode($spki), 64, "\n")
        . "-----END PUBLIC KEY-----\n";
}

function oidc_verify_signature($signingInput, $signature, $alg, $jwk) {
    if (empty($jwk['n']) || empty($jwk['e'])) {
        return false;
    }

    $pem = oidc_build_rsa_pem($jwk['n'], $jwk['e']);

    $algoMap = array(
        'RS256' => OPENSSL_ALGO_SHA256,
        'RS384' => OPENSSL_ALGO_SHA384,
        'RS512' => OPENSSL_ALGO_SHA512
    );
    if (!isset($algoMap[$alg])) {
        return false;
    }

    return openssl_verify($signingInput, $signature, $pem, $algoMap[$alg]) === 1;
}

function oidc_verify_id_token($idToken, $discovery, $clientId) {
    $parts = explode('.', $idToken);
    if (count($parts) !== 3) {
        return array('ok' => false, 'error' => 'Invalid ID token format.');
    }

    $header = json_decode(oidc_base64url_decode($parts[0]), true);
    $payload = json_decode(oidc_base64url_decode($parts[1]), true);
    $signature = oidc_base64url_decode($parts[2]);
    if (!$header || !$payload) {
        return array('ok' => false, 'error' => 'Invalid ID token encoding.');
    }

    if (empty($header['alg']) || strtoupper($header['alg']) === 'NONE') {
        return array('ok' => false, 'error' => 'Invalid token algorithm.');
    }
    if (empty($header['kid'])) {
        return array('ok' => false, 'error' => 'Token key id missing.');
    }

    if (empty($discovery['jwks_uri'])) {
        return array('ok' => false, 'error' => 'OIDC provider jwks_uri is missing.');
    }
    $jwks = oidc_fetch_json($discovery['jwks_uri']);
    if (!$jwks || empty($jwks['keys'])) {
        return array('ok' => false, 'error' => 'Unable to read provider JWKS.');
    }

    $matchingKey = null;
    foreach ($jwks['keys'] as $key) {
        if (!empty($key['kid']) && $key['kid'] === $header['kid']) {
            $matchingKey = $key;
            break;
        }
    }
    if (!$matchingKey) {
        return array('ok' => false, 'error' => 'Unable to find signing key for token.');
    }

    $signingInput = $parts[0] . '.' . $parts[1];
    if (!oidc_verify_signature($signingInput, $signature, $header['alg'], $matchingKey)) {
        return array('ok' => false, 'error' => 'Invalid token signature.');
    }

    $now = time();
    if (empty($payload['iss']) || empty($discovery['issuer']) || $payload['iss'] !== $discovery['issuer']) {
        return array('ok' => false, 'error' => 'Token issuer is invalid.');
    }

    if (empty($payload['aud'])) {
        return array('ok' => false, 'error' => 'Token audience missing.');
    }
    $aud = $payload['aud'];
    $audValid = is_array($aud) ? in_array($clientId, $aud, true) : $aud === $clientId;
    if (!$audValid) {
        return array('ok' => false, 'error' => 'Token audience is invalid.');
    }

    if (!empty($payload['nbf']) && $now < intval($payload['nbf'])) {
        return array('ok' => false, 'error' => 'Token is not yet valid.');
    }
    if (empty($payload['exp']) || $now >= intval($payload['exp'])) {
        return array('ok' => false, 'error' => 'Token has expired.');
    }

    if (isset($_COOKIE['OIDC_NONCE'])) {
        $nonce = $_COOKIE['OIDC_NONCE'];
        setcookie('OIDC_NONCE', '', time() - 3600, '/');
        if (empty($payload['nonce']) || !hash_equals($nonce, $payload['nonce'])) {
            return array('ok' => false, 'error' => 'Token nonce mismatch.');
        }
    }

    if (empty($payload['sub'])) {
        return array('ok' => false, 'error' => 'Token subject missing.');
    }

    return array('ok' => true, 'payload' => $payload);
}

function oidc_create_session_for_user($connection, $userId) {
    $sessionId = bin2hex(random_bytes(50));

    date_default_timezone_set('America/New_York');
    $expiration = new DateTime();
    $expiration = $expiration->modify('+5 day')->format('Y-m-d H:i:s');

    $stmt = $connection->prepare(
        "INSERT INTO `sessions` (`sessionID`, `userID`, `expiration`) VALUES (:sessionID, :userID, :expiration)"
    );
    $stmt->bindParam(':sessionID', $sessionId, PDO::PARAM_STR);
    $stmt->bindParam(':userID', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':expiration', $expiration);
    $stmt->execute();

    setcookie('RPIA-SESSION', $sessionId, strtotime('+5 day', time()), '/');

    return $sessionId;
}

function oidc_generate_challenge($connection, $payload, $issuer) {
    $challengeId = bin2hex(random_bytes(32));
    $expiresAt = (new DateTime())->modify('+10 minutes')->format('Y-m-d H:i:s');
    $tokenExp = isset($payload['exp']) ? date('Y-m-d H:i:s', intval($payload['exp'])) : null;
    $claimsJson = json_encode($payload);

    $stmt = $connection->prepare(
        "INSERT INTO oidc_login_challenges
         (challenge_id, issuer, subject, email, given_name, family_name, preferred_username, name, claims_json, id_token_exp, expires_at, consumed)
         VALUES
         (:challenge_id, :issuer, :subject, :email, :given_name, :family_name, :preferred_username, :name, :claims_json, :id_token_exp, :expires_at, 0)"
    );
    $stmt->bindParam(':challenge_id', $challengeId);
    $stmt->bindParam(':issuer', $issuer);
    $stmt->bindParam(':subject', $payload['sub']);
    $email = isset($payload['email']) ? $payload['email'] : null;
    $givenName = isset($payload['given_name']) ? $payload['given_name'] : null;
    $familyName = isset($payload['family_name']) ? $payload['family_name'] : null;
    $preferredUsername = isset($payload['preferred_username']) ? $payload['preferred_username'] : null;
    $name = isset($payload['name']) ? $payload['name'] : null;
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':given_name', $givenName);
    $stmt->bindParam(':family_name', $familyName);
    $stmt->bindParam(':preferred_username', $preferredUsername);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':claims_json', $claimsJson);
    $stmt->bindParam(':id_token_exp', $tokenExp);
    $stmt->bindParam(':expires_at', $expiresAt);
    $stmt->execute();

    return $challengeId;
}

function oidc_get_challenge($connection, $challengeId) {
    $cleanupStmt = $connection->prepare("DELETE FROM oidc_login_challenges WHERE expires_at <= NOW() OR consumed = 1");
    $cleanupStmt->execute();

    $stmt = $connection->prepare(
        "SELECT * FROM oidc_login_challenges
         WHERE challenge_id = :challenge_id AND consumed = 0 AND expires_at > NOW()"
    );
    $stmt->bindParam(':challenge_id', $challengeId);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? $row : null;
}

function oidc_consume_challenge($connection, $challengeId) {
    $stmt = $connection->prepare("UPDATE oidc_login_challenges SET consumed = 1 WHERE challenge_id = :challenge_id");
    $stmt->bindParam(':challenge_id', $challengeId);
    $stmt->execute();
}

function oidc_claim_mapped_values($challenge) {
    return array(
        'username' => !empty($challenge['preferred_username']) ? $challenge['preferred_username'] : null,
        'first_name' => !empty($challenge['given_name']) ? $challenge['given_name'] : null,
        'last_name' => !empty($challenge['family_name']) ? $challenge['family_name'] : null,
        'email' => !empty($challenge['email']) ? $challenge['email'] : null
    );
}

function oidc_required_member_fields($connection, $challenge) {
    $schemaStmt = $connection->prepare(
        "SELECT COLUMN_NAME, DATA_TYPE
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'members'
           AND IS_NULLABLE = 'NO'
           AND COLUMN_DEFAULT IS NULL
           AND EXTRA NOT LIKE '%auto_increment%'"
    );
    $schemaStmt->execute();
    $rows = $schemaStmt->fetchAll(PDO::FETCH_ASSOC);

    $mappedValues = oidc_claim_mapped_values($challenge);

    $required = array();
    foreach ($rows as $row) {
        $column = $row['COLUMN_NAME'];
        if ($column === 'id') {
            continue;
        }
        if (isset($mappedValues[$column]) && !empty($mappedValues[$column])) {
            continue;
        }
        $required[] = array(
            'name' => $column,
            'type' => $row['DATA_TYPE']
        );
    }

    return array(
        'required' => $required,
        'mapped' => $mappedValues
    );
}

function oidc_http_json_request($method, $url, $headers = array(), $body = null, $timeout = 15) {
    $headerLines = array();
    foreach ($headers as $key => $value) {
        $headerLines[] = $key . ': ' . $value;
    }

    $opts = array(
        'http' => array(
            'method' => strtoupper($method),
            'timeout' => $timeout,
            'ignore_errors' => true
        )
    );

    if (!empty($headerLines)) {
        $opts['http']['header'] = implode("\r\n", $headerLines) . "\r\n";
    }
    if ($body !== null) {
        $opts['http']['content'] = $body;
    }

    $context = stream_context_create($opts);
    $raw = @file_get_contents($url, false, $context);
    $status = 0;
    $responseHeaders = array();

    if (isset($http_response_header) && is_array($http_response_header)) {
        $responseHeaders = $http_response_header;
        foreach ($http_response_header as $line) {
            if (preg_match('/^HTTP\/\d+(?:\.\d+)?\s+(\d+)/', $line, $m)) {
                $status = intval($m[1]);
            }
        }
    }

    $decoded = null;
    if ($raw !== false && $raw !== '') {
        $decoded = json_decode($raw, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $decoded = null;
        }
    }

    return array(
        'status' => $status,
        'headers' => $responseHeaders,
        'json' => $decoded,
        'raw' => $raw
    );
}

function oidc_keycloak_context() {
    $issuer = rtrim(oidc_get_env('OIDC_ISSUER', ''), '/');
    if (empty($issuer) || strpos($issuer, '/realms/') === false) {
        return null;
    }

    $parts = explode('/realms/', $issuer, 2);
    if (count($parts) !== 2 || empty($parts[0]) || empty($parts[1])) {
        return null;
    }

    return array(
        'issuer' => $issuer,
        'base' => $parts[0],
        'realm' => $parts[1]
    );
}

function oidc_keycloak_admin_access_token() {
    $ctx = oidc_keycloak_context();
    if (!$ctx) {
        return array('ok' => false, 'error' => 'issuer_invalid');
    }

    $clientId = oidc_get_env('OIDC_CLIENT_ID', '');
    $clientSecret = oidc_get_env('OIDC_CLIENT_SECRET', '');

    if (empty($clientId) || empty($clientSecret)) {
        return array('ok' => false, 'error' => 'admin_client_missing');
    }

    $tokenEndpoint = $ctx['base'] . '/realms/' . rawurlencode($ctx['realm']) . '/protocol/openid-connect/token';
    $body = http_build_query(array(
        'grant_type' => 'client_credentials',
        'client_id' => $clientId,
        'client_secret' => $clientSecret
    ));

    $tokenResponse = oidc_http_json_request(
        'POST',
        $tokenEndpoint,
        array('Content-Type' => 'application/x-www-form-urlencoded'),
        $body
    );

    if ($tokenResponse['status'] < 200 || $tokenResponse['status'] >= 300 || empty($tokenResponse['json']['access_token'])) {
        return array('ok' => false, 'error' => 'admin_token_failed');
    }

    return array(
        'ok' => true,
        'ctx' => $ctx,
        'access_token' => $tokenResponse['json']['access_token']
    );
}

function oidc_provider_find_user_by_email($email) {
    if (empty($email)) {
        return array('ok' => false, 'error' => 'email_missing');
    }

    $token = oidc_keycloak_admin_access_token();
    if (!$token['ok']) {
        return $token;
    }

    $ctx = $token['ctx'];
    $url = $ctx['base'] . '/admin/realms/' . rawurlencode($ctx['realm']) . '/users?exact=true&max=2&email=' . rawurlencode($email);
    $response = oidc_http_json_request(
        'GET',
        $url,
        array('Authorization' => 'Bearer ' . $token['access_token'])
    );

    if ($response['status'] < 200 || $response['status'] >= 300 || !is_array($response['json'])) {
        return array('ok' => false, 'error' => 'provider_lookup_failed');
    }

    $users = $response['json'];
    return array(
        'ok' => true,
        'exists' => count($users) > 0,
        'users' => $users,
        'issuer' => $ctx['issuer']
    );
}

function oidc_provider_create_user($profile) {
    $required = array('username', 'email', 'first_name', 'last_name');
    foreach ($required as $field) {
        if (empty($profile[$field])) {
            return array('ok' => false, 'error' => 'missing_' . $field);
        }
    }

    $token = oidc_keycloak_admin_access_token();
    if (!$token['ok']) {
        return $token;
    }

    $ctx = $token['ctx'];
    $createUrl = $ctx['base'] . '/admin/realms/' . rawurlencode($ctx['realm']) . '/users';
    $payload = json_encode(array(
        'enabled' => true,
        'username' => $profile['username'],
        'email' => $profile['email'],
        'firstName' => $profile['first_name'],
        'lastName' => $profile['last_name'],
        'emailVerified' => false,
        'requiredActions' => array('UPDATE_PASSWORD')
    ));

    $createResponse = oidc_http_json_request(
        'POST',
        $createUrl,
        array(
            'Authorization' => 'Bearer ' . $token['access_token'],
            'Content-Type' => 'application/json'
        ),
        $payload
    );

    if ($createResponse['status'] === 409) {
        $raw = strtolower((string) $createResponse['raw']);
        $json = is_array($createResponse['json']) ? $createResponse['json'] : array();
        $msg = '';
        if (isset($json['errorMessage'])) {
            $msg = strtolower((string) $json['errorMessage']);
        } else if (isset($json['message'])) {
            $msg = strtolower((string) $json['message']);
        }

        $haystack = $raw . ' ' . $msg;
        if (strpos($haystack, 'username') !== false) {
            return array('ok' => false, 'error' => 'provider_username_exists');
        }
        if (strpos($haystack, 'email') !== false) {
            return array('ok' => false, 'error' => 'provider_email_exists');
        }
        return array('ok' => false, 'error' => 'provider_account_exists');
    }

    if ($createResponse['status'] !== 201) {
        return array(
            'ok' => false,
            'error' => 'provider_create_failed',
            'error_detail' => 'HTTP ' . $createResponse['status']
        );
    }

    $lookup = oidc_provider_find_user_by_email($profile['email']);
    if (!$lookup['ok'] || empty($lookup['users'][0]['id'])) {
        return array('ok' => false, 'error' => 'provider_create_lookup_failed');
    }

    $userId = $lookup['users'][0]['id'];
    $executeActionsUrl = $ctx['base'] . '/admin/realms/' . rawurlencode($ctx['realm'])
        . '/users/' . rawurlencode($userId) . '/execute-actions-email';
    $executeActionsResponse = oidc_http_json_request(
        'PUT',
        $executeActionsUrl,
        array(
            'Authorization' => 'Bearer ' . $token['access_token'],
            'Content-Type' => 'application/json'
        ),
        json_encode(array('UPDATE_PASSWORD'))
    );

    if ($executeActionsResponse['status'] < 200 || $executeActionsResponse['status'] >= 300) {
        return array('ok' => false, 'error' => 'provider_execute_actions_email_failed');
    }

    return array(
        'ok' => true,
        'created' => $createResponse['status'] === 201,
        'subject' => $userId,
        'issuer' => $ctx['issuer']
    );
}

function oidc_provider_get_user_by_subject($issuer, $subject) {
    if (empty($subject)) {
        return array('ok' => false, 'error' => 'subject_missing');
    }

    $token = oidc_keycloak_admin_access_token();
    if (!$token['ok']) {
        return $token;
    }

    $ctx = $token['ctx'];
    if (!empty($issuer) && rtrim($issuer, '/') !== rtrim($ctx['issuer'], '/')) {
        return array('ok' => false, 'error' => 'issuer_mismatch');
    }

    $url = $ctx['base'] . '/admin/realms/' . rawurlencode($ctx['realm']) . '/users/' . rawurlencode($subject);
    $response = oidc_http_json_request(
        'GET',
        $url,
        array('Authorization' => 'Bearer ' . $token['access_token'])
    );

    if ($response['status'] === 404) {
        return array('ok' => true, 'found' => false);
    }

    if ($response['status'] < 200 || $response['status'] >= 300 || !is_array($response['json'])) {
        return array('ok' => false, 'error' => 'provider_subject_lookup_failed');
    }

    return array(
        'ok' => true,
        'found' => true,
        'user' => $response['json']
    );
}

?>
