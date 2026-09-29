<?php
/**
 * Stateless auth helpers for the admin JSON API.
 *
 * The admin UI is a React page (frontend). These endpoints are the only
 * "backend" part of login: they verify the credential and issue / check a
 * signed token. No PHP HTML is rendered.
 *
 * Tokens are HMAC-signed (APP_SECRET from api/.env) and carry an expiry, so
 * no server-side session store is needed and they work cross-origin
 * (localhost frontend -> hosted backend) without cookies.
 */

require_once __DIR__ . '/../_db.php';

function ue_secret(): string
{
    $s = ue_env('APP_SECRET', '');
    // Fallback keeps things working if APP_SECRET is missing, but set a real
    // one in api/.env for production.
    return ($s === '' || $s === null) ? 'ue-insecure-' . md5(__DIR__) : $s;
}

function ue_b64url(string $bin): string
{
    return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}

function ue_b64url_decode(string $s): string
{
    return base64_decode(strtr($s, '-_', '+/'));
}

/** Verify a username/password against the admin_users table (bcrypt). */
function ue_check_credentials(string $user, string $pass): bool
{
    $stmt = ue_db()->prepare('SELECT password_hash FROM admin_users WHERE username = ?');
    $stmt->execute([$user]);
    $hash = $stmt->fetchColumn();

    return is_string($hash) && password_verify($pass, $hash);
}

/** Issue a signed token for $user, valid for $ttl seconds (default 8h). */
function ue_issue_token(string $user, int $ttl = 28800): string
{
    $payload = ue_b64url(json_encode(['u' => $user, 'exp' => time() + $ttl]));
    $sig     = ue_b64url(hash_hmac('sha256', $payload, ue_secret(), true));
    return $payload . '.' . $sig;
}

/** Return the username if the token is valid and unexpired, else null. */
function ue_verify_token(?string $token): ?string
{
    if (!$token || substr_count($token, '.') !== 1) {
        return null;
    }
    [$payload, $sig] = explode('.', $token);
    $expected = ue_b64url(hash_hmac('sha256', $payload, ue_secret(), true));
    if (!hash_equals($expected, $sig)) {
        return null;
    }
    $data = json_decode(ue_b64url_decode($payload), true);
    if (!is_array($data) || (int) ($data['exp'] ?? 0) < time()) {
        return null;
    }
    return $data['u'] ?? null;
}

/** Extract the Bearer token from the Authorization header. */
function ue_bearer_token(): ?string
{
    $h = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    return preg_match('/Bearer\s+(.+)/i', $h, $m) ? trim($m[1]) : null;
}

/** Standard CORS + JSON headers for the admin API. Handles preflight. */
function ue_api_headers(string $methods): void
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: ' . $methods . ', OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
