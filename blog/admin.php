<?php
/**
 * UeCampus Blog — legacy admin entry point.
 * =============================================================================
 * Blog authoring moved into the main admin console at /admin/blog, alongside
 * the enquiry leads and sign-ins: one portal, one sidebar, one login.
 *
 * This file stays only so old bookmarks and links don't 404 — it redirects to
 * the new location. The blog engine itself is unchanged and still lives in
 * _core.php (public pages) with a JSON API at /api/admin/blog.php.
 */

// App root from the REQUEST path: /ue-replica/blog/admin.php -> /ue-replica
// (and /blog/admin.php -> "" for a docroot deploy). The request path is used
// rather than SCRIPT_NAME because a site served from inside a public/ folder by
// an internal rewrite has a "/public" prefix in SCRIPT_NAME that the browser
// never sees — redirecting there would send the admin to /public/admin/blog.
// Normalise before comparing: on Windows dirname() returns "\" for the root,
// which rtrim($x, '/') misses.
$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
if ($path === null || $path === false || $path === '') {
    $path = $_SERVER['SCRIPT_NAME'] ?? '/blog/admin.php';
}
$root = str_replace('\\', '/', dirname($path, 2));
$root = ($root === '/' || $root === '.') ? '' : rtrim($root, '/');

header('X-Robots-Tag: noindex, nofollow');
header('Location: ' . $root . '/admin/blog', true, 301);
echo 'The blog admin has moved to /admin/blog.';
