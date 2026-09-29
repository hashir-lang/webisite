<?php
/**
 * Admin login — JSON API.
 * POST { username, password }  ->  { ok: true, token, user }  or 401.
 * Consumed by the React /admin/login page; renders no HTML.
 */

require __DIR__ . '/_token.php';
ue_api_headers('POST');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST;
}

$user = trim((string) ($data['username'] ?? ''));
$pass = (string) ($data['password'] ?? '');

if ($user === '' || $pass === '' || !ue_check_credentials($user, $pass)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Incorrect username or password.']);
    exit;
}

echo json_encode([
    'ok'    => true,
    'token' => ue_issue_token($user),
    'user'  => $user,
]);
