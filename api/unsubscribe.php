<?php
/**
 * One-click unsubscribe for the automated "UeCampus updates" emails.
 * Linked from every drip email footer:
 *   /api/unsubscribe.php?e=<email>&t=<hmac(email, APP_SECRET)>
 * Verifies the signature, marks the subscriber unsubscribed, and shows a
 * simple confirmation page. No login required (the HMAC is the credential).
 */

require __DIR__ . '/_db.php';
require __DIR__ . '/courses_email.php'; // ue_site_base()

header('Content-Type: text/html; charset=utf-8');

$email = isset($_GET['e']) ? trim((string) $_GET['e']) : '';
$token = isset($_GET['t']) ? trim((string) $_GET['t']) : '';
$expected = hash_hmac('sha256', strtolower($email), (string) ue_env('APP_SECRET', 'ue'));

$ok = $email !== '' && $token !== '' && hash_equals($expected, $token);

if ($ok) {
    try {
        $stmt = ue_db()->prepare('UPDATE signins SET unsubscribed = 1 WHERE email = :email');
        $stmt->execute([':email' => $email]);
    } catch (Throwable $e) {
        error_log('unsubscribe.php: ' . $e->getMessage());
        $ok = false;
    }
}

$msg = $ok
    ? "You've been unsubscribed. You won't receive any more UeCampus update emails."
    : "We couldn't process this unsubscribe link. Please contact us and we'll remove you right away.";

$safe = htmlspecialchars($msg, ENT_QUOTES, 'UTF-8');
echo '<!DOCTYPE html><html><head><meta charset="UTF-8">'
   . '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
   . '<title>Unsubscribe · UeCampus</title></head>'
   . '<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f3f0f9;">'
   . '<div style="max-width:480px;margin:60px auto;background:#fff;border:1px solid #e6ddf3;border-radius:12px;overflow:hidden;">'
   . '<div style="background:#551f84;padding:24px 32px;color:#fff;font-size:20px;font-weight:bold;">UECampus</div>'
   . '<div style="padding:32px;color:#334155;font-size:15px;line-height:1.6;">' . $safe
   . '<p style="margin:24px 0 0;"><a href="' . ue_site_base() . '" style="color:#551f84;font-weight:bold;">Return to uecampus.com →</a></p>'
   . '</div></div></body></html>';
