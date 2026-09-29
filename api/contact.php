<?php
/**
 * Contact Us capture endpoint.
 * Accepts a JSON POST from the React /contact-us form, stores it in the
 * `contact_messages` table, and returns JSON.
 *
 * Separate from submit.php (the Enquire/Apply lead pipeline) because this form
 * captures a subject line and a free-text message rather than a programme
 * choice — those messages get their own store and their own /admin/contact
 * inbox instead of being flattened into a lead row.
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

/** A resend of the same message within this window is a double-submit. */
const UE_CONTACT_DUPLICATE_WINDOW = 600; // seconds (10 minutes)

$name    = $field('name');
$email   = $field('email');
$phone   = $field('phone');
$subject = $field('subject');
$message = $field('message');
$source  = $field('source') !== '' ? $field('source') : 'contact-us';

// Minimal server-side validation — the browser enforces the same rules, but
// a POST can arrive from anywhere.
if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name, a valid email and a message are required.']);
    exit;
}
if (mb_strlen($email) > 190 || mb_strlen($name) > 190) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Name or email is too long.']);
    exit;
}

// Trim the free-text fields to what their columns hold, so an oversized paste
// is stored short rather than failing the whole submission on a strict-mode
// server. `message` is TEXT and needs no cap.
$name    = mb_substr($name, 0, 190);
$phone   = mb_substr($phone, 0, 60);
$subject = mb_substr($subject, 0, 255);

try {
    $pdo = ue_db();

    // Duplicate rule: the same sender re-submitting the same subject and
    // message within the window above is a double-submit (double click, a
    // refresh, an impatient second press), not a second enquiry. Return the
    // original row's id and skip the insert, the CRM forward and the
    // confirmation email — the inbox stays clean and nobody gets the same
    // acknowledgement twice.
    //
    // Deliberately keyed on the CONTENT, not just the email address: a second,
    // different question from the same person is a real enquiry and is always
    // stored, however soon it arrives.
    $dupe = $pdo->prepare('SELECT id FROM contact_messages
        WHERE email = :email AND subject = :subject AND message = :message
          AND created_at >= :since
        ORDER BY id DESC LIMIT 1');
    $dupe->execute([
        ':email'   => $email,
        ':subject' => $subject,
        ':message' => $message,
        ':since'   => gmdate('Y-m-d H:i:s', time() - UE_CONTACT_DUPLICATE_WINDOW),
    ]);
    $existingId = $dupe->fetchColumn();
    if ($existingId !== false) {
        echo json_encode(['ok' => true, 'id' => (int) $existingId, 'duplicate' => true]);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO contact_messages
        (created_at, name, email, phone, subject, message, source, ip)
        VALUES
        (:created_at, :name, :email, :phone, :subject, :message, :source, :ip)');

    $stmt->execute([
        ':created_at' => gmdate('Y-m-d H:i:s'),
        ':name'       => $name,
        ':email'      => $email,
        ':phone'      => $phone,
        ':subject'    => $subject,
        ':message'    => $message,
        ':source'     => $source,
        ':ip'         => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $id = (int) $pdo->lastInsertId();

    // Best-effort forward to the same CRM leads endpoint the enquiry form uses,
    // so contact messages land beside the other website enquiries. The message
    // is already safely stored above, so any CRM failure is logged and
    // swallowed — never fail the submission.
    //
    // The subject has no CRM field of its own, so it is prefixed onto the
    // message there (the stored row above keeps the two apart).
    try {
        $crmMessage = $subject !== '' ? $subject . "\n\n" . $message : $message;
        ue_crm_post(ue_env('CRM_ENDPOINT_URL', ''), [
            'name'             => $name,
            'email'            => $email,
            'phone'            => $phone,
            'message'          => $crmMessage,

            'subject'          => $subject,
            'source'           => $source,
            'ip'               => $_SERVER['REMOTE_ADDR'] ?? '',
            'contactMessageId' => $id,
            'submittedAt'      => gmdate('c'),
        ], 'contact.php');
    } catch (Throwable $crmError) {
        error_log('contact.php: CRM forwarding threw: ' . $crmError->getMessage());
    }

    // Best-effort confirmation email to the sender. A mail failure must never
    // fail the request — the message is already safely stored.
    try {
        $firstName = preg_split('/\s+/', $name)[0] ?? $name;
        ue_send_lead_confirmation($email, $firstName);
    } catch (Throwable $mailError) {
        error_log('contact.php: confirmation email failed: ' . $mailError->getMessage());
    }

    echo json_encode(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save your message.']);
}
