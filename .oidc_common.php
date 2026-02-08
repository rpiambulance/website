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

?>
