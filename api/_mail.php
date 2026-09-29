<?php
/**
 * Tiny, dependency-free SMTP mailer for the UeCampus backend.
 *
 * Speaks SMTP directly over a socket so it works on shared/cPanel hosting
 * without Composer, PHPMailer, or the local `mail()` binary. Credentials are
 * read from api/.env via ue_env() (see _db.php):
 *
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
 *   SMTP_FROM_EMAIL, SMTP_FROM_NAME, SMTP_ENCRYPTION (ssl | tls | none)
 *
 * Port 465 => implicit SSL (SMTP_ENCRYPTION=ssl).
 * Port 587 => STARTTLS      (SMTP_ENCRYPTION=tls).
 *
 * Usage:
 *   require __DIR__ . '/_mail.php';
 *   ue_send_mail('lead@example.com', 'Jane Doe', 'Subject', '<p>HTML</p>');
 *
 * Returns true on success, false on failure. Failures are logged with
 * error_log() and never throw, so the caller (e.g. submit.php) can treat mail
 * as best-effort and still save the lead.
 */

require_once __DIR__ . '/_db.php';           // for ue_env()
require_once __DIR__ . '/courses_email.php'; // for ue_site_base() + ue_drip_courses()

/**
 * Record + return the last mailer diagnostics. ue_send_mail() pushes every
 * failure reason here (in addition to error_log) so a test harness can show
 * the user exactly what went wrong. Call ue_mail_log() with no args to read.
 */
function ue_mail_log(?string $message = null): array
{
    static $log = [];
    if ($message !== null) {
        $log[] = $message;
        error_log('ue_send_mail: ' . $message);
    }
    return $log;
}

/**
 * Send an HTML email (with an auto-generated plain-text fallback).
 *
 * Tries authenticated SMTP first (the SMTP_* settings). If that cannot deliver
 * — wrong mailbox password, mailbox hosted elsewhere, port blocked — it falls
 * back to the web server's own mail transport (PHP mail() -> Exim on cPanel),
 * which needs no credentials and is what the domain's SPF record authorises
 * with "+a". Either path succeeding counts as sent; both failing is logged.
 * Set SMTP_FALLBACK_LOCAL=false in api/.env to disable the fallback.
 *
 * @param string      $toEmail  Recipient address.
 * @param string      $toName   Recipient display name (may be empty).
 * @param string      $subject  Subject line.
 * @param string      $htmlBody Full HTML body.
 * @param string|null $textBody Optional plain-text body; derived from HTML if null.
 */
function ue_send_mail(string $toEmail, string $toName, string $subject, string $htmlBody, ?string $textBody = null): bool
{
    if (ue_send_mail_smtp($toEmail, $toName, $subject, $htmlBody, $textBody)) {
        return true;
    }

    $fallback = strtolower((string) ue_env('SMTP_FALLBACK_LOCAL', 'true'));
    if ($fallback === 'false' || $fallback === '0' || $fallback === 'off') {
        return false;
    }

    ue_mail_log('SMTP failed; trying the local mail transport (PHP mail()).');
    return ue_send_mail_local($toEmail, $toName, $subject, $htmlBody, $textBody);
}

/**
 * Deliver through the server's own transport via PHP mail() — on cPanel that
 * is Exim, running as this account, no SMTP login involved. Same envelope,
 * From and MIME structure as the SMTP path, so the recipient sees no
 * difference. Returns false (and logs) where mail() is unavailable or the
 * transport declines the message.
 */
function ue_send_mail_local(string $toEmail, string $toName, string $subject, string $htmlBody, ?string $textBody = null): bool
{
    if (!function_exists('mail')) {
        ue_mail_log('local transport unavailable: mail() is disabled on this PHP.');
        return false;
    }

    $user      = (string) ue_env('SMTP_USER', '');
    $fromEmail = (string) ue_env('SMTP_FROM_EMAIL', $user);
    $fromName  = (string) ue_env('SMTP_FROM_NAME', 'UECampus');
    if ($fromEmail === '' || !filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
        ue_mail_log('local transport: missing From address or invalid recipient.');
        return false;
    }

    if ($textBody === null) {
        $textBody = trim(html_entity_decode(strip_tags(
            preg_replace('/<(br|\/p|\/div|\/tr|\/h[1-6])\s*\/?>/i', "\n", $htmlBody)
        ), ENT_QUOTES, 'UTF-8'));
    }

    $encodeHeader = static function (string $text): string {
        return preg_match('/[^\x20-\x7E]/', $text)
            ? '=?UTF-8?B?' . base64_encode($text) . '?='
            : $text;
    };
    $fromHeader = $fromName !== '' ? $encodeHeader($fromName) . ' <' . $fromEmail . '>' : $fromEmail;
    $toHeader   = $toName !== ''   ? $encodeHeader($toName)   . ' <' . $toEmail . '>'   : $toEmail;

    $boundary = 'ue_' . bin2hex(random_bytes(8));
    $headers  = implode("\r\n", [
        'From: ' . $fromHeader,
        'Reply-To: ' . $fromHeader,
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ]);

    $body  = '--' . $boundary . "\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($textBody)) . "\r\n";
    $body .= '--' . $boundary . "\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";
    $body .= '--' . $boundary . "--\r\n";

    // "-f" sets the envelope sender so bounces and SPF line up with From.
    $ok = @mail($toHeader, $encodeHeader($subject), $body, $headers, '-f' . $fromEmail);
    if (!$ok) {
        $err = error_get_last();
        ue_mail_log('local transport declined the message' . ($err ? ': ' . $err['message'] : '.'));
    }
    return $ok;
}

/**
 * The authenticated-SMTP transport behind ue_send_mail(). Speaks SMTP directly
 * over a socket (implicit SSL on 465, STARTTLS on 587) so it works on shared
 * hosting without Composer or PHPMailer.
 */
function ue_send_mail_smtp(string $toEmail, string $toName, string $subject, string $htmlBody, ?string $textBody = null): bool
{
    $host       = (string) ue_env('SMTP_HOST', '');
    $port       = (int) ue_env('SMTP_PORT', '465');
    $user       = (string) ue_env('SMTP_USER', '');
    $pass       = (string) ue_env('SMTP_PASS', '');
    $fromEmail  = (string) ue_env('SMTP_FROM_EMAIL', $user);
    $fromName   = (string) ue_env('SMTP_FROM_NAME', 'UECampus');
    $encryption = strtolower((string) ue_env('SMTP_ENCRYPTION', 'ssl'));
    $tlsName    = trim((string) ue_env('SMTP_TLS_SERVERNAME', ''));

    if ($host === '' || $fromEmail === '' || !filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
        ue_mail_log('missing SMTP config or invalid recipient.');
        return false;
    }

    if ($textBody === null) {
        // Crude but adequate HTML -> text fallback.
        $textBody = trim(html_entity_decode(strip_tags(
            preg_replace('/<(br|\/p|\/div|\/tr|\/h[1-6])\s*\/?>/i', "\n", $htmlBody)
        ), ENT_QUOTES, 'UTF-8'));
    }

    $transport = $encryption === 'ssl' ? "ssl://{$host}" : $host;

    // Certificate checking. Shared hosts usually present a certificate for the
    // machine's own name (e.g. business28-3.web-hosting.com) rather than for
    // mail.uecampus.com, which strict verification rejects outright. When
    // SMTP_TLS_SERVERNAME names that machine, verify the certificate properly
    // against it. If that handshake fails (name changed after a server move,
    // no CA bundle on the host), fall back to the unverified connection and
    // log it, so a certificate detail never stops a lead's confirmation email.
    $contexts = [];
    if ($tlsName !== '') {
        $contexts['verified'] = [
            'verify_peer'      => true,
            'verify_peer_name' => true,
            'peer_name'        => $tlsName,
        ];
    }
    $contexts['unverified'] = [
        'verify_peer'       => false,
        'verify_peer_name'  => false,
        'allow_self_signed' => true,
    ];

    $fp = false;
    foreach ($contexts as $mode => $ssl) {
        $errno  = 0;
        $errstr = '';
        $fp = @stream_socket_client(
            "{$transport}:{$port}",
            $errno,
            $errstr,
            20,
            STREAM_CLIENT_CONNECT,
            stream_context_create(['ssl' => $ssl])
        );
        if ($fp) {
            break;
        }
        ue_mail_log("connection to {$transport}:{$port} failed in {$mode} mode ({$errno} {$errstr}).");
    }

    if (!$fp) {
        return false;
    }

    stream_set_timeout($fp, 20);

    // --- Small SMTP conversation helpers -----------------------------------
    $read = function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            // Multiline replies look like "250-...", the final line "250 ...".
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        return $data;
    };

    $write = function (string $cmd) use ($fp): void {
        fwrite($fp, $cmd . "\r\n");
    };

    // Returns true when the reply code is one of the accepted codes.
    $expect = function (string $reply, array $codes) use ($host): bool {
        $code = (int) substr($reply, 0, 3);
        if (!in_array($code, $codes, true)) {
            ue_mail_log("unexpected SMTP reply from {$host} (wanted " . implode('/', $codes) . '): ' . trim($reply));
            return false;
        }
        return true;
    };

    $ehloName = $_SERVER['SERVER_NAME'] ?? ($_SERVER['HTTP_HOST'] ?? 'localhost');

    try {
        if (!$expect($read(), [220])) { return false; }

        $write('EHLO ' . $ehloName);
        if (!$expect($read(), [250])) { return false; }

        // STARTTLS upgrade for port 587 / SMTP_ENCRYPTION=tls.
        if ($encryption === 'tls') {
            $write('STARTTLS');
            if (!$expect($read(), [220])) { return false; }
            if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                ue_mail_log('STARTTLS negotiation failed.');
                return false;
            }
            $write('EHLO ' . $ehloName);
            if (!$expect($read(), [250])) { return false; }
        }

        // AUTH LOGIN (username/password base64-encoded).
        if ($user !== '') {
            $write('AUTH LOGIN');
            if (!$expect($read(), [334])) { return false; }
            $write(base64_encode($user));
            if (!$expect($read(), [334])) { return false; }
            $write(base64_encode($pass));
            if (!$expect($read(), [235])) { return false; }
        }

        $write('MAIL FROM:<' . $fromEmail . '>');
        if (!$expect($read(), [250])) { return false; }

        $write('RCPT TO:<' . $toEmail . '>');
        if (!$expect($read(), [250, 251])) { return false; }

        $write('DATA');
        if (!$expect($read(), [354])) { return false; }

        $boundary = 'ue_' . bin2hex(random_bytes(8));
        $encodeHeader = function (string $text): string {
            // RFC 2047 encode non-ASCII display names / subjects.
            return preg_match('/[^\x20-\x7E]/', $text)
                ? '=?UTF-8?B?' . base64_encode($text) . '?='
                : $text;
        };

        $fromHeader = $fromName !== ''
            ? $encodeHeader($fromName) . ' <' . $fromEmail . '>'
            : $fromEmail;
        $toHeader = $toName !== ''
            ? $encodeHeader($toName) . ' <' . $toEmail . '>'
            : $toEmail;

        $headers = [
            'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            'From: ' . $fromHeader,
            'To: ' . $toHeader,
            'Reply-To: ' . $fromHeader,
            'Subject: ' . $encodeHeader($subject),
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        ];

        $body  = '--' . $boundary . "\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($textBody)) . "\r\n";
        $body .= '--' . $boundary . "\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";
        $body .= '--' . $boundary . "--\r\n";

        // Dot-stuffing: any line starting with "." must be doubled.
        $message = implode("\r\n", $headers) . "\r\n\r\n" . $body;
        $message = preg_replace('/^\./m', '..', $message);

        fwrite($fp, $message . "\r\n.\r\n");
        if (!$expect($read(), [250])) { return false; }

        $write('QUIT');
        $read();

        return true;
    } finally {
        fclose($fp);
    }
}

/**
 * Build and send the "we received your enquiry" confirmation to a lead.
 * Best-effort: returns false (and logs) on any failure without throwing.
 */
function ue_send_lead_confirmation(string $toEmail, string $firstName, string $programmeTitle = ''): bool
{
    $name  = trim($firstName);
    $hello = $name !== '' ? 'Hi ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ',' : 'Hello,';

    $programmeLine = '';
    if (trim($programmeTitle) !== '') {
        $programmeLine = '<p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">'
            . 'Your enquiry about <strong style="color:#551f84;">' . htmlspecialchars($programmeTitle, ENT_QUOTES, 'UTF-8')
            . '</strong> has been recorded.</p>';
    }

    $subject = 'We\'ve received your enquiry, UECampus';

    $html = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'
        . '<body style="margin:0;padding:0;background:#f3f0f9;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f0f9;padding:24px 0;">'
        . '<tr><td align="center">'
        . '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6ddf3;">'
        // Purple header with the UECampus logo on a white chip (the logo is
        // purple-on-transparent, so it needs a light backing to stay legible).
        . '<tr><td align="center" style="background:#551f84;padding:30px 32px;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0"><tr>'
        . '<td style="background:#ffffff;border-radius:10px;padding:12px 22px;">'
        . '<img src="https://uecampus.com/uecampus-logo.png" alt="UECampus" width="170" '
        . 'style="display:block;width:170px;max-width:170px;height:auto;border:0;" /></td>'
        . '</tr></table></td></tr>'
        // Thin purple accent under the header.
        . '<tr><td style="height:4px;background:#7c3a97;line-height:4px;font-size:0;">&nbsp;</td></tr>'
        . '<tr><td style="padding:32px;">'
        . '<p style="margin:0 0 16px;color:#551f84;font-size:17px;font-weight:bold;">' . $hello . '</p>'
        . '<p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">'
        . 'Thank you for getting in touch with UECampus. We\'ve successfully received your form submission.</p>'
        . $programmeLine
        . '<p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;">'
        . 'One of our admissions advisors will review your details and '
        . '<strong style="color:#551f84;">contact you within 48 hours</strong>. '
        . 'There\'s nothing more you need to do right now.</p>'
        . '<p style="margin:0 0 8px;color:#334155;font-size:15px;line-height:1.6;">Warm regards,</p>'
        . '<p style="margin:0;color:#551f84;font-size:15px;font-weight:bold;">The UECampus Admissions Team</p>'
        . '</td></tr>'
        . '<tr><td style="padding:20px 32px;background:#f6f2fb;border-top:1px solid #e6ddf3;">'
        . '<p style="margin:0;color:#8b7ba6;font-size:12px;line-height:1.5;">'
        . 'This is an automated confirmation of your enquiry. Please do not reply to this message.</p>'
        . '</td></tr>'
        . '</table></td></tr></table></body></html>';

    return ue_send_mail($toEmail, $name, $subject, $html);
}

// ===========================================================================
//  Branded "UeCampus updates" emails (welcome overview + daily course drip)
// ===========================================================================

/** Signed unsubscribe URL for a subscriber (HMAC over the email + APP_SECRET). */
function ue_unsubscribe_url(string $email): string
{
    $sig = hash_hmac('sha256', strtolower($email), (string) ue_env('APP_SECRET', 'ue'));
    return ue_site_base() . '/api/unsubscribe.php?e=' . rawurlencode($email) . '&t=' . $sig;
}

/** Wrap inner HTML in the shared purple + logo UeCampus email shell. */
function ue_email_shell(string $innerHtml, string $unsubEmail = ''): string
{
    $footer = 'You’re receiving this because you asked for the latest updates from UeCampus.';
    if ($unsubEmail !== '') {
        $footer .= ' <a href="' . htmlspecialchars(ue_unsubscribe_url($unsubEmail), ENT_QUOTES, 'UTF-8')
            . '" style="color:#8b7ba6;text-decoration:underline;">Unsubscribe</a>.';
    }
    return '<!DOCTYPE html><html><head><meta charset="UTF-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'
        . '<body style="margin:0;padding:0;background:#f3f0f9;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f0f9;padding:24px 0;">'
        . '<tr><td align="center">'
        . '<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6ddf3;">'
        . '<tr><td align="center" style="background:#551f84;padding:30px 32px;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0"><tr>'
        . '<td style="background:#ffffff;border-radius:10px;padding:12px 22px;">'
        . '<img src="' . ue_site_base() . '/uecampus-logo.png" alt="UECampus" width="170" '
        . 'style="display:block;width:170px;max-width:170px;height:auto;border:0;" /></td>'
        . '</tr></table></td></tr>'
        . '<tr><td style="height:4px;background:#7c3a97;line-height:4px;font-size:0;">&nbsp;</td></tr>'
        . '<tr><td style="padding:32px;">' . $innerHtml . '</td></tr>'
        . '<tr><td style="padding:20px 32px;background:#f6f2fb;border-top:1px solid #e6ddf3;">'
        . '<p style="margin:0;color:#8b7ba6;font-size:12px;line-height:1.5;">' . $footer . '</p>'
        . '</td></tr>'
        . '</table></td></tr></table></body></html>';
}

/**
 * One-off welcome/overview email sent the moment someone signs up for updates:
 * a brief on what UeCampus offers, programmes, fees, payment plans, scholarships.
 */
function ue_send_welcome_overview(string $toEmail, string $name): bool
{
    $name  = trim($name);
    $hello = $name !== '' ? 'Hi ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ',' : 'Hello,';
    $base  = ue_site_base();

    $row = function (string $heading, string $body): string {
        return '<tr><td style="padding:14px 0;border-bottom:1px solid #eee6f6;">'
            . '<p style="margin:0 0 4px;color:#551f84;font-size:14px;font-weight:bold;">' . $heading . '</p>'
            . '<p style="margin:0;color:#334155;font-size:14px;line-height:1.6;">' . $body . '</p></td></tr>';
    };

    $inner = '<p style="margin:0 0 16px;color:#551f84;font-size:18px;font-weight:bold;">' . $hello . '</p>'
        . '<p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6;">'
        . 'Welcome to UeCampus! Here’s a quick overview of everything we offer. Every other day we’ll send you '
        . 'a short note about a different programme. Here’s the big picture to get you started.</p>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
        . $row('Globally recognised programmes',
            'Ofqual-regulated UK Qualifi diplomas (Levels 2 to 7) and fully online US degrees from Forbes-ranked Walsh College, '
            . 'across Business, Cyber Security, AI, IT, Data Analytics, Finance and more.')
        . $row('Bachelor’s, Master’s &amp; Doctorate',
            'Fast-track dual-award pathways (Bachelor’s in 2 years, Master’s in 1 year) or direct US degrees, plus the #1 Forbes-ranked online DBA.')
        . $row('Flexible fees &amp; payment plans',
            'Transparent tuition with flexible options: pay in full, or spread the cost with annual, semi-annual, quarterly or monthly instalments.')
        . $row('Scholarships',
            'Merit and access scholarships can significantly reduce your tuition. Ask our admissions team what you may qualify for.')
        . '</table>'
        . '<p style="margin:24px 0 0;"><a href="' . $base . '/programmes" '
        . 'style="display:inline-block;background:#551f84;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:13px 26px;border-radius:8px;">Explore all programmes →</a></p>'
        . '<p style="margin:20px 0 0;color:#334155;font-size:14px;line-height:1.6;">'
        . 'Want tailored guidance, a fee breakdown or scholarship advice? Just reply to this email or '
        . '<a href="' . $base . '/contact-us" style="color:#551f84;">talk to admissions</a>.</p>';

    return ue_send_mail($toEmail, $name, 'Welcome to UeCampus: your quick guide to programmes, fees and scholarships',
        ue_email_shell($inner, $toEmail));
}

/**
 * A single daily "course of the day" email built from a ue_drip_courses() entry.
 * @param array{slug:string,title:string,level:string,duration:string,blurb:string} $course
 */
function ue_send_course_email(string $toEmail, string $name, array $course, int $dayNumber): bool
{
    $name  = trim($name);
    $hello = $name !== '' ? 'Hi ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ',' : 'Hello,';
    $base  = ue_site_base();
    $url   = $base . '/programmes/' . rawurlencode($course['slug']);
    $t     = fn (string $s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');

    // Optional richer fields (detail paragraph + highlight bullets).
    $detail = isset($course['detail']) ? $t($course['detail']) : '';
    $highlights = '';
    if (!empty($course['highlights']) && is_array($course['highlights'])) {
        $items = '';
        foreach ($course['highlights'] as $h) {
            $items .= '<tr><td style="vertical-align:top;padding:4px 8px 4px 0;color:#551f84;font-weight:bold;">✓</td>'
                . '<td style="padding:4px 0;color:#334155;font-size:14px;line-height:1.5;">' . $t($h) . '</td></tr>';
        }
        $highlights = '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">' . $items . '</table>';
    }

    $inner = '<p style="margin:0 0 6px;color:#8b7ba6;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Programme spotlight #' . $dayNumber . '</p>'
        . '<p style="margin:0 0 16px;color:#551f84;font-size:16px;font-weight:bold;">' . $hello . '</p>'
        . '<div style="border:1px solid #e6ddf3;border-radius:10px;padding:22px;background:#faf8fd;">'
        . '<p style="margin:0 0 6px;color:#8b7ba6;font-size:12px;font-weight:bold;">' . $t($course['level']) . '</p>'
        . '<p style="margin:0 0 12px;color:#0f172a;font-size:20px;font-weight:bold;line-height:1.25;">' . $t($course['title']) . '</p>'
        . ($detail !== '' ? '<p style="margin:0 0 14px;color:#334155;font-size:14px;line-height:1.6;">' . $detail . '</p>' : '')
        . $highlights
        . '<p style="margin:0 0 18px;color:#551f84;font-size:13px;font-weight:bold;">Duration: ' . $t($course['duration']) . '</p>'
        . '<a href="' . $url . '" style="display:inline-block;background:#551f84;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 24px;border-radius:8px;">View programme →</a>'
        . '</div>'
        . '<p style="margin:20px 0 0;color:#334155;font-size:14px;line-height:1.6;">'
        . 'We’ll share another programme in a couple of days. In the meantime, our admissions team is happy to help with '
        . 'fees, scholarships or your best-fit pathway. Just reply to this email.</p>';

    return ue_send_mail($toEmail, $name, $course['title'] . ': a closer look from UeCampus',
        ue_email_shell($inner, $toEmail));
}
