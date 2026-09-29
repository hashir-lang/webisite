-- ============================================================================
--  UeCampus — website database schema  (MySQL / MariaDB)
--  Target database: uecaltyc_crm
-- ============================================================================
--  This database is SHARED with the CRM, which already owns an `enquiry`
--  table. To avoid any collision, the website's lead capture table is named
--  `websiteleads`. Importing this file only creates the website's own tables
--  and never touches the CRM's existing `enquiry` data.
--
--  cPanel / phpMyAdmin:
--    1. Open phpMyAdmin  ›  select the `uecaltyc_crm` database  ›  Import  ›
--       choose this file  ›  Go.
--    2. The website DB user (uecaltyc_crm) must have ALL PRIVILEGES on it.
--
--  Command line (self-hosted):
--    mysql -u root -p uecaltyc_crm < database/uecaltyc_crm.sql
--
--  Engine: InnoDB · Charset: utf8mb4 (full Unicode incl. emoji)
--  Note: every statement is idempotent (CREATE TABLE IF NOT EXISTS), so it is
--  safe to re-import without dropping the CRM's tables.
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
--  Table: websiteleads
--  Leads captured by the React "Apply / Enquire now" form (api/submit.php).
--  Named `websiteleads` so it never collides with the CRM's own `enquiry`
--  table that already lives in this database.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `websiteleads` (
  `id`              INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `created_at`      DATETIME       NOT NULL,                  -- stored in UTC
  `first_name`      VARCHAR(120)            DEFAULT NULL,
  `last_name`       VARCHAR(120)            DEFAULT NULL,
  `email`           VARCHAR(190)            DEFAULT NULL,
  `phone`           VARCHAR(60)             DEFAULT NULL,
  `country`         VARCHAR(120)            DEFAULT NULL,
  `programme`       VARCHAR(190)            DEFAULT NULL,      -- course slug
  `programme_title` VARCHAR(255)            DEFAULT NULL,
  `qualification`   VARCHAR(190)            DEFAULT NULL,
  `intake`          VARCHAR(120)            DEFAULT NULL,
  `message`         TEXT                    DEFAULT NULL,
  `consent`         TINYINT(1)     NOT NULL DEFAULT 0,
  `source`          VARCHAR(120)            DEFAULT NULL,      -- e.g. enquire-now
  `ip`              VARCHAR(45)             DEFAULT NULL,      -- IPv4 or IPv6
  PRIMARY KEY (`id`),
  KEY `idx_websiteleads_created_at` (`created_at`),
  KEY `idx_websiteleads_email`      (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  Table: signins
--  Name + email captured by the React welcome popup (api/signin.php), so the
--  team can follow up with visitors. Viewed at /admin/signins.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `signins` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME      NOT NULL,                  -- stored in UTC
  `name`       VARCHAR(190)           DEFAULT NULL,
  `email`      VARCHAR(190)           DEFAULT NULL,
  `ip`         VARCHAR(45)            DEFAULT NULL,      -- IPv4 or IPv6
  PRIMARY KEY (`id`),
  KEY `idx_signins_created_at` (`created_at`),
  KEY `idx_signins_email`      (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  Table: admin_users
--  Credentials for the /admin enquiry CMS (admin/login.php).
--  Passwords are NEVER stored in plain text — only a hash is kept.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(80)   NOT NULL,
  `password_hash` VARCHAR(255)  NOT NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  Seed: default admin login
-- ----------------------------------------------------------------------------
--    Username:  admin
--    Password:  Uecampus@online        <-- the plaintext, for your reference
--
--  The password_hash below is a real bcrypt hash produced by PHP
--  password_hash('Uecampus@online', PASSWORD_DEFAULT), so the backend's
--  password_verify() accepts it at login (api/admin/_token.php).
--
--  This statement is idempotent and self-repairing:
--    • if no admin row exists, it is created;
--    • if an admin row already exists, the hash is reset to 'Uecampus@online'.
--  Re-import this file any time login is failing to restore known credentials.
-- ----------------------------------------------------------------------------
INSERT INTO `admin_users` (`username`, `password_hash`, `created_at`)
VALUES ('admin', '$2y$10$KVVIGJcSh9vhyUBUySIzkOq0w.dk0ZeGQaGpD6wKT7NDZi8zvCBye', UTC_TIMESTAMP())
ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
--  End of schema
-- ============================================================================
