// Shared route discovery for the sitemap generator and the prerenderer.
// The course catalogue lives in TypeScript (src/data/courses.ts) and imports
// image assets, so we bundle it in-memory with esbuild — stubbing asset imports
// — to read the real, non-hidden course slug list without duplicating data.

import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Static, indexable routes (admin, thank-you and 404 are intentionally excluded).
// The journal lives at /blog and is rendered by PHP, not the SPA — it has its
// own sitemap at /blog/sitemap.xml and must not be prerendered here.
export const STATIC_ROUTES = [
  "/",
  "/about-us",
  "/programmes",
  "/fees",
  "/courses",
  "/scholarship",
  "/contact-us",
  "/enquire-now",
  "/accreditation-and-partners",
  "/program/european-business-school-eie",
  "/partners/ppa-business-school",
  "/partners/walsh-college",
  "/partners/qualifi",
  "/partners/eduqual",
  "/faqs",
  // "/team" — Our Team page is hidden, so it is not prerendered or listed in
  // the sitemap. Restore this entry alongside the route in App.tsx to unhide.
];

async function loadCourseData() {
  const result = await build({
    entryPoints: [path.join(root, "src/data/courses.ts")],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    logLevel: "silent",
    plugins: [
      {
        name: "stub-assets-and-alias",
        setup(b) {
          const ASSET = /\.(png|jpe?g|webp|svg|gif|avif)$/;
          // `@/x` path alias. Aliased asset imports go to the stub; everything
          // else resolves into src/.
          b.onResolve({ filter: /^@\// }, (args) => {
            const rel = args.path.slice(2);
            if (ASSET.test(rel)) return { path: args.path, namespace: "asset-stub" };
            return { path: path.join(root, "src", rel) };
          });
          // Relative asset imports -> stub too.
          b.onResolve({ filter: ASSET }, (args) => ({
            path: args.path,
            namespace: "asset-stub",
          }));
          // Assets resolve to an empty default export (we only need the data).
          b.onLoad({ filter: /.*/, namespace: "asset-stub" }, () => ({
            contents: "export default '';",
            loader: "js",
          }));
        },
      },
    ],
  });

  const code = result.outputFiles[0].text;
  const dataUrl =
    "data:text/javascript;base64," + Buffer.from(code).toString("base64");
  return import(dataUrl);
}

/** All indexable routes: static pages + every non-hidden /programmes/<slug>. */
export async function getAllRoutes() {
  const mod = await loadCourseData();
  const courses = mod.courses ?? [];
  const courseRoutes = courses.map((c) => `/programmes/${c.slug}`);
  // De-dupe while preserving order.
  return [...new Set([...STATIC_ROUTES, ...courseRoutes])];
}
