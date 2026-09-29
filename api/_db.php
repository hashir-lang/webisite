<?php
/**
 * Shared database layer for the UeCampus backend (MySQL / MariaDB via PDO).
 *
 * Connection credentials are read from api/.env (kept out of web access by
 * api/.htaccess). The schema is created on demand, so a fresh, empty database
 * becomes fully working on the first request — no manual SQL import required.
 * A standalone MySQL dump also lives in database/uecampus.sql for reference.
 *
 * Tables:
 *   - websiteleads : leads captured by the public Enquire/Apply form.
 *   - contact_messages : messages sent from the public Contact Us form.
 *   - admin_users : credentials for the /api/admin CMS (bcrypt hashes).
 */

/** Default admin login, seeded once on first run. Change it after first login. */
const UE_DEFAULT_ADMIN_USER = 'admin';
const UE_DEFAULT_ADMIN_PASS = 'Uecampus@online';

/** Read a value from api/.env (parsed once, cached). */
function ue_env(string $key, ?string $default = null): ?string
{
    static $env = null;
    if ($env === null) {
        $env = [];
        $file = __DIR__ . '/.env';
        if (is_readable($file)) {
            foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || $line[0] === '#') {
                    continue;
                }
                $pos = strpos($line, '=');
                if ($pos === false) {
                    continue;
                }
                $k = trim(substr($line, 0, $pos));
                $v = trim(substr($line, $pos + 1));
                if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && $v[strlen($v) - 1] === $v[0]) {
                    $v = substr($v, 1, -1);
                }
                $env[$k] = $v;
            }
        }
    }
    return array_key_exists($key, $env) ? $env[$key] : $default;
}

/**
 * POST a JSON payload to a CRM REST endpoint, authenticated with the shared
 * CRM_API_KEY (Bearer). Best-effort by design: missing config, network errors,
 * and non-2xx responses are logged and swallowed so the caller's own request
 * (saving the lead/sign-in locally) is never affected. $context is a short
 * label prefixed onto log lines so failures are easy to trace.
 */
function ue_crm_post(string $url, array $payload, string $context = 'crm'): void
{
    $key = ue_env('CRM_API_KEY', '');
    if ($url === '' || $key === '') {
        error_log("{$context}: CRM forwarding skipped — endpoint URL or CRM_API_KEY not configured.");
        return;
    }

    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $key,
        ],
    ]);

    $response = curl_exec($ch);
    if ($response === false) {
        error_log("{$context}: CRM request failed: " . curl_error($ch));
        curl_close($ch);
        return;
    }

    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($status < 200 || $status >= 300) {
        error_log("{$context}: CRM returned non-2xx status {$status}: " . substr((string) $response, 0, 500));
    }
}

/**
 * Add a column to a table only if it does not already exist (idempotent
 * migration helper, works on MySQL 5.7+/8 which lack ADD COLUMN IF NOT EXISTS).
 */
function ue_ensure_column(PDO $pdo, string $table, string $col, string $ddl): void
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    $stmt->execute([$table, $col]);
    if ((int) $stmt->fetchColumn() === 0) {
        $pdo->exec("ALTER TABLE `{$table}` ADD COLUMN {$ddl}");
    }
}

function ue_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host    = ue_env('DB_HOST', 'localhost');
    $port    = ue_env('DB_PORT', '3306');
    $name    = ue_env('DB_NAME', '');
    $user    = ue_env('DB_USER', '');
    $pass    = ue_env('DB_PASS', '');
    $charset = ue_env('DB_CHARSET', 'utf8mb4');

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset={$charset}";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    // --- Leads captured by the public enquiry form ---------------------------
    $pdo->exec('CREATE TABLE IF NOT EXISTS `websiteleads` (
        `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `created_at`      DATETIME     NOT NULL,
        `first_name`      VARCHAR(120) DEFAULT NULL,
        `last_name`       VARCHAR(120) DEFAULT NULL,
        `email`           VARCHAR(190) DEFAULT NULL,
        `phone`           VARCHAR(60)  DEFAULT NULL,
        `country`         VARCHAR(120) DEFAULT NULL,
        `programme`       VARCHAR(190) DEFAULT NULL,
        `programme_title` VARCHAR(255) DEFAULT NULL,
        `qualification`   VARCHAR(190) DEFAULT NULL,
        `intake`          VARCHAR(120) DEFAULT NULL,
        `message`         TEXT         DEFAULT NULL,
        `consent`         TINYINT(1)   NOT NULL DEFAULT 0,
        `source`          VARCHAR(120) DEFAULT NULL,
        `ip`              VARCHAR(45)  DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `idx_websiteleads_created_at` (`created_at`),
        KEY `idx_websiteleads_email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

    // --- Messages sent from the public Contact Us form -----------------------
    // Kept in its own table rather than in `websiteleads` because the contact
    // form captures a subject and a free-text message but none of the
    // programme/intake fields a lead row is shaped around.
    $pdo->exec('CREATE TABLE IF NOT EXISTS `contact_messages` (
        `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `created_at` DATETIME     NOT NULL,
        `name`       VARCHAR(190) DEFAULT NULL,
        `email`      VARCHAR(190) DEFAULT NULL,
        `phone`      VARCHAR(60)  DEFAULT NULL,
        `subject`    VARCHAR(255) DEFAULT NULL,
        `message`    TEXT         DEFAULT NULL,
        `source`     VARCHAR(120) DEFAULT NULL,
        `ip`         VARCHAR(45)  DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `idx_contact_messages_created_at` (`created_at`),
        KEY `idx_contact_messages_email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

    // --- CMS: per-page copy and SEO overrides --------------------------------
    // One row per page key (e.g. "home", "about", or a path such as
    // "/programmes/mba-x" for pages that only carry SEO overrides). `content`
    // is a sparse JSON object of the fields an admin changed — everything else
    // falls through to the defaults compiled into the React app — and `meta`
    // holds the SEO title/description/keywords overrides. See api/content.php.
    $pdo->exec('CREATE TABLE IF NOT EXISTS `cms_pages` (
        `page_key`   VARCHAR(190) NOT NULL,
        `content`    MEDIUMTEXT   DEFAULT NULL,
        `meta`       TEXT         DEFAULT NULL,
        `updated_at` DATETIME     NOT NULL,
        `updated_by` VARCHAR(80)  DEFAULT NULL,
        PRIMARY KEY (`page_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

    // --- Sign-ins captured by the welcome popup ------------------------------
    // Also drives the automated "updates" mailer: welcome_sent marks the
    // one-off overview email, and drip_index / last_drip_date track the
    // daily one-course-per-day campaign (see api/cron_drip.php).
    $pdo->exec('CREATE TABLE IF NOT EXISTS `signins` (
        `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `created_at`     DATETIME     NOT NULL,
        `name`           VARCHAR(190) DEFAULT NULL,
        `email`          VARCHAR(190) DEFAULT NULL,
        `phone`          VARCHAR(60)  DEFAULT NULL,
        `ip`             VARCHAR(45)  DEFAULT NULL,
        `welcome_sent`   TINYINT(1)   NOT NULL DEFAULT 0,
        `drip_index`     INT UNSIGNED NOT NULL DEFAULT 0,
        `last_drip_date` DATE         DEFAULT NULL,
        `unsubscribed`   TINYINT(1)   NOT NULL DEFAULT 0,
        PRIMARY KEY (`id`),
        KEY `idx_signins_created_at` (`created_at`),
        KEY `idx_signins_email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

    // Migrate older installs that predate the new columns (idempotent).
    ue_ensure_column($pdo, 'signins', 'phone',          '`phone` VARCHAR(60) DEFAULT NULL AFTER `email`');
    ue_ensure_column($pdo, 'signins', 'welcome_sent',   '`welcome_sent` TINYINT(1) NOT NULL DEFAULT 0');
    ue_ensure_column($pdo, 'signins', 'drip_index',     '`drip_index` INT UNSIGNED NOT NULL DEFAULT 0');
    ue_ensure_column($pdo, 'signins', 'last_drip_date', '`last_drip_date` DATE DEFAULT NULL');
    ue_ensure_column($pdo, 'signins', 'unsubscribed',   '`unsubscribed` TINYINT(1) NOT NULL DEFAULT 0');

    // --- Admin CMS credentials ----------------------------------------------
    $pdo->exec('CREATE TABLE IF NOT EXISTS `admin_users` (
        `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `username`      VARCHAR(80)  NOT NULL,
        `password_hash` VARCHAR(255) NOT NULL,
        `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `uq_admin_users_username` (`username`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

    // Seed the default admin exactly once (empty table => fresh install).
    $hasUser = (int) $pdo->query('SELECT COUNT(*) FROM `admin_users`')->fetchColumn();
    if ($hasUser === 0) {
        $stmt = $pdo->prepare(
            'INSERT INTO `admin_users` (`username`, `password_hash`, `created_at`) VALUES (?, ?, ?)'
        );
        $stmt->execute([
            UE_DEFAULT_ADMIN_USER,
            password_hash(UE_DEFAULT_ADMIN_PASS, PASSWORD_DEFAULT),
            gmdate('Y-m-d H:i:s'),
        ]);
    }

    return $pdo;
}
