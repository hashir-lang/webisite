<?php
/**
 * UeCampus Blog — shared core.
 * =============================================================================
 * A self-contained, server-rendered blog engine that lives alongside the /api
 * PHP backend. Every public page is rendered by PHP as fully-formed HTML with
 * complete SEO markup (title, meta, canonical, Open Graph, Twitter, JSON-LD),
 * so a post goes live the instant it is published — no React rebuild, and
 * crawlers receive the full content immediately.
 *
 * The blog is deliberately NOT linked from the site's primary navigation. It is
 * discoverable only via:
 *   - the blog sitemap (/blog/sitemap.xml, submitted to Google)
 *   - direct URLs / organic search
 *   - the discreet backlink in the site footer
 *
 * This file holds the engine: the database schema, data access, and the
 * HTML/SEO rendering layer. It is shared by the public router (index.php) and
 * by /api/admin/blog.php, which exposes the same data access as JSON for the
 * Blog section of the React admin console at /admin/blog. Authoring has no
 * portal of its own — it signs in once, with the rest of /admin, against the
 * Bearer token issued by /api/admin/login.php.
 *
 * Files prefixed with "_" are blocked from direct web access by blog/.htaccess.
 */

if (!defined('UE_BLOG')) {
    define('UE_BLOG', true);
}

// Production-safe error handling: never leak notices/warnings into the HTML or
// JSON. Real errors are still written to the PHP error log.
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Reuse the main backend's DB layer + .env reader (ue_db(), ue_env()). The blog
// is deployed next to /api in the docroot.
require_once __DIR__ . '/../api/_db.php';

/** Production origin for canonical + Open Graph URLs (no trailing slash). */
function blog_site_url(): string
{
    $u = ue_env('SITE_URL', 'https://uecampus.com');
    return rtrim((string) ($u ?: 'https://uecampus.com'), '/');
}

/** Absolute URL for a root-relative path (e.g. "/blog/foo" -> "https://…/blog/foo"). */
function blog_abs(string $path): string
{
    if ($path === '') {
        return blog_site_url();
    }
    if (preg_match('#^https?://#i', $path)) {
        return $path;
    }
    return blog_site_url() . '/' . ltrim($path, '/');
}

/**
 * The URL base the blog is mounted at, as the VISITOR sees it ("/blog", or
 * "/ue-replica/blog" in a subfolder deploy). No trailing slash.
 *
 * Derived from the requested URL, deliberately NOT from SCRIPT_NAME. On hosting
 * where the site lives inside a public/ folder that Apache rewrites into
 * internally, SCRIPT_NAME is "/public/blog/index.php" while the browser is on
 * "/blog/<slug>" — a prefix the visitor never sees. Trusting SCRIPT_NAME there
 * broke the blog twice over: index.php sliced strlen("/public/blog") characters
 * off the request path, eating the first characters of every slug (so every
 * article 404'd unless "/public" was typed in by hand), and every canonical,
 * sitemap entry and internal link was emitted with a "/public/" in it.
 */
function blog_base(): string
{
    static $base = null;
    if ($base !== null) {
        return $base;
    }

    // The mount point is whatever precedes the "/blog" segment of the request,
    // so it survives any internal rewrite the server does on the way here.
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
    if ($path !== '' && preg_match('#^(.*?/blog)(?:/|$)#i', $path, $m)) {
        return $base = $m[1];
    }

    // Fallback for requests that don't carry a /blog path (CLI, or index.php
    // fetched directly): this script's own directory.
    $dir  = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/blog/index.php'));
    return $base = ($dir === '/' || $dir === '.') ? '' : rtrim($dir, '/');
}

/** Default social share image (falls back to the site logo). */
function blog_default_image(): string
{
    return blog_site_url() . '/uecampus-logo.png';
}

/**
 * Strip the "/public" prefix out of links and image paths in stored content.
 *
 * Anything written while blog_base() still derived its mount point from
 * SCRIPT_NAME carries that prefix: every uploaded image URL, plus any link the
 * author copied out of the address bar while working around the bug. Those URLs
 * still resolve (the server redirects them), but they are not the canonical
 * ones, so they are rewritten on save and repaired in place — see
 * blog_repair_public_urls().
 *
 * Deliberately narrow: only link/image attributes, absolute URLs pointing back
 * at this site, and a bare stored path are touched. A post that merely writes
 * the characters "/public/" in its prose is left alone.
 */
function blog_strip_public_prefix(?string $value): ?string
{
    if ($value === null || $value === '') {
        return $value;
    }

    // href="/public/x" · src='/public/x' · data-src="/public/x"
    $out = (string) preg_replace('#\b(href|src)=(["\'])/public/#i', '${1}=${2}/', $value);

    // Absolute links back to this site: https://uecampus.com/public/x -> /x
    $site = blog_site_url();
    $out  = (string) preg_replace('#' . preg_quote($site, '#') . '/public/#i', $site . '/', $out);

    // A bare stored path, i.e. the cover_image column: /public/blog/uploads/…
    return (string) preg_replace('#^/public/#', '/', $out);
}

// ---------------------------------------------------------------------------
//  Schema
// ---------------------------------------------------------------------------

/** Create the blog_posts table on first use (idempotent). */
function blog_ensure_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    ue_db()->exec('CREATE TABLE IF NOT EXISTS `blog_posts` (
        `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `slug`             VARCHAR(200) NOT NULL,
        `title`            VARCHAR(255) NOT NULL,
        `excerpt`          VARCHAR(500)  DEFAULT NULL,
        `body`             MEDIUMTEXT    NOT NULL,
        `cover_image`      VARCHAR(255)  DEFAULT NULL,
        `cover_alt`        VARCHAR(255)  DEFAULT NULL,
        `category`         VARCHAR(80)   DEFAULT NULL,
        `tags`             VARCHAR(300)  DEFAULT NULL,
        `author`           VARCHAR(120)  NOT NULL DEFAULT "UeCampus",
        `meta_title`       VARCHAR(255)  DEFAULT NULL,
        `meta_description` VARCHAR(320)  DEFAULT NULL,
        `keywords`         VARCHAR(400)  DEFAULT NULL,
        `status`           ENUM("draft","published") NOT NULL DEFAULT "draft",
        `views`            INT UNSIGNED  NOT NULL DEFAULT 0,
        `published_at`     DATETIME      DEFAULT NULL,
        `created_at`       DATETIME      NOT NULL,
        `updated_at`       DATETIME      NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `uq_blog_slug` (`slug`),
        KEY `idx_blog_status_pub` (`status`, `published_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
    $done = true;

    blog_repair_public_urls();
}

/**
 * One-off content repair for posts written before blog_base() was fixed: strip
 * the "/public" prefix baked into their image URLs and links.
 *
 * Runs automatically (no SQL to paste, nothing to remember after a deploy) and
 * is self-skipping: the guard below matches exactly the patterns
 * blog_strip_public_prefix() rewrites, so once the content is clean it selects
 * nothing and the repair costs one indexless scan of a small table — the same
 * order of cost as the CREATE TABLE / information_schema checks ue_db() already
 * performs on every request.
 */
function blog_repair_public_urls(): void
{
    $site = blog_site_url();
    $stmt = ue_db()->prepare(
        'SELECT id, body, cover_image FROM blog_posts
          WHERE body LIKE :dq OR body LIKE :sq OR body LIKE :abs
             OR cover_image LIKE :cabs OR cover_image LIKE :croot'
    );
    // One placeholder per slot: emulated prepares are off, so a named parameter
    // cannot be reused across two conditions.
    $stmt->execute([
        ':dq'    => '%="/public/%',
        ':sq'    => "%='/public/%",
        ':abs'   => '%' . $site . '/public/%',
        ':cabs'  => '%' . $site . '/public/%',
        ':croot' => '/public/%',
    ]);
    $rows = $stmt->fetchAll();
    if (!$rows) {
        return;
    }

    $update = ue_db()->prepare(
        'UPDATE blog_posts SET body = :body, cover_image = :cover WHERE id = :id'
    );
    foreach ($rows as $row) {
        $body  = blog_strip_public_prefix((string) $row['body']);
        $cover = blog_strip_public_prefix(
            $row['cover_image'] === null ? null : (string) $row['cover_image']
        );
        if ($body === $row['body'] && $cover === $row['cover_image']) {
            continue;
        }
        $update->execute([
            ':body'  => $body,
            ':cover' => $cover,
            ':id'    => (int) $row['id'],
        ]);
    }
}

// ---------------------------------------------------------------------------
//  Small helpers
// ---------------------------------------------------------------------------

/** HTML-escape for output. */
function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** UTC timestamp string for created_at / updated_at / published_at. */
function blog_now(): string
{
    return gmdate('Y-m-d H:i:s');
}

/** Turn a title into a URL-safe slug (clean transliteration of accents). */
function blog_slugify(string $s): string
{
    $s = trim($s);

    // Map common accented Latin characters to ASCII. This is deterministic
    // across platforms, unlike iconv//TRANSLIT which inserts stray apostrophes
    // on some (Windows) builds.
    static $map = [
        'à'=>'a','á'=>'a','â'=>'a','ã'=>'a','ä'=>'a','å'=>'a','ā'=>'a','ă'=>'a','ą'=>'a',
        'ç'=>'c','ć'=>'c','č'=>'c','ĉ'=>'c',
        'è'=>'e','é'=>'e','ê'=>'e','ë'=>'e','ē'=>'e','ě'=>'e','ę'=>'e',
        'ì'=>'i','í'=>'i','î'=>'i','ï'=>'i','ī'=>'i','į'=>'i',
        'ñ'=>'n','ń'=>'n','ň'=>'n',
        'ò'=>'o','ó'=>'o','ô'=>'o','õ'=>'o','ö'=>'o','ø'=>'o','ō'=>'o','ő'=>'o',
        'ù'=>'u','ú'=>'u','û'=>'u','ü'=>'u','ū'=>'u','ů'=>'u','ű'=>'u',
        'ý'=>'y','ÿ'=>'y','ß'=>'ss','æ'=>'ae','œ'=>'oe',
        'š'=>'s','ś'=>'s','ş'=>'s','ž'=>'z','ź'=>'z','ż'=>'z','ł'=>'l','đ'=>'d','þ'=>'th',
    ];
    $s = strtr(mb_strtolower($s, 'UTF-8'), $map);

    // Drop any remaining non-ASCII, then collapse to hyphenated words.
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? $s;
    $s = trim((string) $s, '-');
    return $s !== '' ? substr($s, 0, 190) : 'post';
}

/** Ensure the slug is unique, appending -2, -3 … when needed. Ignores $exceptId. */
function blog_unique_slug(string $slug, ?int $exceptId = null): string
{
    blog_ensure_schema();
    $base = blog_slugify($slug);
    $slug = $base;
    $i    = 2;
    while (true) {
        $stmt = ue_db()->prepare('SELECT id FROM blog_posts WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $id = $stmt->fetchColumn();
        if ($id === false || (int) $id === (int) $exceptId) {
            return $slug;
        }
        $slug = $base . '-' . $i++;
    }
}

/** Plain-text excerpt derived from HTML body, trimmed to ~$len chars. */
function blog_auto_excerpt(string $html, int $len = 160): string
{
    $text = trim(preg_replace('/\s+/', ' ', strip_tags($html)) ?? '');
    if (mb_strlen($text) <= $len) {
        return $text;
    }
    return rtrim(mb_substr($text, 0, $len - 1)) . '…';
}

/** Estimated reading time in minutes from an HTML body (~200 wpm). */
function blog_read_time(string $html): int
{
    $words = str_word_count(strip_tags($html));
    return max(1, (int) ceil($words / 200));
}

/** Human date, e.g. "16 July 2026". */
function blog_human_date(?string $sqlDate): string
{
    if (!$sqlDate) {
        return '';
    }
    $ts = strtotime($sqlDate);
    return $ts ? gmdate('j F Y', $ts) : '';
}

/** ISO-8601 date for <time> / structured data. */
function blog_iso_date(?string $sqlDate): string
{
    if (!$sqlDate) {
        return '';
    }
    $ts = strtotime($sqlDate . ' UTC');
    return $ts ? gmdate('c', $ts) : '';
}

// ---------------------------------------------------------------------------
//  Data access
// ---------------------------------------------------------------------------

/** Fetch a single published post by slug (or any status when $anyStatus). */
function blog_find_by_slug(string $slug, bool $anyStatus = false): ?array
{
    blog_ensure_schema();
    $sql = 'SELECT * FROM blog_posts WHERE slug = ?';
    if (!$anyStatus) {
        $sql .= ' AND status = "published"';
    }
    $sql .= ' LIMIT 1';
    $stmt = ue_db()->prepare($sql);
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/** Fetch a single post by id (admin). */
function blog_find_by_id(int $id): ?array
{
    blog_ensure_schema();
    $stmt = ue_db()->prepare('SELECT * FROM blog_posts WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

/**
 * List published posts for the public index.
 * $opts: category (string), q (search), limit (int), offset (int).
 * Returns ['posts' => [...], 'total' => int].
 */
function blog_list_published(array $opts = []): array
{
    blog_ensure_schema();
    $where  = ['status = "published"', 'published_at <= UTC_TIMESTAMP()'];
    $params = [];

    if (!empty($opts['category']) && $opts['category'] !== 'All') {
        $where[]  = 'category = ?';
        $params[] = $opts['category'];
    }
    if (!empty($opts['q'])) {
        $where[]  = '(title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)';
        $like     = '%' . $opts['q'] . '%';
        $params[] = $like;
        $params[] = $like;
        $params[] = $like;
    }
    $whereSql = 'WHERE ' . implode(' AND ', $where);

    $countStmt = ue_db()->prepare("SELECT COUNT(*) FROM blog_posts $whereSql");
    $countStmt->execute($params);
    $total = (int) $countStmt->fetchColumn();

    $limit  = max(1, (int) ($opts['limit'] ?? 9));
    $offset = max(0, (int) ($opts['offset'] ?? 0));

    $stmt = ue_db()->prepare(
        "SELECT * FROM blog_posts $whereSql ORDER BY published_at DESC, id DESC LIMIT $limit OFFSET $offset"
    );
    $stmt->execute($params);

    return ['posts' => $stmt->fetchAll(), 'total' => $total];
}

/** Distinct categories used by published posts (for the filter bar). */
function blog_categories(): array
{
    blog_ensure_schema();
    $rows = ue_db()->query(
        'SELECT DISTINCT category FROM blog_posts
         WHERE status = "published" AND category IS NOT NULL AND category <> ""
         ORDER BY category ASC'
    )->fetchAll(PDO::FETCH_COLUMN);
    return $rows ?: [];
}

/** A few related published posts (same category first), excluding $excludeId. */
function blog_related(int $excludeId, ?string $category, int $limit = 3): array
{
    blog_ensure_schema();
    $out = [];
    if ($category) {
        $stmt = ue_db()->prepare(
            'SELECT * FROM blog_posts
             WHERE status = "published" AND id <> ? AND category = ?
             ORDER BY published_at DESC LIMIT ?'
        );
        $stmt->bindValue(1, $excludeId, PDO::PARAM_INT);
        $stmt->bindValue(2, $category, PDO::PARAM_STR);
        $stmt->bindValue(3, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $out = $stmt->fetchAll();
    }
    if (count($out) < $limit) {
        $have = array_map(static fn($p) => (int) $p['id'], $out);
        $have[] = $excludeId;
        $ph   = implode(',', array_fill(0, count($have), '?'));
        $stmt = ue_db()->prepare(
            "SELECT * FROM blog_posts
             WHERE status = 'published' AND id NOT IN ($ph)
             ORDER BY published_at DESC LIMIT " . (int) ($limit - count($out))
        );
        $stmt->execute($have);
        $out = array_merge($out, $stmt->fetchAll());
    }
    return $out;
}

/** All posts for the admin dashboard (newest first). */
function blog_all(): array
{
    blog_ensure_schema();
    return ue_db()->query('SELECT * FROM blog_posts ORDER BY
        (status = "published") DESC, COALESCE(published_at, updated_at) DESC, id DESC')->fetchAll();
}

/** Best-effort view counter (never blocks page render). */
function blog_increment_views(int $id): void
{
    try {
        ue_db()->prepare('UPDATE blog_posts SET views = views + 1 WHERE id = ?')->execute([$id]);
    } catch (Throwable $e) {
        error_log('blog: view increment failed: ' . $e->getMessage());
    }
}

/**
 * Insert or update a post from a field array. Returns the post id.
 * Expected keys: id (0 for new), title, slug, excerpt, body, cover_image,
 * cover_alt, category, tags, author, meta_title, meta_description, keywords,
 * status, published_at.
 */
function blog_save(array $f): int
{
    blog_ensure_schema();
    $id     = (int) ($f['id'] ?? 0);
    $title  = trim((string) ($f['title'] ?? ''));
    // Links and images are stored canonically — a "/public" prefix pasted in
    // from the address bar never reaches the database.
    $body   = (string) blog_strip_public_prefix((string) ($f['body'] ?? ''));
    $status = ($f['status'] ?? 'draft') === 'published' ? 'published' : 'draft';

    $slug = trim((string) ($f['slug'] ?? ''));
    $slug = blog_unique_slug($slug !== '' ? $slug : $title, $id ?: null);

    $excerpt = trim((string) ($f['excerpt'] ?? ''));
    if ($excerpt === '') {
        $excerpt = blog_auto_excerpt($body);
    }

    // Set published_at the first time a post goes live; keep it stable after.
    $publishedAt = $f['published_at'] ?? null;
    if ($status === 'published' && !$publishedAt) {
        $existing = $id ? blog_find_by_id($id) : null;
        $publishedAt = ($existing && $existing['published_at']) ? $existing['published_at'] : blog_now();
    }
    if ($status !== 'published') {
        $publishedAt = $publishedAt ?: null;
    }

    $cols = [
        'slug'             => $slug,
        'title'            => $title !== '' ? $title : 'Untitled',
        'excerpt'          => $excerpt,
        'body'             => $body,
        'cover_image'      => blog_strip_public_prefix(trim((string) ($f['cover_image'] ?? ''))) ?: null,
        'cover_alt'        => trim((string) ($f['cover_alt'] ?? '')) ?: null,
        'category'         => trim((string) ($f['category'] ?? '')) ?: null,
        'tags'             => trim((string) ($f['tags'] ?? '')) ?: null,
        'author'           => trim((string) ($f['author'] ?? '')) ?: 'UeCampus',
        'meta_title'       => trim((string) ($f['meta_title'] ?? '')) ?: null,
        'meta_description' => trim((string) ($f['meta_description'] ?? '')) ?: null,
        'keywords'         => trim((string) ($f['keywords'] ?? '')) ?: null,
        'status'           => $status,
        'published_at'     => $publishedAt,
        'updated_at'       => blog_now(),
    ];

    if ($id) {
        $set = implode(', ', array_map(static fn($c) => "`$c` = :$c", array_keys($cols)));
        $stmt = ue_db()->prepare("UPDATE blog_posts SET $set WHERE id = :id");
        $cols['id'] = $id;
        $stmt->execute($cols);
        return $id;
    }

    $cols['created_at'] = blog_now();
    $names  = implode(', ', array_map(static fn($c) => "`$c`", array_keys($cols)));
    $places = implode(', ', array_map(static fn($c) => ":$c", array_keys($cols)));
    $stmt = ue_db()->prepare("INSERT INTO blog_posts ($names) VALUES ($places)");
    $stmt->execute($cols);
    return (int) ue_db()->lastInsertId();
}

/** Delete a post by id. */
function blog_delete(int $id): void
{
    blog_ensure_schema();
    ue_db()->prepare('DELETE FROM blog_posts WHERE id = ?')->execute([$id]);
}

// ---------------------------------------------------------------------------
//  Public rendering — the styled, SEO-complete HTML shell
// ---------------------------------------------------------------------------

/**
 * Print <!doctype> … opening <body> with the full <head> (SEO) and the site
 * header (which carries the internal backlinks to the main marketing pages).
 *
 * $seo keys: title, description, canonical (path or absolute), image, type
 * ('website'|'article'), keywords, robots (bool index), schema (array|arrays),
 * published_time, modified_time, author, section.
 */
function blog_head(array $seo): void
{
    $site      = blog_site_url();
    $base      = blog_base();
    $title     = $seo['title'] ?? 'UeCampus Blog';
    $desc      = $seo['description'] ?? 'Insights on online study, UK qualifications, careers and degree recognition from UeCampus.';
    $canonical = blog_abs($seo['canonical'] ?? $base);
    $image     = blog_abs($seo['image'] ?? blog_default_image());
    $type      = $seo['type'] ?? 'website';
    $index     = ($seo['robots'] ?? true) ? 'index, follow, max-image-preview:large' : 'noindex, follow';
    $schemas   = [];
    if (!empty($seo['schema'])) {
        $schemas = isset($seo['schema'][0]) ? $seo['schema'] : [$seo['schema']];
    }
    header('Content-Type: text/html; charset=utf-8');
    ?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($title) ?></title>
<meta name="description" content="<?= e($desc) ?>">
<?php if (!empty($seo['keywords'])): ?><meta name="keywords" content="<?= e($seo['keywords']) ?>">
<?php endif; ?><link rel="canonical" href="<?= e($canonical) ?>">
<meta name="robots" content="<?= e($index) ?>">
<link rel="icon" href="<?= e($site) ?>/favicon.png">

<meta property="og:site_name" content="UeCampus">
<meta property="og:type" content="<?= e($type) ?>">
<meta property="og:title" content="<?= e($title) ?>">
<meta property="og:description" content="<?= e($desc) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:image" content="<?= e($image) ?>">
<meta property="og:locale" content="en_GB">
<?php if ($type === 'article'): ?>
<?php if (!empty($seo['published_time'])): ?><meta property="article:published_time" content="<?= e($seo['published_time']) ?>">
<?php endif; ?><?php if (!empty($seo['modified_time'])): ?><meta property="article:modified_time" content="<?= e($seo['modified_time']) ?>">
<?php endif; ?><?php if (!empty($seo['author'])): ?><meta property="article:author" content="<?= e($seo['author']) ?>">
<?php endif; ?><?php if (!empty($seo['section'])): ?><meta property="article:section" content="<?= e($seo['section']) ?>">
<?php endif; ?>
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($title) ?>">
<meta name="twitter:description" content="<?= e($desc) ?>">
<meta name="twitter:image" content="<?= e($image) ?>">

<?php foreach ($schemas as $s): ?>
<script type="application/ld+json"><?= json_encode($s, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?></script>
<?php endforeach; ?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Same families as the React app's index.html — the blog is the main site,
     not a separate property, so the typography must be identical. -->
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style><?= blog_css() ?></style>
</head>
<body>
<?php blog_site_header(); ?>
<?php
}

/** Close <body></html> with the footer (more internal backlinks). */
function blog_foot(): void
{
    blog_site_footer();
    echo "\n</body>\n</html>";
}

/**
 * Site header — a static mirror of src/components/layout/Header.tsx.
 *
 * The nav deliberately carries NO link to the blog: it stays discoverable via
 * the footer, the sitemap and organic search only. Keep these links in step
 * with the React header's NAV array so the blog never reads as a bolted-on
 * subsite.
 */
function blog_site_header(): void
{
    $s = blog_site_url();
    ?>
<header class="ue-nav">
  <div class="ue-util">
    <div class="ue-wrap ue-util-in">
      <a href="mailto:info@uecampus.com">info@uecampus.com</a>
      <span class="ue-util-sep" aria-hidden="true"></span>
      <a href="tel:+447747312812">+44 7747 312812</a>
    </div>
  </div>
  <div class="ue-wrap ue-nav-in">
    <a class="ue-logo" href="<?= e($s) ?>/" aria-label="UeCampus - Home">
      <img src="<?= e($s) ?>/uecampus-logo.png" alt="UeCampus" width="160" height="56">
    </a>
    <nav class="ue-nav-links" aria-label="Primary">
      <a href="<?= e($s) ?>/about-us">About Us</a>
      <a href="<?= e($s) ?>/programmes">Programmes</a>
      <a href="<?= e($s) ?>/scholarship">Scholarship</a>
      <a href="<?= e($s) ?>/contact-us">Contact Us</a>
    </nav>
    <div class="ue-nav-actions">
      <a class="ue-portal" href="https://studyportal.uecampus.com/" target="_blank" rel="noopener">Student Portal</a>
      <a class="ue-apply" href="<?= e($s) ?>/enquire-now">Apply <span aria-hidden="true">↗</span></a>
    </div>
  </div>
</header>
<?php
}

/**
 * Site footer — a static mirror of src/components/layout/Footer.tsx, including
 * the discreet "Journal" backlink that is the blog's only in-page entry point.
 */
function blog_site_footer(): void
{
    $s = blog_site_url();
    $b = blog_base();
    $year = gmdate('Y');
    ?>
<footer class="ue-foot">
  <div class="ue-wrap">
    <div class="ue-foot-top">
      <a class="ue-foot-logo" href="<?= e($s) ?>/">
        <img src="<?= e($s) ?>/uecampus-logo.png" alt="UeCampus" width="150" height="52">
      </a>
      <p class="ue-foot-blurb">
        Internationally recognised online degrees and UK diplomas, awarded with partner
        institutions across the UK, France, Malta and the US. Study 100% online.
      </p>
    </div>

    <div class="ue-foot-grid">
      <div>
        <h4>About</h4>
        <ul>
          <li><a href="<?= e($s) ?>/about-us">About UeCampus</a></li>
          <li><a href="<?= e($s) ?>/accreditation-and-partners">Accreditation</a></li>
          <li><a href="<?= e($s) ?>/scholarship">Scholarships</a></li>
          <li><a href="<?= e($b) ?>">Journal</a></li>
          <li><a href="<?= e($s) ?>/faqs">FAQs</a></li>
          <li><a href="<?= e($s) ?>/contact-us">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Studies</h4>
        <ul>
          <li><a href="<?= e($s) ?>/programmes">Programmes &amp; Diplomas</a></li>
          <li><a href="<?= e($s) ?>/courses">All Courses</a></li>
          <li><a href="<?= e($s) ?>/partners/walsh-college">Walsh College</a></li>
          <li><a href="<?= e($s) ?>/partners/ppa-business-school">PPA Business School</a></li>
          <li><a href="<?= e($s) ?>/program/european-business-school-eie">eie European Business School</a></li>
          <li><a href="<?= e($s) ?>/partners/qualifi">Qualifi Diplomas</a></li>
        </ul>
      </div>
      <div>
        <h4>Start</h4>
        <ul>
          <li><a href="<?= e($s) ?>/enquire-now">Enquire now</a></li>
          <li><a href="<?= e($s) ?>/fees">Tuition &amp; fees</a></li>
          <li><a href="https://studyportal.uecampus.com/" target="_blank" rel="noopener">Student Portal</a></li>
          <li><a href="mailto:info@uecampus.com">info@uecampus.com</a></li>
        </ul>
        <?php /* Social profiles — keep in step with SOCIALS in src/components/layout/Footer.tsx */ ?>
        <ul class="ue-foot-social" aria-label="UeCampus on social media">
          <li><a href="https://www.instagram.com/join_uecampus/" target="_blank" rel="noopener noreferrer" aria-label="UeCampus on Instagram" title="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a></li>
          <li><a href="https://www.facebook.com/p/UeCampus-61572906104101/" target="_blank" rel="noopener noreferrer" aria-label="UeCampus on Facebook" title="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a></li>
          <li><a href="https://uk.linkedin.com/company/uecampus" target="_blank" rel="noopener noreferrer" aria-label="UeCampus on LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a></li>
        </ul>
      </div>
    </div>

    <div class="ue-foot-base">
      <span>© <?= e($year) ?> UeCampus Ltd. All rights reserved.</span>
      <a href="<?= e($b) ?>/sitemap.xml">Journal sitemap</a>
    </div>
  </div>
</footer>
<?php
}

/**
 * Prepare a stored HTML body for output. The body is authored by a trusted
 * admin, but we still strip <script>/<style>/<iframe>/<object>/<embed>, inline
 * event handlers and javascript: URLs as defence-in-depth before echoing.
 * Shared by the public post view and the admin editor.
 */
function blog_render_body(string $html): string
{
    $html = preg_replace('#<(script|style|iframe|object|embed)\b[^>]*>.*?</\1>#is', '', $html) ?? $html;
    $html = preg_replace('#<(script|style|iframe|object|embed)\b[^>]*/?>#is', '', $html) ?? $html;
    $html = preg_replace('#\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)#i', '', $html) ?? $html;
    $html = preg_replace('#(href|src)\s*=\s*("|\')\s*javascript:[^"\']*(\2)#i', '$1=$2#$3', $html) ?? $html;
    return $html;
}

/** The complete, self-contained stylesheet (brand palette from src/index.css). */
function blog_css(): string
{
    return <<<CSS
/* ===========================================================================
   The journal is the main site, not a separate property: these tokens and
   font stacks are copied verbatim from src/index.css and index.html. If the
   brand palette or typography changes there, mirror it here or the blog will
   drift back into looking like a bolted-on subsite.
   =========================================================================== */
:root{
  --paper:0 0% 100%; --paper-soft:275 30% 97%; --paper-deep:275 14% 92%;
  --rule:272 16% 86%; --rule-strong:272 16% 70%;
  --ink:272 28% 12%; --ink-soft:272 20% 26%; --ink-mute:272 12% 46%;
  --aubergine:272 64% 14%; --plum:272 62% 32%; --plum-glow:278 60% 48%;
  --orchid:284 64% 56%; --bloom:292 70% 72%; --ember:24 80% 56%;
  --shadow-card:0 1px 0 hsl(var(--rule)), 0 24px 60px -28px hsl(272 64% 14% / .24);
  --snap:all .18s cubic-bezier(.2,.7,.2,1);
  --smooth:all .35s cubic-bezier(.2,.7,.2,1);
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility;
  font-feature-settings:"kern";scroll-behavior:smooth}
body{margin:0;background:hsl(var(--paper));color:hsl(var(--ink));
  font-family:'Manrope',system-ui,-apple-system,sans-serif;
  font-size:16px;line-height:1.55;font-weight:400;letter-spacing:-.005em}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
::selection{background:hsl(var(--plum) / .22)}

/* .container-wide */
.ue-wrap,.bl-wrap{max-width:1440px;margin-inline:auto;padding-inline:1.5rem}
@media(min-width:768px){.ue-wrap,.bl-wrap{padding-inline:2.5rem}}

/* Display type. Manrope has no italics, so the accent word is differentiated
   by weight + plum (mirrors .italic-serif in src/index.css). */
.serif{font-family:'Manrope',system-ui,sans-serif;font-weight:600;
  letter-spacing:-.025em;line-height:1.05;color:hsl(var(--ink))}
.serif i{font-style:normal;font-weight:300;color:hsl(var(--plum));letter-spacing:-.03em}
.dot{color:hsl(var(--ember))}
.eyebrow{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;font-weight:500;
  letter-spacing:.18em;text-transform:uppercase;color:hsl(var(--plum));margin:0}

/* ── Header (mirrors src/components/layout/Header.tsx) ───────────────────── */
.ue-nav{position:sticky;top:0;z-index:50;background:hsl(var(--paper) / .85);
  backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid hsl(var(--rule))}
.ue-util{display:none;border-bottom:1px solid hsl(var(--rule) / .6)}
@media(min-width:1024px){.ue-util{display:block}}
.ue-util-in{display:flex;justify-content:flex-end;align-items:center;gap:20px;padding-block:8px;
  font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;
  letter-spacing:.18em;color:hsl(var(--ink-mute))}
.ue-util-in a{transition:var(--snap)}
.ue-util-in a:hover{color:hsl(var(--plum))}
.ue-util-sep{width:1px;height:12px;background:hsl(var(--rule))}
.ue-nav-in{display:flex;align-items:center;justify-content:space-between;gap:24px;height:64px}
@media(min-width:768px){.ue-nav-in{height:80px}}
.ue-logo img{height:44px;width:auto;transition:var(--smooth)}
@media(min-width:768px){.ue-logo img{height:56px}}
.ue-logo:hover img{opacity:.8}
.ue-nav-links{display:none;align-items:center;gap:32px}
@media(min-width:1024px){.ue-nav-links{display:flex}}
.ue-nav-links a{font-size:13px;font-weight:500;letter-spacing:-.01em;transition:var(--snap)}
.ue-nav-links a:hover{color:hsl(var(--plum))}
.ue-nav-actions{display:none;align-items:center;gap:12px}
@media(min-width:768px){.ue-nav-actions{display:flex}}
.ue-portal{font-size:13px;font-weight:500;transition:var(--snap)}
.ue-portal:hover{color:hsl(var(--plum))}
.ue-apply{display:inline-flex;align-items:center;gap:8px;border-radius:999px;
  background:hsl(var(--aubergine));color:#fff;padding:10px 20px;font-size:13px;
  font-weight:500;transition:var(--smooth)}
.ue-apply:hover{background:hsl(var(--plum))}

/* ── Masthead ────────────────────────────────────────────────────────────── */
.bl-mast{background:hsl(var(--paper-soft));border-bottom:1px solid hsl(var(--rule));padding:56px 0 44px}
.bl-mast h1{font-size:clamp(2.4rem,6vw,4.5rem);line-height:1.02;margin:14px 0 0}
.bl-mast p{max-width:56ch;color:hsl(var(--ink-soft));font-size:18px;margin-top:18px;line-height:1.55}

/* ── Filter bar ──────────────────────────────────────────────────────────── */
.bl-filter{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;margin-top:30px}
.bl-filter form{display:flex;align-items:center;gap:10px;border-bottom:1px solid hsl(var(--ink));
  padding-bottom:6px;min-width:220px;flex:1}
.bl-filter input{border:0;background:transparent;outline:none;font-family:inherit;font-size:15px;
  width:100%;color:hsl(var(--ink))}
.bl-chips{display:flex;flex-wrap:wrap;gap:6px}
.bl-chip{font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;
  letter-spacing:.14em;color:hsl(var(--ink-mute));padding:6px 12px;
  border:1px solid hsl(var(--rule));border-radius:999px;transition:var(--snap)}
.bl-chip:hover{color:hsl(var(--plum));border-color:hsl(var(--plum))}
.bl-chip.on{background:hsl(var(--aubergine));color:#fff;border-color:hsl(var(--aubergine))}

/* ── Grid + cards ────────────────────────────────────────────────────────── */
.bl-section{padding:56px 0}
.bl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:44px 36px}
@media(max-width:900px){.bl-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.bl-grid{grid-template-columns:1fr}}
.bl-card figure{margin:0;aspect-ratio:5/4;overflow:hidden;background:hsl(var(--paper-deep));border-radius:4px}
.bl-card figure img{width:100%;height:100%;object-fit:cover;transition:transform .7s ease}
.bl-card:hover figure img{transform:scale(1.04)}
.bl-card .cat{margin-top:16px}
.bl-card h3{font-size:21px;line-height:1.18;margin:10px 0 8px}
.bl-card:hover h3{color:hsl(var(--plum))}
.bl-card p{font-size:14px;color:hsl(var(--ink-soft));margin:0;line-height:1.55}
.bl-card .meta{margin-top:12px;color:hsl(var(--ink-mute))}

/* ── Hero post ───────────────────────────────────────────────────────────── */
.bl-hero{display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:center}
@media(max-width:820px){.bl-hero{grid-template-columns:1fr;gap:28px}}
.bl-hero figure{margin:0;aspect-ratio:5/4;overflow:hidden;background:hsl(var(--paper-deep));
  border-radius:4px;position:relative}
.bl-hero figure img{width:100%;height:100%;object-fit:cover}
.bl-hero h2{font-size:clamp(1.9rem,3.6vw,2.8rem);line-height:1.05;margin:12px 0 0}
.bl-hero:hover h2{color:hsl(var(--plum))}
.bl-hero .lede{font-size:17px;color:hsl(var(--ink-soft));margin-top:16px;line-height:1.55}
.bl-tag{position:absolute;top:12px;left:12px;display:inline-block;font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#fff;
  background:hsl(var(--aubergine) / .85);padding:5px 10px;border-radius:2px}
.readmore{display:inline-flex;gap:6px;align-items:center;font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:hsl(var(--ink));
  margin-top:20px;transition:var(--snap)}
.bl-hero:hover .readmore{color:hsl(var(--plum))}

/* ── Article ─────────────────────────────────────────────────────────────── */
.bl-article{padding:44px 0 16px}
.bl-article .bl-wrap{max-width:760px}
.bl-breadcrumb{font-size:13px;color:hsl(var(--ink-mute))}
.bl-breadcrumb a{transition:var(--snap)}
.bl-breadcrumb a:hover{color:hsl(var(--plum))}
.bl-article h1{font-size:clamp(2rem,4.6vw,3.4rem);line-height:1.06;margin:18px 0 0}
.bl-article .sub{font-size:19px;color:hsl(var(--ink-soft));margin-top:18px;line-height:1.5}
.bl-article .byline{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin-top:22px;
  padding-top:18px;border-top:1px solid hsl(var(--rule));color:hsl(var(--ink-mute));font-size:14px}
.bl-cover{margin:34px 0 0;aspect-ratio:16/9;overflow:hidden;background:hsl(var(--paper-deep));border-radius:4px}
.bl-cover img{width:100%;height:100%;object-fit:cover}

/* Article body — the authored HTML. Mirrors .admin-rte in src/index.css so
   the editor preview and the published page read the same. */
.bl-body{font-size:17px;line-height:1.75;color:hsl(var(--ink-soft));margin-top:36px}
.bl-body>*{max-width:100%}
.bl-body h2{font-family:'Manrope',system-ui,sans-serif;font-weight:600;font-size:28px;
  line-height:1.15;letter-spacing:-.025em;color:hsl(var(--ink));margin:44px 0 14px}
.bl-body h3{font-family:'Manrope',system-ui,sans-serif;font-weight:600;font-size:22px;
  letter-spacing:-.025em;color:hsl(var(--ink));margin:34px 0 12px}
.bl-body p{margin:0 0 20px}
.bl-body a{color:hsl(var(--plum));text-decoration:underline;text-underline-offset:3px}
.bl-body a:hover{color:hsl(var(--plum-glow))}
.bl-body ul,.bl-body ol{margin:0 0 20px;padding-left:24px}
.bl-body ul{list-style:disc}
.bl-body ol{list-style:decimal}
.bl-body li{margin:0 0 8px}
.bl-body img{border-radius:4px;margin:28px 0}
.bl-body blockquote{margin:28px 0;padding:6px 0 6px 24px;border-left:3px solid hsl(var(--orchid));
  font-size:20px;font-style:italic;color:hsl(var(--ink))}
.bl-body pre{background:hsl(var(--aubergine));color:#f3ecfa;padding:18px;border-radius:6px;
  overflow:auto;font-size:14px}
.bl-body code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.9em}
.bl-body hr{border:0;border-top:1px solid hsl(var(--rule));margin:36px 0}
.bl-tags{display:flex;flex-wrap:wrap;gap:8px;margin:40px 0 0}
.bl-tags a{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;
  text-transform:uppercase;color:hsl(var(--ink-mute));border:1px solid hsl(var(--rule));
  border-radius:999px;padding:6px 12px;transition:var(--snap)}
.bl-tags a:hover{color:hsl(var(--plum));border-color:hsl(var(--plum))}

/* ── Buttons + in-article CTA (internal backlinks) ───────────────────────── */
.bl-inline-cta{margin:48px 0 8px;padding:32px;border:1px solid hsl(var(--rule));border-radius:6px;
  background:hsl(var(--paper-soft))}
.bl-inline-cta h3{font-size:23px;margin:0 0 8px}
.bl-inline-cta p{margin:0 0 18px;color:hsl(var(--ink-soft));font-size:15px}
.bl-btn{display:inline-flex;gap:8px;align-items:center;background:hsl(var(--aubergine));color:#fff;
  padding:12px 22px;border-radius:999px;font-size:14px;font-weight:500;transition:var(--smooth)}
.bl-btn:hover{background:hsl(var(--plum))}
.bl-btn-ghost{background:transparent;color:hsl(var(--plum));border:1px solid hsl(var(--plum));margin-left:10px}
.bl-btn-ghost:hover{background:hsl(var(--plum));color:#fff}

/* ── Related ─────────────────────────────────────────────────────────────── */
.bl-related{background:hsl(var(--paper-soft));border-top:1px solid hsl(var(--rule));padding:56px 0}
.bl-related h2{font-size:26px;margin:0 0 28px}

/* ── Pagination ──────────────────────────────────────────────────────────── */
.bl-pager{display:flex;gap:10px;justify-content:center;margin-top:48px}
.bl-pager a,.bl-pager span{padding:9px 15px;border:1px solid hsl(var(--rule));border-radius:999px;
  font-size:14px;color:hsl(var(--ink-soft));transition:var(--snap)}
.bl-pager a:hover{border-color:hsl(var(--plum));color:hsl(var(--plum))}
.bl-pager .on{background:hsl(var(--aubergine));color:#fff;border-color:hsl(var(--aubergine))}

/* ── Footer (mirrors src/components/layout/Footer.tsx) ───────────────────── */
.ue-foot{background:hsl(var(--aubergine));color:#fff;padding:64px 0 28px;position:relative;overflow:hidden}
.ue-foot-logo img{height:48px;width:auto}
.ue-foot-blurb{color:rgba(255,255,255,.62);font-size:14px;max-width:52ch;margin:16px 0 0;line-height:1.55}
.ue-foot-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:48px}
@media(max-width:720px){.ue-foot-grid{grid-template-columns:1fr 1fr}}
.ue-foot h4{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;letter-spacing:.18em;
  text-transform:uppercase;color:rgba(255,255,255,.6);margin:0 0 16px}
.ue-foot ul{list-style:none;margin:0;padding:0}
.ue-foot li{margin:0 0 10px}
.ue-foot a{color:rgba(255,255,255,.82);font-size:14px;transition:var(--snap)}
.ue-foot a:hover{color:#fff}
.ue-foot-social{display:flex;gap:12px;margin-top:18px}
.ue-foot-social li{margin:0}
.ue-foot-social a{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;
  border:1px solid rgba(255,255,255,.3);color:rgba(255,255,255,.8);transition:var(--snap)}
.ue-foot-social a:hover{background:#fff;color:hsl(var(--aubergine))}
.ue-foot-social svg{width:16px;height:16px}
.ue-foot-base{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:44px;
  padding-top:22px;border-top:1px solid rgba(255,255,255,.15);
  font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;color:rgba(255,255,255,.5)}
.ue-foot-base a:hover{color:#fff}

/* ── Empty / 404 ─────────────────────────────────────────────────────────── */
.bl-empty{text-align:center;padding:100px 24px}
.bl-empty h1{font-size:44px;margin:0 0 12px}
.bl-empty p{color:hsl(var(--ink-mute));margin:0 0 24px}
CSS;
}
