<?php
/**
 * Admin CMS API — JSON (protected by Bearer token).
 *
 *   GET  /api/admin/content.php                  -> { ok, version, pages: {key: {content, meta, updated_at, updated_by}} }
 *   POST /api/admin/content.php                  -> { ok, page }   body: { page_key, content: {}|null, meta: {}|null }
 *   POST /api/admin/content.php?action=reset     -> { ok }         body: { page_key }
 *
 * `content` is the sparse override object the React editor computes (only the
 * fields that differ from the compiled defaults). The public feed
 * (api/content.php) serves the same rows to the site.
 */

require __DIR__ . '/_token.php';
require __DIR__ . '/../_cms.php';

ue_api_headers('GET, POST');

$user = ue_verify_token(ue_bearer_token());
if (!$user) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

try {
    if ($method === 'GET') {
        $pages = ue_cms_all();
        echo json_encode([
            'ok'      => true,
            'version' => ue_cms_version($pages),
            'pages'   => (object) $pages,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    $raw  = file_get_contents('php://input') ?: '';
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid JSON body']);
        exit;
    }

    $key = trim((string) ($body['page_key'] ?? ''));
    if (!ue_cms_valid_key($key)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'Invalid page key']);
        exit;
    }

    if ($action === 'reset') {
        ue_cms_save($key, null, null, $user);
        echo json_encode(['ok' => true]);
        exit;
    }

    // Partial updates: a key that is absent from the body keeps its stored
    // value, so the SEO table can save tags without touching a page's text
    // overrides (and vice versa). An explicit null clears that column.
    $existing = ue_cms_get($key);
    $content  = array_key_exists('content', $body) ? $body['content'] : ($existing['content'] ?? null);
    $meta     = array_key_exists('meta', $body)    ? $body['meta']    : ($existing['meta'] ?? null);
    if ($content !== null && !is_array($content)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'content must be an object or null']);
        exit;
    }
    if ($meta !== null && !is_array($meta)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'meta must be an object or null']);
        exit;
    }
    // A JSON "{}" arrives as an empty PHP array; treat it as "nothing set".
    if ($content === []) {
        $content = null;
    }

    ue_cms_save($key, $content, ue_cms_clean_meta($meta), $user);

    echo json_encode(['ok' => true, 'page' => ue_cms_get($key)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $err) {
    error_log('admin/content: ' . $err->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error — please try again.']);
}
