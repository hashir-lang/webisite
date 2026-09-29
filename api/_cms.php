<?php
/**
 * Shared CMS data access (cms_pages table). Used by the public feed
 * (content.php) and the admin editor API (admin/content.php).
 */

require_once __DIR__ . '/_db.php';

/** Page keys are registry keys ("home") or route paths ("/programmes/x"). */
function ue_cms_valid_key(string $key): bool
{
    return $key !== '' && strlen($key) <= 190 && preg_match('#^[A-Za-z0-9/_.\-:]+$#', $key) === 1;
}

/** Decode a stored JSON column into an assoc array, or null when empty/invalid. */
function ue_cms_decode(?string $json): ?array
{
    if ($json === null || $json === '') {
        return null;
    }
    $data = json_decode($json, true);
    return (is_array($data) && $data !== []) ? $data : null;
}

/** Encode an override object for storage; null when there is nothing to keep. */
function ue_cms_encode(?array $data): ?string
{
    if ($data === null || $data === []) {
        return null;
    }
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/**
 * Every page row with something set, keyed by page_key:
 *   [ key => ['content' => array|null, 'meta' => array|null,
 *             'updated_at' => 'Y-m-d H:i:s', 'updated_by' => string|null] ]
 */
function ue_cms_all(): array
{
    $rows = ue_db()->query(
        'SELECT page_key, content, meta, updated_at, updated_by FROM cms_pages ORDER BY page_key'
    )->fetchAll();

    $out = [];
    foreach ($rows as $r) {
        $content = ue_cms_decode($r['content']);
        $meta    = ue_cms_decode($r['meta']);
        if ($content === null && $meta === null) {
            continue;
        }
        $out[$r['page_key']] = [
            'content'    => $content,
            'meta'       => $meta,
            'updated_at' => $r['updated_at'],
            'updated_by' => $r['updated_by'],
        ];
    }
    return $out;
}

/** The newest updated_at across all rows — the feed's cache version. */
function ue_cms_version(array $pages): string
{
    $latest = '0';
    foreach ($pages as $row) {
        if (strcmp((string) $row['updated_at'], $latest) > 0) {
            $latest = (string) $row['updated_at'];
        }
    }
    return $latest;
}

/**
 * The SEO override keys the app understands. Anything else posted is dropped,
 * and empty strings mean "no override" so they are dropped too.
 */
function ue_cms_clean_meta(?array $meta): ?array
{
    if ($meta === null) {
        return null;
    }
    $out = [];
    foreach (['title', 'description', 'keywords', 'ogImage'] as $k) {
        if (isset($meta[$k]) && is_string($meta[$k]) && trim($meta[$k]) !== '') {
            $out[$k] = mb_substr(trim($meta[$k]), 0, 1000);
        }
    }
    if (isset($meta['noindex']) && $meta['noindex'] === true) {
        $out['noindex'] = true;
    }
    return $out === [] ? null : $out;
}

/** Insert or update one page's overrides. Both null deletes the row. */
function ue_cms_save(string $key, ?array $content, ?array $meta, ?string $by): void
{
    $pdo = ue_db();
    if (($content === null || $content === []) && ($meta === null || $meta === [])) {
        $pdo->prepare('DELETE FROM cms_pages WHERE page_key = ?')->execute([$key]);
        return;
    }
    $params = [
        ':key'     => $key,
        ':content' => ue_cms_encode($content),
        ':meta'    => ue_cms_encode($meta),
        ':at'      => gmdate('Y-m-d H:i:s'),
        ':by'      => $by !== null ? mb_substr($by, 0, 80) : null,
    ];
    // Plain update-or-insert rather than ON DUPLICATE KEY UPDATE: identical on
    // MySQL, and it keeps the statement portable (the test harness runs it on
    // SQLite). The page_key primary key guards the insert.
    $exists = $pdo->prepare('SELECT 1 FROM cms_pages WHERE page_key = ?');
    $exists->execute([$key]);
    if ($exists->fetchColumn()) {
        $pdo->prepare('UPDATE cms_pages SET content = :content, meta = :meta, updated_at = :at, updated_by = :by
                        WHERE page_key = :key')->execute($params);
    } else {
        $pdo->prepare('INSERT INTO cms_pages (page_key, content, meta, updated_at, updated_by)
                       VALUES (:key, :content, :meta, :at, :by)')->execute($params);
    }
}

/**
 * The SEO overrides an admin has set for one page key (title, description,
 * keywords, ogImage, noindex), or null. Never throws: a database hiccup must
 * not take a public page down over its <title>.
 */
function ue_cms_meta(string $key): ?array
{
    try {
        $row = ue_cms_get($key);
        return $row['meta'] ?? null;
    } catch (Throwable $e) {
        error_log('ue_cms_meta: ' . $e->getMessage());
        return null;
    }
}

/** Fetch one page row (decoded) or null. */
function ue_cms_get(string $key): ?array
{
    $stmt = ue_db()->prepare('SELECT page_key, content, meta, updated_at, updated_by FROM cms_pages WHERE page_key = ?');
    $stmt->execute([$key]);
    $r = $stmt->fetch();
    if (!$r) {
        return null;
    }
    return [
        'page_key'   => $r['page_key'],
        'content'    => ue_cms_decode($r['content']),
        'meta'       => ue_cms_decode($r['meta']),
        'updated_at' => $r['updated_at'],
        'updated_by' => $r['updated_by'],
    ];
}
