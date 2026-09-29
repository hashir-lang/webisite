# UeCampus Blog — server-rendered SEO blog

A self-contained, PHP-rendered blog that lives next to the `/api` backend. Every
public page is emitted as fully-formed HTML with complete SEO markup, so a post
goes **live the instant you publish it — no React rebuild** and crawlers get the
full content immediately.

The blog is **not** linked from the site's main navigation. It's discoverable
only via the blog sitemap, organic search, and the discreet footer backlink —
exactly the "hidden but indexable" behaviour requested.

## URLs

| URL                     | What it serves                                            |
|-------------------------|-----------------------------------------------------------|
| `/blog`                 | Article index (paginated, category filter, search)        |
| `/blog/{slug}`          | A single published post (full SEO)                        |
| `/blog/sitemap.xml`     | XML sitemap of the blog (submit to Google Search Console) |
| `/blog/feed.xml`        | RSS 2.0 feed                                               |
| `/admin/blog`           | Where you write — the Blog section of the admin console   |
| `/api/admin/blog.php`   | JSON API the admin console talks to (Bearer token)        |

> `/blog/admin.php` was the old standalone panel. It now 301s to `/admin/blog`
> — there is one portal, one sidebar, one login.

## Writing & publishing

1. Go to `https://uecampus.com/admin` and sign in (the `admin_users` table —
   default `admin` / `Uecampus@online`). Same login as enquiries and sign-ins.
2. Click **Blog** in the sidebar.
3. **+ New article** → write with the rich-text editor, upload a cover image,
   set the slug / category / tags and (optional) SEO overrides.
4. **Publish** → the post is live at `/blog/{slug}` immediately and appears in
   `/blog/sitemap.xml`. **Save draft** keeps it unlisted.

## SEO built in

- Per-post `<title>`, meta description, canonical URL, keywords
- Open Graph + Twitter Card tags (with cover image)
- JSON-LD `BlogPosting` **and** `BreadcrumbList` structured data
- `Blog` schema on the index
- Dynamic `sitemap.xml` + RSS feed
- Proper `404` status for unknown slugs (no thin/dead pages indexed)
- Internal backlinks from every post to `/programmes`, `/courses`, `/enquire-now`
  (link equity flows to the money pages)

## How it's wired

- The docroot `.htaccess` (from `public/.htaccess`, copied to `dist/` on build)
  routes `/blog/*` to `blog/index.php`, while serving real files (the router,
  `admin.php`, uploaded images) directly. See rule **1b**.
- `robots.txt` references `/blog/sitemap.xml` and disallows `/admin`.
- The React footer has a hard `<a href="/blog">` backlink ("Insights & guides").
- Data lives in a new `blog_posts` MySQL table, auto-created on first use via the
  shared `api/_db.php` connection. **No manual SQL import needed.**
- `_core.php` is the engine (schema, slugs, save rules, public SEO rendering).
  `index.php` renders the public pages from it; `api/admin/blog.php` exposes the
  same data access as JSON for the admin console. Authoring auth is the shared
  Bearer token from `/api/admin/login.php` — the blog has no session login of
  its own any more.

## Deploying

Upload the `blog/` folder to the **document root**, as a sibling of `api/`
(same place, same way you deploy `api/`). Final layout on the server:

```
<docroot>/
  index.html          ← React app (dist/)
  .htaccess           ← contains the /blog routing rule (rule 1b)
  robots.txt          ← references /blog/sitemap.xml
  api/                ← existing PHP backend
  blog/               ← THIS folder
    index.php
    admin.php         ← legacy redirect to /admin/blog
    _core.php
    .htaccess
    uploads/          ← created automatically; must be writable by PHP
```

Make sure `blog/uploads/` is writable by the web server (0755). It's created
automatically on the first image upload if the parent is writable.

### What needs the React build vs. what doesn't

- **Drop-in, no rebuild:** the `blog/` folder and `api/`. Published posts render
  from PHP, so they go live without touching the React bundle.
- **Needs `npm run build`:** the admin console itself. The editor at
  `/admin/blog` and the footer backlink both live in React source, so deploy
  `dist/` alongside `api/admin/blog.php` — the editor calls that endpoint, and
  neither half is useful without the other.

## After first deploy

1. Publish a post or two.
2. In Google Search Console, submit `https://uecampus.com/blog/sitemap.xml`.

## Troubleshooting

**Article links 404 unless you type `/public` into the URL.**
Fixed in `blog_base()`. Some hosting serves the site from inside a `public/`
folder that Apache rewrites into internally, so PHP sees
`SCRIPT_NAME = /public/blog/index.php` while the browser is on `/blog/<slug>`.
The router used to derive its mount point from `SCRIPT_NAME`, so it sliced
`strlen("/public/blog")` characters off the request path and ate the first
characters of every slug — every article 404'd, and every canonical / sitemap /
internal link was emitted with `/public/` in it. The mount point is now read
from the requested URL instead, which is the same under either layout.

Content written while the bug was live is repaired automatically. Images
uploaded then, and any link pasted in from the address bar, had
`/public/...` baked into the stored post HTML; `blog_repair_public_urls()`
strips it from every existing row on the first request after deploy — nothing
to run by hand. It is idempotent and self-skipping (once the content is clean
its guard matches no rows), and deliberately narrow: only link/image attributes
and absolute URLs pointing back at this site are rewritten, so a post that
merely *writes about* `/public/`, or links to `example.org/public/…`, is left
alone. `blog_save()` applies the same normalisation, so new posts can't
reintroduce it.

Also deploy the updated `ROOT-htaccess-for-server.txt` (or `public/.htaccess`,
depending on where the domain points) — both 301 any lingering `/public/...`
URL to the clean one, which covers links already shared or indexed.
