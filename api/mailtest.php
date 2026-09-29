<?php
/**
 * Mail diagnostic — verifies which mailer functions are deployed and sends the
 * real welcome/overview + first course email so you can see exactly what the
 * popup produces.
 *
 * CLI:     php api/mailtest.php you@example.com
 * Browser: https://yourdomain.com/api/mailtest.php?to=you@example.com&key=EMAIL_SERVICE_KEY
 *
 * DELETE this file once mail is confirmed working — it is a debug tool.
 */

require __DIR__ . '/_mail.php';

$isCli = PHP_SAPI === 'cli';

if ($isCli) {
    $to = $argv[1] ?? '';
} else {
    header('Content-Type: text/plain; charset=utf-8');
    if (($_GET['key'] ?? '') !== ue_env('EMAIL_SERVICE_KEY', '')) {
        http_response_code(403);
        echo "Forbidden: pass ?key=EMAIL_SERVICE_KEY\n";
        exit;
    }
    $to = $_GET['to'] ?? '';
}

// --- Which mailer functions are actually deployed? -------------------------
echo "Deployed mailer functions:\n";
foreach (['ue_send_lead_confirmation', 'ue_send_welcome_overview', 'ue_send_course_email', 'ue_drip_courses'] as $fn) {
    echo '  ' . ($fn === 'ue_drip_courses' ? '(data) ' : '(mail) ') . $fn . ': '
        . (function_exists($fn) ? 'AVAILABLE' : '*** MISSING — upload the latest api/_mail.php + api/courses_email.php ***') . "\n";
}
echo "\n";

$overviewOk = function_exists('ue_send_welcome_overview');
if (!$overviewOk) {
    echo "RESULT: Your server is running an OUTDATED api/_mail.php.\n";
    echo "Upload the current api/_mail.php and api/courses_email.php, then reload this page.\n";
    exit;
}

if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
    echo "Functions are up to date. Now add a recipient to send a live sample:\n";
    echo $isCli ? "  php api/mailtest.php you@gmail.com\n" : "  ?to=you@gmail.com&key=...\n";
    exit;
}

echo "SMTP: HOST=" . ue_env('SMTP_HOST', '(none)') . " PORT=" . ue_env('SMTP_PORT', '(none)')
   . " USER=" . ue_env('SMTP_USER', '(none)') . " ENC=" . ue_env('SMTP_ENCRYPTION', '(none)') . "\n\n";

echo "Sending WELCOME/OVERVIEW email to {$to} ...\n";
$w = ue_send_welcome_overview($to, 'Hashir');
echo '  welcome_overview: ' . ($w ? 'SUCCESS' : 'FAILED') . "\n";

$courses = ue_drip_courses();
if ($courses) {
    echo "Sending first COURSE-OF-THE-DAY email to {$to} ...\n";
    $c = ue_send_course_email($to, 'Hashir', $courses[0], 1);
    echo '  course_email: ' . ($c ? 'SUCCESS' : 'FAILED') . "\n";
}

$log = ue_mail_log();
if ($log) {
    echo "\nDiagnostics:\n";
    foreach ($log as $line) {
        echo '  - ' . $line . "\n";
    }
}
echo "\nCheck the inbox (and spam) for the two emails above.\n";
