<?php
/**
 * UeCampus Blog — public router (server-rendered).
 * =============================================================================
 * All /blog/* traffic is rewritten here by the docroot .htaccess. This file
 * decides what to render from the request path:
 *
 *   /blog                 -> index (list of published posts, paginated)
 *   /blog/sitemap.xml     -> XML sitemap of the blog (for Google Search Console)
 *   /blog/feed.xml        -> RSS 2.0 feed
 *   /blog/{slug}          -> a single published post (full SEO markup)
 *   anything else / unknown slug -> styled 404 with a proper 404 status
 *
 * Nothing here is linked from the site's main navigation; discovery happens via
 * the sitemap, organic search, and the footer backlink. Each rendered page,
 * however, links back into the marketing site (header, footer, in-article CTA)
 * so link equity flows to the money pages.
 */

require __DIR__ . '/_core.php';
require_once __DIR__ . '/../api/_cms.php';             // ue_cms_meta(): SEO tags set in /admin/seo

$base = blog_base();                                   // e.g. "/blog"
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$rel  = urldecode(substr($path, strlen($base)));       // "", "/", "/slug", …
$rel  = trim($rel, '/');

if ($rel === '' || $rel === 'index.php') {
    blog_route_index();
} elseif ($rel === 'sitemap.xml') {
    blog_route_sitemap();
} elseif ($rel === 'feed.xml') {
    blog_route_feed();
} else {
    blog_route_post($rel);
}
exit;

// ===========================================================================

/** Blog index — masthead, category filter, search, hero + grid, pagination. */
function blog_route_index(): void
{
    $perPage  = 9;
    $page     = max(1, (int) ($_GET['page'] ?? 1));
    $category = isset($_GET['category']) ? trim((string) $_GET['category']) : '';
    $q        = isset($_GET['q']) ? trim((string) $_GET['q']) : '';

    $res   = blog_list_published([
        'category' => $category,
        'q'        => $q,
        'limit'    => $perPage,
        'offset'   => ($page - 1) * $perPage,
    ]);
    $posts = $res['posts'];
    $total = $res['total'];
    $pages = max(1, (int) ceil($total / $perPage));
    $cats  = blog_categories();

    $canonicalPath = $base = blog_base();
    if ($page > 1) {
        $canonicalPath .= '?page=' . $page;
    }

    // Blog structured data (each post as a BlogPosting node).
    $schema = [
        '@context'    => 'https://schema.org',
        '@type'       => 'Blog',
        'name'        => 'UeCampus Blog',
        'url'         => blog_abs($base),
        'description' => 'Guides on online study, UK qualifications, careers and degree recognition from the UeCampus academic team.',
        'publisher'   => blog_publisher_node(),
        'blogPost'    => array_map(static fn($p) => [
            '@type'         => 'BlogPosting',
            'headline'      => $p['title'],
            'url'           => blog_abs(blog_base() . '/' . $p['slug']),
            'datePublished' => blog_iso_date($p['published_at']),
        ], $posts),
    ];
    $breadcrumb = [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => blog_site_url() . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => blog_abs($base)],
        ],
    ];

    // The blog index's SEO tags can be overridden from the admin console
    // (/admin/seo, row "/blog") like every other page; the keys and defaults
    // here mirror src/pages/AdminSeo.tsx.
    $cms = ue_cms_meta('/blog') ?? [];
    $titleSuffix = $page > 1 ? " — Page $page" : '';
    blog_head([
        'title'       => ($cms['title'] ?? 'Blog | Online Study, Careers & Qualifications | UeCampus') . $titleSuffix,
        'description' => $cms['description'] ?? 'Guides on online study, UK qualifications, career growth and degree recognition from the UeCampus academic team.',
        'keywords'    => $cms['keywords'] ?? 'online education blog, distance learning tips, online study advice, uecampus blog',
        'canonical'   => $canonicalPath,
        'image'       => $cms['ogImage'] ?? blog_default_image(),
        'robots'      => empty($cms['noindex']),
        'type'        => 'website',
        'schema'      => [$schema, $breadcrumb],
    ]);

    $hero = null;
    $rest = $posts;
    if ($page === 1 && $category === '' && $q === '' && $posts) {
        $hero = array_shift($rest);
    }
    ?>
<section class="bl-mast">
  <div class="bl-wrap">
    <p class="eyebrow">The UeCampus journal</p>
    <h1 class="serif">Insights &amp; <i>guides</i><span class="dot">.</span></h1>
    <p>Long reads and short takes on online study, UK qualifications, careers and what a recognised degree actually gets you.</p>

    <div class="bl-filter">
      <form method="get" action="<?= e($base) ?>">
        <span class="eyebrow">Search</span>
        <input type="search" name="q" value="<?= e($q) ?>" placeholder="Search articles…" aria-label="Search articles">
      </form>
      <div class="bl-chips">
        <a class="bl-chip <?= $category === '' ? 'on' : '' ?>" href="<?= e($base) ?>">All</a>
        <?php foreach ($cats as $c): ?>
          <a class="bl-chip <?= $category === $c ? 'on' : '' ?>" href="<?= e($base . '?category=' . rawurlencode($c)) ?>"><?= e($c) ?></a>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>

<?php if (!$posts): ?>
  <div class="bl-empty">
    <h1 class="serif">Nothing here yet.</h1>
    <p><?= $q !== '' || $category !== '' ? 'No articles match your search.' : 'The first articles are on their way.' ?></p>
    <a class="bl-btn" href="<?= e(blog_site_url()) ?>/programmes">Browse programmes</a>
  </div>
<?php else: ?>

  <?php if ($hero): $img = blog_card_image($hero); ?>
  <section class="bl-section" style="padding-bottom:24px">
    <div class="bl-wrap">
      <a class="bl-hero" href="<?= e($base . '/' . $hero['slug']) ?>">
        <figure>
          <?php if ($img): ?><span class="bl-tag">Latest</span><img src="<?= e($img) ?>" alt="<?= e($hero['cover_alt'] ?: $hero['title']) ?>" loading="eager">
          <?php endif; ?>
        </figure>
        <div>
          <?php if ($hero['category']): ?><p class="eyebrow" style="color:var(--plum)"><?= e($hero['category']) ?></p><?php endif; ?>
          <h2 class="serif"><?= e($hero['title']) ?></h2>
          <p class="lede"><?= e($hero['excerpt']) ?></p>
          <p class="eyebrow" style="margin-top:16px"><?= e(blog_human_date($hero['published_at'])) ?> · <?= blog_read_time($hero['body']) ?> min read</p>
          <span class="readmore">Read full article →</span>
        </div>
      </a>
    </div>
  </section>
  <?php endif; ?>

  <section class="bl-section" style="padding-top:24px">
    <div class="bl-wrap">
      <div class="bl-grid">
        <?php foreach ($rest as $p): $img = blog_card_image($p); ?>
          <a class="bl-card" href="<?= e($base . '/' . $p['slug']) ?>">
            <figure><?php if ($img): ?><img src="<?= e($img) ?>" alt="<?= e($p['cover_alt'] ?: $p['title']) ?>" loading="lazy"><?php endif; ?></figure>
            <?php if ($p['category']): ?><p class="eyebrow cat"><?= e($p['category']) ?></p><?php endif; ?>
            <h3 class="serif"><?= e($p['title']) ?></h3>
            <p><?= e($p['excerpt']) ?></p>
            <p class="eyebrow meta"><?= e(blog_human_date($p['published_at'])) ?> · <?= blog_read_time($p['body']) ?> min read</p>
          </a>
        <?php endforeach; ?>
      </div>

      <?php if ($pages > 1): ?>
      <nav class="bl-pager" aria-label="Pagination">
        <?php
          $qs = static function (int $n) use ($base, $category, $q): string {
              $p = [];
              if ($category !== '') { $p['category'] = $category; }
              if ($q !== '')        { $p['q'] = $q; }
              if ($n > 1)           { $p['page'] = $n; }
              return $base . ($p ? '?' . http_build_query($p) : '');
          };
        ?>
        <?php if ($page > 1): ?><a href="<?= e($qs($page - 1)) ?>">← Prev</a><?php endif; ?>
        <?php for ($n = 1; $n <= $pages; $n++): ?>
          <?php if ($n === $page): ?><span class="on"><?= $n ?></span>
          <?php else: ?><a href="<?= e($qs($n)) ?>"><?= $n ?></a><?php endif; ?>
        <?php endfor; ?>
        <?php if ($page < $pages): ?><a href="<?= e($qs($page + 1)) ?>">Next →</a><?php endif; ?>
      </nav>
      <?php endif; ?>
    </div>
  </section>
<?php endif; ?>
<?php
    blog_foot();
}

/** Single post page. */
function blog_route_post(string $slug): void
{
    // Only accept a clean single-segment slug; anything else is a 404.
    if (strpos($slug, '/') !== false || !preg_match('/^[a-z0-9\-]+$/i', $slug)) {
        blog_route_404();
        return;
    }
    $post = blog_find_by_slug($slug);
    if (!$post) {
        blog_route_404();
        return;
    }
    blog_increment_views((int) $post['id']);

    $base    = blog_base();
    $url     = blog_abs($base . '/' . $post['slug']);
    $img     = blog_card_image($post);
    $imgAbs  = $img ? blog_abs($img) : blog_default_image();
    $metaT   = $post['meta_title'] ?: ($post['title'] . ' | UeCampus');
    $metaD   = $post['meta_description'] ?: ($post['excerpt'] ?: blog_auto_excerpt($post['body']));
    $tags    = array_filter(array_map('trim', explode(',', (string) $post['tags'])));

    $article = [
        '@context'         => 'https://schema.org',
        '@type'            => 'BlogPosting',
        'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $url],
        'headline'         => mb_substr($post['title'], 0, 110),
        'description'      => $metaD,
        'image'            => [$imgAbs],
        'datePublished'    => blog_iso_date($post['published_at']),
        'dateModified'     => blog_iso_date($post['updated_at'] ?: $post['published_at']),
        'author'           => ['@type' => 'Organization', 'name' => $post['author'] ?: 'UeCampus', 'url' => blog_site_url()],
        'publisher'        => blog_publisher_node(),
        'inLanguage'       => 'en-GB',
    ];
    if ($post['category']) {
        $article['articleSection'] = $post['category'];
    }
    if ($tags) {
        $article['keywords'] = implode(', ', $tags);
    }
    $breadcrumb = [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => blog_site_url() . '/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => blog_abs($base)],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $post['title'], 'item' => $url],
        ],
    ];

    blog_head([
        'title'          => $metaT,
        'description'    => $metaD,
        'keywords'       => $post['keywords'] ?: ($tags ? implode(', ', $tags) : null),
        'canonical'      => $base . '/' . $post['slug'],
        'image'          => $imgAbs,
        'type'           => 'article',
        'published_time' => blog_iso_date($post['published_at']),
        'modified_time'  => blog_iso_date($post['updated_at'] ?: $post['published_at']),
        'author'         => $post['author'] ?: 'UeCampus',
        'section'        => $post['category'] ?: null,
        'schema'         => [$article, $breadcrumb],
    ]);
    ?>
<article class="bl-article">
  <div class="bl-wrap">
    <nav class="bl-breadcrumb" aria-label="Breadcrumb">
      <a href="<?= e(blog_site_url()) ?>/">Home</a> ›
      <a href="<?= e($base) ?>">Blog</a> ›
      <?php if ($post['category']): ?><a href="<?= e($base . '?category=' . rawurlencode($post['category'])) ?>"><?= e($post['category']) ?></a><?php endif; ?>
    </nav>
    <h1 class="serif"><?= e($post['title']) ?></h1>
    <?php if ($post['excerpt']): ?><p class="sub"><?= e($post['excerpt']) ?></p><?php endif; ?>
    <div class="byline">
      <span>By <?= e($post['author'] ?: 'UeCampus') ?></span>
      <span>·</span>
      <time datetime="<?= e(blog_iso_date($post['published_at'])) ?>"><?= e(blog_human_date($post['published_at'])) ?></time>
      <span>·</span>
      <span><?= blog_read_time($post['body']) ?> min read</span>
    </div>
  </div>

  <div class="bl-wrap">
    <?php if ($img): ?><figure class="bl-cover"><img src="<?= e($img) ?>" alt="<?= e($post['cover_alt'] ?: $post['title']) ?>"></figure><?php endif; ?>

    <div class="bl-body">
      <?= blog_render_body($post['body']) ?>
    </div>

    <?php if ($tags): ?>
    <div class="bl-tags">
      <?php foreach ($tags as $t): ?><span><?= e($t) ?></span><?php endforeach; ?>
    </div>
    <?php endif; ?>

    <!-- In-article CTA: internal backlinks to the money pages -->
    <div class="bl-inline-cta">
      <h3 class="serif">Thinking about studying online?</h3>
      <p>Explore accredited UeCampus programmes and UK diplomas, or speak to an admissions advisor about the next intake.</p>
      <a class="bl-btn" href="<?= e(blog_site_url()) ?>/programmes">Browse programmes</a>
      <a class="bl-btn bl-btn-ghost" href="<?= e(blog_site_url()) ?>/enquire-now">Enquire now</a>
    </div>
  </div>
</article>

<?php $related = blog_related((int) $post['id'], $post['category'], 3); ?>
<?php if ($related): ?>
<section class="bl-related">
  <div class="bl-wrap">
    <h2 class="serif">Keep reading</h2>
    <div class="bl-grid">
      <?php foreach ($related as $p): $ri = blog_card_image($p); ?>
        <a class="bl-card" href="<?= e($base . '/' . $p['slug']) ?>">
          <figure><?php if ($ri): ?><img src="<?= e($ri) ?>" alt="<?= e($p['cover_alt'] ?: $p['title']) ?>" loading="lazy"><?php endif; ?></figure>
          <?php if ($p['category']): ?><p class="eyebrow cat"><?= e($p['category']) ?></p><?php endif; ?>
          <h3 class="serif"><?= e($p['title']) ?></h3>
          <p><?= e($p['excerpt']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>
<?php
    blog_foot();
}

/** Styled 404 with a real 404 status (so crawlers don't index dead slugs). */
function blog_route_404(): void
{
    http_response_code(404);
    blog_head([
        'title'       => 'Article not found | UeCampus Blog',
        'description' => 'The article you were looking for could not be found.',
        'canonical'   => blog_base(),
        'robots'      => false,
    ]);
    ?>
<div class="bl-empty">
  <h1 class="serif">404</h1>
  <p>That article doesn’t exist or has been moved.</p>
  <a class="bl-btn" href="<?= e(blog_base()) ?>">Back to the blog</a>
</div>
<?php
    blog_foot();
}

/** Dynamic XML sitemap of the blog (index + every published post). */
function blog_route_sitemap(): void
{
    $base = blog_base();
    $res  = blog_list_published(['limit' => 5000, 'offset' => 0]);
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    echo "  <url>\n    <loc>" . e(blog_abs($base)) . "</loc>\n"
       . "    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n";

    foreach ($res['posts'] as $p) {
        $lastmod = blog_iso_date($p['updated_at'] ?: $p['published_at']);
        echo "  <url>\n";
        echo "    <loc>" . e(blog_abs($base . '/' . $p['slug'])) . "</loc>\n";
        if ($lastmod) {
            echo "    <lastmod>" . e($lastmod) . "</lastmod>\n";
        }
        echo "    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n";
        echo "  </url>\n";
    }
    echo '</urlset>';
}

/** RSS 2.0 feed of the latest published posts. */
function blog_route_feed(): void
{
    $base = blog_base();
    $res  = blog_list_published(['limit' => 30, 'offset' => 0]);
    header('Content-Type: application/rss+xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<rss version="2.0"><channel>' . "\n";
    echo '  <title>UeCampus Blog</title>' . "\n";
    echo '  <link>' . e(blog_abs($base)) . "</link>\n";
    echo '  <description>Insights on online study, UK qualifications and careers from UeCampus.</description>' . "\n";
    echo '  <language>en-gb</language>' . "\n";
    foreach ($res['posts'] as $p) {
        $link = blog_abs($base . '/' . $p['slug']);
        echo "  <item>\n";
        echo '    <title>' . e($p['title']) . "</title>\n";
        echo '    <link>' . e($link) . "</link>\n";
        echo '    <guid isPermaLink="true">' . e($link) . "</guid>\n";
        if ($p['published_at']) {
            echo '    <pubDate>' . e(gmdate('r', strtotime($p['published_at'] . ' UTC'))) . "</pubDate>\n";
        }
        echo '    <description>' . e($p['excerpt'] ?: blog_auto_excerpt($p['body'])) . "</description>\n";
        echo "  </item>\n";
    }
    echo '</channel></rss>';
}

// --- shared bits -----------------------------------------------------------

/** schema.org publisher node with logo (reused by Blog + BlogPosting). */
function blog_publisher_node(): array
{
    return [
        '@type' => 'Organization',
        'name'  => 'UeCampus',
        'url'   => blog_site_url(),
        'logo'  => [
            '@type' => 'ImageObject',
            'url'   => blog_site_url() . '/uecampus-logo.png',
        ],
        // Keep in step with SOCIAL_PROFILES in src/seo/siteMeta.ts.
        'sameAs' => [
            'https://www.instagram.com/join_uecampus/',
            'https://www.facebook.com/p/UeCampus-61572906104101/',
            'https://uk.linkedin.com/company/uecampus',
        ],
    ];
}

/** Resolve a card/cover image URL for a post (root-relative or absolute). */
function blog_card_image(array $post): string
{
    return trim((string) ($post['cover_image'] ?? ''));
}
