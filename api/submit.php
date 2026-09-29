<?php
/**
 * Enquiry capture endpoint.
 * Accepts a JSON POST from the React "Apply / Enquire now" form,
 * stores it as a lead, and returns JSON.
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

$firstName = $field('firstName');
$lastName  = $field('lastName');
$email     = $field('email');

// Minimal server-side validation.
if ($firstName === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name and a valid email are required.']);
    exit;
}

try {
    $pdo = ue_db();
    $stmt = $pdo->prepare('INSERT INTO websiteleads
        (created_at, first_name, last_name, email, phone, country,
         programme, programme_title, qualification, intake, message,
         consent, source, ip)
        VALUES
        (:created_at, :first_name, :last_name, :email, :phone, :country,
         :programme, :programme_title, :qualification, :intake, :message,
         :consent, :source, :ip)');

    $stmt->execute([
        ':created_at'      => gmdate('Y-m-d H:i:s'),
        ':first_name'      => $firstName,
        ':last_name'       => $lastName,
        ':email'           => $email,
        ':phone'           => $field('phone'),
        ':country'         => $field('country'),
        ':programme'       => $field('programme'),
        ':programme_title' => $field('programmeTitle'),
        ':qualification'   => $field('qualification'),
        ':intake'          => $field('intake'),
        ':message'         => $field('message'),
        ':consent'         => !empty($data['consent']) ? 1 : 0,
        ':source'          => $field('source') !== '' ? $field('source') : 'enquire-now',
        ':ip'              => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $id = (int) $pdo->lastInsertId();

    // Best-effort forward to the CRM leads endpoint. The lead is already safely
    // stored above, so any CRM failure is logged and swallowed — never fail the
    // submission.
    //
    // Send EVERY field the form captured: programme / qualification / intake /
    // country all render on the CRM's Website Applications page, and anything
    // omitted here shows there as "—". `programme` is sent as the human-readable
    // title ("MBA in Accounting & Finance") rather than the internal slug, with
    // the slug as the fallback when a title wasn't supplied.
    //
    // The block after the documented eight is extra context the CRM may not
    // render today but which is stored alongside the lead: the split name, the
    // programme slug behind the title, the marketing consent flag, and the
    // provenance of the submission (source / IP / local id / timestamp).
    try {
        ue_crm_post(ue_env('CRM_ENDPOINT_URL', ''), [
            'name'           => trim($firstName . ' ' . $lastName),
            'email'          => $email,
            'phone'          => $field('phone'),
            'message'        => $field('message'),
            'programme'      => $field('programmeTitle') !== '' ? $field('programmeTitle') : $field('programme'),
            'qualification'  => $field('qualification'),
            'intake'         => $field('intake'),
            'country'        => $field('country'),

            'firstName'      => $firstName,
            'lastName'       => $lastName,
            'programmeSlug'  => $field('programme'),
            'programmeTitle' => $field('programmeTitle'),
            'consent'        => !empty($data['consent']),
            'source'         => $field('source') !== '' ? $field('source') : 'enquire-now',
            'ip'             => $_SERVER['REMOTE_ADDR'] ?? '',
            'websiteLeadId'  => $id,
            'submittedAt'    => gmdate('c'),
        ], 'submit.php');
    } catch (Throwable $crmError) {
        error_log('submit.php: CRM forwarding threw: ' . $crmError->getMessage());
    }

    // Best-effort confirmation email to the lead. A mail failure must never
    // fail the request — the lead is already safely stored.
    try {
        ue_send_lead_confirmation($email, $firstName, $field('programmeTitle'));
    } catch (Throwable $mailError) {
        error_log('submit.php: confirmation email failed: ' . $mailError->getMessage());
    }

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save enquiry.']);
}
