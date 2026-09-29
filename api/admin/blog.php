<?php
/**
 * Admin blog API — JSON (protected by Bearer token).
 * =============================================================================
 * Backs the Blog section of the React /admin console, so blog authoring lives
 * in the same portal as the enquiry leads instead of a second PHP panel.
 *
 * The blog engine itself (schema, slugs, save rules, SEO rendering) still lives
 * in blog/_core.php and is reused verbatim — this file only exposes it as JSON
 * and swaps the old session+CSRF auth for the same stateless Bearer token the
 * rest of /api/admin uses.
 *
 *   GET  /api/admin/blog.php            -> { ok, posts: [...], categories: [] }
 *   GET  /api/admin/blog.php?id=12      -> { ok, post: {...} }
 *   POST /api/admin/blog.php            -> { ok, id }        (JSON body, save)
 *   POST /api/admin/blog.php?action=delete  -> { ok }        (JSON body, {id})
 *   POST /api/admin/blog.php?action=upload  -> { ok, url }   (multipart, file)
 */

require __DIR__ . '/_token.php';           // auth (same token as the leads API)

ue_api_headers('GET, POST');

if (!ue_verify_token(ue_bearer_token())) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

// The blog engine lives in a sibling folder that is deployed separately from
// api/. If that upload is missing, nested one level too deep, unreadable, or
// truncated, a bare require dies as an empty 500 and the console can only say
// "Request failed". Load it guarded instead, so the console shows the actual
// problem and where the file was expected. Runs after the token check so the
// server path is only ever shown to a signed-in admin.
$engine = __DIR__ . '/../../blog/_core.php';
if (!is_file($engine) || !is_readable($engine)) {
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'Blog engine not found: expected ' . $engine . '. Re-upload the blog/ folder so it '
                 . 'sits next to api/ (not inside another blog/ folder), with folders 755 and files 644.',
    ]);
    exit;
}
try {
    require $engine;                         // the blog engine (schema + save rules)
} catch (Throwable $err) {
    error_log('admin/blog: blog/_core.php failed to load: ' . $err->getMessage());
    http_response_code(500);
    echo json_encode([
        'ok'    => false,
        'error' => 'Blog engine failed to load (' . get_class($err) . '): ' . $err->getMessage(),
    ]);
    exit;
}

/**
 * URL base of the blog, derived from THIS script's request path.
 *
 * blog_base() in _core.php reads the "/blog" segment of the request, which
 * isn't there on a request to /api/admin/blog.php, so uploads get their own
 * resolver: walk the three levels from <root>/api/admin/blog.php up to the app
 * root, then append /blog. Works at a docroot deploy ("/blog") and in a
 * subfolder ("/ue-replica/blog") alike.
 *
 * The request path is used rather than SCRIPT_NAME for the same reason as in
 * blog_base(): where the site is served from inside a public/ folder by an
 * internal rewrite, SCRIPT_NAME carries a "/public" prefix the browser never
 * sees, and it would be baked into the URL of every uploaded image.
 *
 * dirname() must be normalised before comparing: on Windows it returns "\" for
 * the root, which no amount of rtrim($x, '/') would strip.
 */
function blog_url_base(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if ($path === null || $path === false || $path === '') {
        $path = $_SERVER['SCRIPT_NAME'] ?? '/api/admin/blog.php';
    }
    $root = str_replace('\\', '/', dirname($path, 3));
    $root = ($root === '/' || $root === '.') ? '' : rtrim($root, '/');
    return $root . '/blog';
}

/** Read and decode the JSON request body. */
function blog_json_body(): array
{
    $raw  = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** Store an uploaded image under blog/uploads/YYYY/MM and return its URL. */
function blog_store_upload(?array $file): array
{
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return ['ok' => false, 'error' => 'No file received.'];
    }
    if (($file['size'] ?? 0) > 8 * 1024 * 1024) {
        return ['ok' => false, 'error' => 'File too large (max 8 MB).'];
    }
    $allowed = [
        'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp',
        'image/gif'  => 'gif', 'image/avif' => 'avif',
    ];
    $mime = function_exists('finfo_open')
        ? finfo_file(finfo_open(FILEINFO_MIME_TYPE), $file['tmp_name'])
        : ($file['type'] ?? '');
    if (!isset($allowed[$mime])) {
        return ['ok' => false, 'error' => 'Only JPG, PNG, WebP, GIF or AVIF images are allowed.'];
    }

    $subdir = gmdate('Y/m');
    $dir    = dirname(__DIR__, 2) . '/blog/uploads/' . $subdir;
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        return ['ok' => false, 'error' => 'Could not create the uploads directory.'];
    }

    $safe = blog_slugify(pathinfo((string) $file['name'], PATHINFO_FILENAME));
    $name = $safe . '-' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $allowed[$mime];
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $name)) {
        return ['ok' => false, 'error' => 'Failed to store the upload.'];
    }

    return ['ok' => true, 'url' => blog_url_base() . '/uploads/' . $subdir . '/' . $name];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

try {
    // --- Read -------------------------------------------------------------
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $post = blog_find_by_id((int) $_GET['id']);
            if (!$post) {
                http_response_code(404);
                echo json_encode(['ok' => false, 'error' => 'Post not found']);
                exit;
            }
            echo json_encode([
                'ok'         => true,
                'post'       => $post,
                'categories' => blog_categories(),
                'blog_base'  => blog_url_base(),
            ]);
            exit;
        }

        // List view never needs the full body — drop it to keep the payload small.
        $posts = array_map(static function (array $p): array {
            unset($p['body']);
            return $p;
        }, blog_all());

        echo json_encode([
            'ok'         => true,
            'posts'      => $posts,
            'categories' => blog_categories(),
            'blog_base'  => blog_url_base(),
        ]);
        exit;
    }

    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
        exit;
    }

    // --- Image upload (multipart) ----------------------------------------
    if ($action === 'upload') {
        echo json_encode(blog_store_upload($_FILES['file'] ?? null));
        exit;
    }

    $body = blog_json_body();

    // --- Delete -----------------------------------------------------------
    if ($action === 'delete') {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'A post id is required']);
            exit;
        }
        blog_delete($id);
        echo json_encode(['ok' => true]);
        exit;
    }

    // --- Save (create / update) -------------------------------------------
    if (trim((string) ($body['title'] ?? '')) === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'A title is required']);
        exit;
    }

    $id = blog_save([
        'id'               => (int) ($body['id'] ?? 0),
        'title'            => $body['title'] ?? '',
        'slug'             => $body['slug'] ?? '',
        'excerpt'          => $body['excerpt'] ?? '',
        'body'             => $body['body'] ?? '',
        'cover_image'      => $body['cover_image'] ?? '',
        'cover_alt'        => $body['cover_alt'] ?? '',
        'category'         => $body['category'] ?? '',
        'tags'             => $body['tags'] ?? '',
        'author'           => $body['author'] ?? '',
        'meta_title'       => $body['meta_title'] ?? '',
        'meta_description' => $body['meta_description'] ?? '',
        'keywords'         => $body['keywords'] ?? '',
        'status'           => $body['status'] ?? 'draft',
    ]);

    echo json_encode(['ok' => true, 'id' => $id, 'post' => blog_find_by_id($id)]);
} catch (Throwable $err) {
    error_log('admin/blog: ' . $err->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error — please try again.']);
}
