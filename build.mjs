// Builds the site: copies src/ to dist/ and fills in the site URL and search-engine settings.
//
// On Netlify this runs automatically (see netlify.toml) and uses the site's primary URL,
// so canonical links, the sitemap and social previews follow your custom domain once you add it.
//
// Local build (e.g. before a drag-and-drop deploy):
//   node build.mjs https://www.votre-domaine.ma
//
// Optional environment variables (Netlify > Site configuration > Environment variables):
//   GOOGLE_SITE_VERIFICATION  content of Google Search Console's HTML-tag verification
//   BING_SITE_VERIFICATION    content of Bing Webmaster Tools' msvalidate.01 tag

import { cpSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SRC = "src";
const OUT = "dist";

const SITE_URL = (process.argv[2] || process.env.URL || "http://localhost:8888").replace(/\/+$/, "");
const CONTEXT = process.env.CONTEXT || "production";
const INDEXABLE = CONTEXT === "production";
const LASTMOD = new Date().toISOString().slice(0, 10);

const verification = [
  process.env.GOOGLE_SITE_VERIFICATION &&
    `<meta name="google-site-verification" content="${process.env.GOOGLE_SITE_VERIFICATION}">`,
  process.env.BING_SITE_VERIFICATION &&
    `<meta name="msvalidate.01" content="${process.env.BING_SITE_VERIFICATION}">`,
].filter(Boolean).join("\n");

const robotsMeta = INDEXABLE
  ? "index, follow, max-image-preview:large, max-snippet:-1"
  : "noindex, nofollow";

const TEXT_TYPES = new Set([".html", ".xml", ".txt", ".webmanifest", ".json"]);

function fill(text) {
  return text
    .replaceAll("__SITE_URL__", SITE_URL)
    .replaceAll("__ROBOTS__", robotsMeta)
    .replaceAll("__LASTMOD__", LASTMOD)
    .replace("<!--SITE_VERIFICATION-->", verification);
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (TEXT_TYPES.has(extname(name))) writeFileSync(path, fill(readFileSync(path, "utf8")));
  }
}

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
walk(OUT);

if (!INDEXABLE) {
  // Deploy previews and branch deploys stay out of search results.
  writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");
  writeFileSync(join(OUT, "_headers"), "/*\n  X-Robots-Tag: noindex, nofollow\n");
}

// Once a custom domain is set, send the default *.netlify.app address to it,
// so Google only ever sees one copy of the site.
const host = new URL(SITE_URL).hostname;
if (INDEXABLE && process.env.SITE_NAME && !host.endsWith(".netlify.app")) {
  writeFileSync(
    join(OUT, "_redirects"),
    `https://${process.env.SITE_NAME}.netlify.app/* ${SITE_URL}/:splat 301!\n`
  );
}

console.log(`Built ${OUT}/ for ${SITE_URL} (${CONTEXT}${INDEXABLE ? ", indexable" : ", noindex"})`);
