<?php
/**
 * Sign-in capture endpoint.
 * Accepts a JSON POST from the React welcome popup (name + email),
 * stores it in the `signins` table, and returns JSON.
 *
 * CORS is enabled so the Vite dev server (http://localhost:8080) can
 * post to Apache during development. In production both are served from
 * the same Apache origin, so CORS is simply ignored.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Pre-flight request from the browser.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

require __DIR__ . '/_db.php';
require __DIR__ . '/_mail.php';

// Accept both JSON and classic form-encoded bodies.
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$field = function (string $key) use ($data): string {
    return isset($data[$key]) ? trim((string) $data[$key]) : '';
};

$name  = $field('name');
$email = $field('email');
$phone = $field('phone');

// Minimal server-side validation.
if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name and a valid email are required.']);
    exit;
}

try {
    $pdo = ue_db();
    // welcome_sent / drip_index / last_drip_date seed the automated mailer:
    // the overview goes out now, and the first daily course email follows
    // tomorrow (cron gates on last_drip_date < today).
    $stmt = $pdo->prepare('INSERT INTO signins
        (created_at, name, email, phone, ip, welcome_sent, drip_index, last_drip_date)
        VALUES
        (:created_at, :name, :email, :phone, :ip, 1, 0, :today)');

    $stmt->execute([
        ':created_at' => gmdate('Y-m-d H:i:s'),
        ':name'       => $name,
        ':email'      => $email,
        ':phone'      => $phone,
        ':ip'         => $_SERVER['REMOTE_ADDR'] ?? '',
        ':today'      => gmdate('Y-m-d'),
    ]);

    $id = (int) $pdo->lastInsertId();

    // Best-effort forward to the CRM sign-ins endpoint (separate from the
    // enquiry/leads endpoint, but authenticated with the same CRM_API_KEY).
    // The record is already safely stored above, so any CRM failure is logged
    // and swallowed — never fail the popup submission.
    try {
        ue_crm_post(ue_env('CRM_SIGNINS_ENDPOINT_URL', ''), [
            'name'  => $name,
            'email' => $email,
            'phone' => $phone,
        ], 'signin.php');
    } catch (Throwable $crmError) {
        error_log('signin.php: CRM forwarding threw: ' . $crmError->getMessage());
    }

    // Best-effort welcome/overview email — never fail the request over mail.
    try {
        ue_send_welcome_overview($email, $name);
    } catch (Throwable $mailError) {
        error_log('signin.php: welcome email failed: ' . $mailError->getMessage());
    }

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save sign-in.']);
}
