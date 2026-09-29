// Prerenders every indexable route to static HTML so crawlers and social
// scrapers receive fully-formed markup (title, meta, JSON-LD, visible copy)
// without executing JavaScript. Runs after `vite build`:
//
//   1. Serves the built dist/ folder locally with an SPA fallback.
//   2. Loads each route in headless Chrome, waits for the app + Helmet to render.
//   3. Writes the resulting HTML to dist/<route>/index.html.
//
// On the client, src/main.tsx sees the prerendered markup in #root and calls
// hydrateRoot(), so the page becomes interactive with no re-render flash.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { getAllRoutes } from "./routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const BASE_PORT = 45678;
const CONCURRENCY = 3;
const MAX_ATTEMPTS = 3;
let PORT = BASE_PORT;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function createServer(shell) {
  return http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(distDir, urlPath);
      // Serve real asset files directly; every navigation gets the pristine SPA
      // shell so the client router renders each route from a clean slate.
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[".html"] });
      res.end(shell);
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });
}

function outputPathFor(route) {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.replace(/^\//, ""), "index.html");
}

// Self-healing browser: a crash under load (ConnectionClosedError) simply
// nulls the reference; the next render relaunches Chrome automatically.
let browser = null;
let launching = null;
async function getBrowser() {
  if (browser && browser.connected) return browser;
  // Single-flight relaunch: concurrent workers share one launch, so a crash
  // never spawns multiple browsers.
  if (!launching) {
    launching = (async () => {
      if (browser) { try { await browser.close(); } catch { /* already dead */ } }
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      });
      launching = null;
      return browser;
    })();
  }
  return launching;
}

async function renderRoute(route, attempts = MAX_ATTEMPTS) {
  let lastError = "";
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const result = await renderOnce(route);
    if (result.ok) return result;
    lastError = result.error;
  }
  return { route, ok: false, error: lastError };
}

async function renderOnce(route) {
  let page;
  try {
    const b = await getBrowser();
    page = await b.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    // Flag the environment as a prerender BEFORE any app code runs, so purely
    // client-side overlays (sign-in popup, cookie banner) opt out of the static
    // HTML and never bake in a scroll lock or modal markup.
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDER__ = true;
    });
    // Abort third-party requests (Google Fonts, Tag Manager, analytics). They
    // are irrelevant to the prerendered HTML and can stall network-idle waits.
    // The one outside request allowed through is the CMS feed: the app waits
    // for it (src/cms/ContentProvider.tsx) so the snapshot carries the copy
    // and SEO tags an admin has set, not just the compiled defaults. If it is
    // unreachable the fetch fails fast and the defaults are used.
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.startsWith(`http://127.0.0.1:${PORT}`) ||
        url.startsWith("data:") ||
        /\/api\/content\.php(\?|$)/.test(url)
      ) {
        req.continue();
      } else {
        req.abort();
      }
    });
    await page.goto(`http://127.0.0.1:${PORT}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    // Wait until the app has mounted AND react-helmet-async has flushed its
    // <head> tags. Helmet writes the canonical link (and title/meta/JSON-LD) in
    // an effect after the first render, so we gate on the canonical link's
    // presence — not just document.title, which is truthy from the static shell.
    await page.waitForFunction(
      () => {
        const r = document.getElementById("root");
        const canonical = document.querySelector('link[rel="canonical"]');
        return r && r.childElementCount > 0 && !!canonical;
      },
      { timeout: 30000, polling: 100 },
    );
    // Safety net: clear any inline body scroll-lock a modal may have set before
    // we serialize, so the static HTML is always scrollable.
    const html = await page.evaluate(() => {
      document.body.style.overflow = "";
      return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    });
    const outPath = outputPathFor(route);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, "utf8");
    return { route, ok: true };
  } catch (err) {
    return { route, ok: false, error: err.message };
  } finally {
    if (page) { try { await page.close(); } catch { /* browser may be gone */ } }
  }
}

async function main() {
  if (!fs.existsSync(path.join(distDir, "index.html"))) {
    console.error("[prerender] dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }

  const routes = await getAllRoutes();
  // Pristine SPA shell: read the built index.html once and force an empty #root
  // so navigations always boot the client app fresh, even on re-runs where
  // dist/index.html has already been overwritten with prerendered home markup.
  const shell = fs
    .readFileSync(path.join(distDir, "index.html"), "utf8")
    .replace(/<div id="root">[\s\S]*<\/div>(?=\s*<\/body>)/, '<div id="root"></div>')
    // Drop the shell's fallback <title> so Helmet's per-page title is the only
    // one baked into the prerendered <head> (avoids duplicate title tags).
    // Anchored to type/charset-free <title> so it can't match text in comments.
    .replace(/<title>[^<]*<\/title>/, "")
    // Drop any CMS snapshot a previous run embedded, so every route boots
    // clean and fetches the current content rather than trusting stale JSON.
    .replace(/<script id="ue-cms"[^>]*>[\s\S]*?<\/script>/, "");
  const server = createServer(shell);
  // Bind to the first free port from BASE_PORT (a crashed prior run may still
  // hold the default port for a moment).
  await new Promise((resolve, reject) => {
    let tries = 0;
    const tryListen = () => {
      PORT = BASE_PORT + tries;
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE" && tries < 20) {
          tries += 1;
          setTimeout(tryListen, 100);
        } else {
          reject(err);
        }
      });
      server.listen(PORT, "127.0.0.1", () => resolve());
    };
    tryListen();
  });

  await getBrowser();

  console.log(`[prerender] rendering ${routes.length} routes...`);
  const queue = [...routes];
  const failures = [];
  let done = 0;

  async function worker() {
    while (queue.length) {
      const route = queue.shift();
      const result = await renderRoute(route);
      done += 1;
      if (result.ok) {
        process.stdout.write(`\r[prerender] ${done}/${routes.length} ok  `);
      } else {
        failures.push(result);
        console.warn(`\n[prerender] FAILED ${route}: ${result.error}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Retry any stragglers sequentially — the first concurrent batch occasionally
  // times out while a cold browser parses the main bundle under load.
  if (failures.length) {
    const retry = failures.splice(0, failures.length).map((f) => f.route);
    console.log(`\n[prerender] retrying ${retry.length} route(s) sequentially...`);
    for (const route of retry) {
      const result = await renderRoute(route);
      if (!result.ok) {
        failures.push(result);
        console.warn(`[prerender] RETRY FAILED ${route}: ${result.error}`);
      }
    }
  }

  if (browser) { try { await browser.close(); } catch { /* noop */ } }
  await new Promise((resolve) => server.close(resolve));

  console.log(`\n[prerender] done. ${routes.length - failures.length}/${routes.length} succeeded.`);
  if (failures.length) {
    console.error(`[prerender] ${failures.length} route(s) failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[prerender] fatal:", err);
  process.exit(1);
});
