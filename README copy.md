# UeCampus website

React + Vite front end (prerendered to static HTML for SEO), a PHP/MySQL backend
under `api/`, and a PHP-rendered blog under `blog/`. One admin console at
`/admin` covers enquiries, contact messages, sign-ins, the blog, and — via the
CMS — every piece of text and every SEO tag on the site.

```
npm run dev          # Vite dev server (API calls go to local XAMPP, see src/lib/api.ts)
npm run build        # vite build + sitemap + prerender of every route into dist/
npm test             # vitest
```

Deploy: upload `dist/` (the site), `api/` and `blog/` to the document root.
`api/.env` holds the DB/SMTP/CRM credentials and is never overwritten by a
build — see `api/.env.example`.

## The CMS — change any text or SEO tag without a redeploy

Sign in at `/admin` and open **Pages & content** or **SEO tags**.

- **Pages & content** lists every page. Each page's editor is generated from
  the copy the page ships with: headings, paragraphs, buttons, bullet lists,
  cards, FAQs, testimonials, form labels and messages. Strings can be changed
  or blanked (an empty field renders nothing — that is how you remove text);
  lists get *Add / Remove / move up / move down*. Every field shows when it
  differs from the original and has its own **Reset**; **Reset page** clears
  the whole page.
- **Popups & chat** covers the welcome sign-in popup, the cookie banner and
  the support chatbot — its messages and all of its FAQ answers (add, change
  or remove an answer and the chatbot's search index rebuilds from the saved
  list).
- **Programmes and partners** appear in the same list (searchable): each
  programme page's own text — title, tagline, overview, what you'll gain,
  modules/units, entry requirements, careers, payment plans, scholarships —
  and each partner's description, highlights, facts and recognition points.
  Edits apply everywhere the record is shown (its page, the catalogue, related
  cards, the Apply dropdown). The data files in `src/data` stay the source of
  truth for anything not edited (see `src/cms/records.ts`).
- **SEO tags** shows the title tag, meta description and keywords of *every*
  route — static pages, all programme pages, all partner pages — with
  character counts, inline editing, an Open Graph image field and a
  `noindex` switch.
- Saving is live immediately: the site fetches `api/content.php` on every
  page load and lays the saved overrides over the compiled copy.

### How it works

```
src/cms/defaults/<page>.ts   the copy each page ships with (the "schema")
src/cms/registry.ts          page key -> label, route, SEO defaults, defaults module
src/cms/useContent.ts        useContent("about") = defaults ⊕ saved overrides
src/cms/ContentProvider.tsx  fetches the overrides once; embeds them in prerenders
src/cms/merge.ts             mergeContent / diffContent (arrays replace wholesale)
src/components/admin/ContentEditor.tsx   the form generated from a defaults object
api/content.php              public feed (ETag / 304), api/admin/content.php admin API
api/_cms.php                 cms_pages table access
```

Only the *differences* from the defaults are stored (a sparse JSON object per
page in `cms_pages`), so when the code's wording changes later, untouched
fields follow the code. Overrides of the wrong shape are ignored, so a stale
row can never break a page. SEO overrides are keyed by route path and applied
by `<Seo>` for every page automatically.

**Prerendering:** `scripts/prerender.mjs` lets the app fetch the feed while
rendering, waits for it, and the snapshot carries the saved content plus a
`<script id="ue-cms">` copy that the live page boots from (so hydration
matches). Visitors always get the latest overrides at runtime; the static HTML
crawlers see refreshes on the next `npm run build`. Google renders JavaScript,
so it sees live content either way.

### Adding editable text to a new page

1. Put the page's copy in `src/cms/defaults/<key>.ts` as a plain object
   (strings, string arrays, arrays of same-shaped objects, nested objects).
2. `const c = useContent("<key>")` in the component and render from `c`.
   Guard optional text with `{c.x && …}` and lists with `.length > 0`.
3. Register the key in `src/cms/registry.ts` (label, route, `PAGE_META` entry).
   Optional: `labels` for friendlier field names, `templates` for lists whose
   default is empty (what "Add" inserts).

Nothing else changes — the admin editor, the feed and the SEO table pick the
page up from the registry.
