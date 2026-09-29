<?php
/**
 * "Course spotlight" mailer. Sends each active subscriber the next programme
 * email in the ue_drip_courses() sequence, at most once every OTHER day (a
 * 2-day gap per subscriber), then advances their position. Designed to be
 * triggered once a day by a cron job — the 2-day spacing is enforced in SQL,
 * so a daily cron naturally produces every-other-day emails per person.
 *
 * Cron (cPanel, run once daily):
 *   /usr/bin/php /home/USER/public_html/api/cron_drip.php EMAIL_SERVICE_KEY
 * or via HTTP (e.g. a cron/uptime pinger):
 *   https://uecampus.com/api/cron_drip.php?key=EMAIL_SERVICE_KEY
 *
 * Safe to run more than once a day — anyone emailed within the last 2 days is skipped.
 */

require __DIR__ . '/_db.php';
require __DIR__ . '/_mail.php';

$isCli = PHP_SAPI === 'cli';
$providedKey = $isCli ? ($argv[1] ?? '') : ($_GET['key'] ?? ($_SERVER['HTTP_X_SERVICE_KEY'] ?? ''));
$expectedKey = (string) ue_env('EMAIL_SERVICE_KEY', '');

if ($expectedKey === '' || !hash_equals($expectedKey, (string) $providedKey)) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'Forbidden']);
    exit;
}

if (!$isCli) {
    header('Content-Type: application/json; charset=utf-8');
}

$courses = ue_drip_courses();
$total   = count($courses);

$pdo = ue_db();
// Everyone due for their next email today (cap the batch to stay well within
// PHP time limits; a second run the same day picks up any remainder).
$batch = 400;
$rows = $pdo->prepare(
    'SELECT id, name, email, drip_index
       FROM signins
      WHERE unsubscribed = 0
        AND email IS NOT NULL AND email <> \'\'
        AND drip_index < :total
        AND (last_drip_date IS NULL OR last_drip_date <= DATE_SUB(CURDATE(), INTERVAL 2 DAY))
      ORDER BY id ASC
      LIMIT ' . (int) $batch
);
$rows->execute([':total' => $total]);
$subs = $rows->fetchAll();

$advance = $pdo->prepare(
    'UPDATE signins SET drip_index = :next, last_drip_date = CURDATE() WHERE id = :id'
);

$sent = 0;
$failed = 0;
foreach ($subs as $s) {
    $idx = (int) $s['drip_index'];
    if ($idx < 0 || $idx >= $total) {
        continue;
    }
    $ok = false;
    try {
        $ok = ue_send_course_email($s['email'], (string) $s['name'], $courses[$idx], $idx + 1);
    } catch (Throwable $e) {
        error_log('cron_drip.php: send failed for ' . $s['email'] . ': ' . $e->getMessage());
    }
    if ($ok) {
        // Only advance on a successful send, so a transient failure retries tomorrow.
        $advance->execute([':next' => $idx + 1, ':id' => $s['id']]);
        $sent++;
    } else {
        $failed++;
    }
}

$remaining = (int) $pdo->query(
    'SELECT COUNT(*) FROM signins WHERE unsubscribed = 0 AND drip_index < ' . (int) $total
)->fetchColumn();

echo json_encode([
    'ok'            => true,
    'courses'       => $total,
    'due_today'     => count($subs),
    'sent'          => $sent,
    'failed'        => $failed,
    'still_in_drip' => $remaining,
], JSON_PRETTY_PRINT), "\n";
