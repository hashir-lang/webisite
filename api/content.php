<?php
/**
 * Public site-content feed — JSON, no auth.
 *
 * The React app fetches this once on boot and again on each full page load,
 * merges it over the copy compiled into the bundle, and re-renders. That is
 * what lets an admin change any page's text or SEO tags from /admin without a
 * rebuild or redeploy.
 *
 *   GET /api/content.php  ->  { ok: true, version: "<latest updated_at>",
 *                                pages: { "<page_key>": { content: {...}|null,
 *                                                         meta: {...}|null } } }
 *
 * Only pages with overrides are listed. The response carries an ETag derived
 * from the newest change, so repeat loads are a cheap 304 until something is
 * edited.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, If-None-Match');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

require __DIR__ . '/_db.php';
require __DIR__ . '/_cms.php';

try {
    $pages   = ue_cms_all();
    $version = ue_cms_version($pages);
    $etag    = '"cms-' . md5($version . ':' . count($pages)) . '"';

    header('ETag: ' . $etag);
    $ifNoneMatch = trim((string) ($_SERVER['HTTP_IF_NONE_MATCH'] ?? ''));
    if ($ifNoneMatch !== '' && $ifNoneMatch === $etag) {
        http_response_code(304);
        exit;
    }

    $out = [];
    foreach ($pages as $key => $row) {
        $out[$key] = ['content' => $row['content'], 'meta' => $row['meta']];
    }
    echo json_encode(['ok' => true, 'version' => $version, 'pages' => (object) $out], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    error_log('content.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not load site content.']);
}
