// Generates dist/sitemap.xml from the live route list (static pages + every
// non-hidden course page). Run after `vite build`, before/after prerender.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes } from "./routes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://uecampus.com";
const distDir = path.join(root, "dist");

// Higher priority / more frequent change for hub pages; course pages a touch lower.
function meta(route) {
  if (route === "/") return { priority: "1.0", changefreq: "weekly" };
  if (["/programmes", "/courses"].includes(route))
    return { priority: "0.9", changefreq: "weekly" };
  if (route.startsWith("/programmes/"))
    return { priority: "0.8", changefreq: "monthly" };
  return { priority: "0.7", changefreq: "monthly" };
}

async function main() {
  const routes = await getAllRoutes();
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = routes
    .map((route) => {
      const loc = `${SITE_URL}${route === "/" ? "" : route}`;
      const { priority, changefreq } = meta(route);
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;

  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
  console.log(`[sitemap] wrote ${routes.length} URLs to dist/sitemap.xml`);
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});
