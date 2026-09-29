<?php
/**
 * Admin contact-messages feed — JSON API (protected by Bearer token).
 * GET (Authorization: Bearer <token>)  ->  { ok: true, messages: [...] }  or 401.
 * Consumed by the React /admin/contact dashboard.
 */

require __DIR__ . '/_token.php';
ue_api_headers('GET');

if (!ue_verify_token(ue_bearer_token())) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

$rows = ue_db()->query('SELECT * FROM contact_messages ORDER BY id DESC')->fetchAll();

echo json_encode(['ok' => true, 'messages' => $rows]);
