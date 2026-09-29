-- ============================================================================
--  UeCampus — database schema  (MySQL / MariaDB)
-- ============================================================================
--  Import this file into the production database on uecampus.com.
--
--  cPanel / phpMyAdmin:
--    1. Create a database + DB user in cPanel  ›  MySQL Databases
--       and grant the user ALL PRIVILEGES on that database.
--    2. Open phpMyAdmin  ›  select the new database  ›  Import  ›  choose
--       this file  ›  Go.   (Do NOT run the CREATE DATABASE block below on
--       shared hosting — cPanel already created the prefixed database.)
--
--  Command line (self-hosted):
--    mysql -u root -p < database/uecampus.sql
--
--  Engine: InnoDB · Charset: utf8mb4 (full Unicode incl. emoji)
-- ============================================================================

-- --- Self-hosted only: create and select the database -----------------------
-- Uncomment these two lines when you control the MySQL server directly.
-- On cPanel/shared hosting leave them commented (the panel makes the DB).
--
-- CREATE DATABASE IF NOT EXISTS `uecampus`
--   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `uecampus`;

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
--  Table: contact_messages
--  Messages sent from the React "Contact Us" form (api/contact.php). Kept
--  apart from `websiteleads` because this form captures a subject and a
--  free-text message, not a programme choice. Viewed at /admin/contact.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME      NOT NULL,                  -- stored in UTC
  `name`       VARCHAR(190)           DEFAULT NULL,
  `email`      VARCHAR(190)           DEFAULT NULL,
  `phone`      VARCHAR(60)            DEFAULT NULL,
  `subject`    VARCHAR(255)           DEFAULT NULL,
  `message`    TEXT                   DEFAULT NULL,
  `source`     VARCHAR(120)           DEFAULT NULL,      -- always 'contact-us'
  `ip`         VARCHAR(45)            DEFAULT NULL,      -- IPv4 or IPv6
  PRIMARY KEY (`id`),
  KEY `idx_contact_messages_created_at` (`created_at`),
  KEY `idx_contact_messages_email`      (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
--  Table: cms_pages
--  Per-page copy and SEO overrides set from the admin console (/admin/pages,
--  /admin/seo) and served to the site by api/content.php. `content` is a
--  sparse JSON object of only the fields an admin changed; `meta` holds the
--  title / description / keywords / ogImage / noindex overrides.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_pages` (
  `page_key`   VARCHAR(190) NOT NULL,                  -- "home", "about", or a path
  `content`    MEDIUMTEXT            DEFAULT NULL,      -- JSON
  `meta`       TEXT                  DEFAULT NULL,      -- JSON
  `updated_at` DATETIME     NOT NULL,                  -- stored in UTC
  `updated_by` VARCHAR(80)           DEFAULT NULL,
  PRIMARY KEY (`page_key`)
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
--  password_verify() accepts it at login (api/admin/_token.php). bcrypt
--  hashes are portable — unlike a SHA2() hash, this one is login-compatible.
--
--  This statement is idempotent and self-repairing:
--    • if no admin row exists, it is created;
--    • if an admin row already exists (e.g. seeded earlier with a wrong or
--      forgotten password), the hash is reset back to 'Uecampus@online'.
--  Re-import this file any time login is failing to restore known credentials.
--
--  To set a different password later, replace the hash with the output of
--  PHP password_hash('<new password>', PASSWORD_DEFAULT).
-- ----------------------------------------------------------------------------
INSERT INTO `admin_users` (`username`, `password_hash`, `created_at`)
VALUES ('admin', '$2y$10$KVVIGJcSh9vhyUBUySIzkOq0w.dk0ZeGQaGpD6wKT7NDZi8zvCBye', UTC_TIMESTAMP())
ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
--  End of schema
-- ============================================================================
