import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const html = readFileSync("index.html", "utf8");

const SITE = "https://vboussot.github.io/";
const OG_IMAGE = "https://vboussot.github.io/assets/img/og-cover.png";

/* --- Core descriptive metadata -------------------------------------------- */

test("has a title, factual description, author and canonical URL", () => {
  assert.match(html, /<title>Valentin Boussot · Medical Image Analysis Researcher<\/title>/);
  const desc = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  assert.ok(desc, "meta description present");
  assert.match(desc, /multimodal registration/i);
  assert.match(desc, /domain adaptation/i);
  assert.match(desc, /IMPACT/);
  assert.match(desc, /KonfAI/);
  assert.match(html, /<meta name="author" content="Valentin Boussot">/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${SITE}">`));
});

test("declares robots indexing and a theme-color per scheme", () => {
  assert.match(html, /<meta name="robots" content="index, follow">/);
  assert.match(html, /<meta name="theme-color" content="#f6f4ef" media="\(prefers-color-scheme: light\)">/);
  assert.match(html, /<meta name="theme-color" content="#15161b" media="\(prefers-color-scheme: dark\)">/);
});

/* --- Open Graph ----------------------------------------------------------- */

test("exposes a complete Open Graph card with an absolute image", () => {
  const og = name => html.match(new RegExp(`<meta property="og:${name}" content="([^"]+)">`))?.[1];
  assert.equal(og("type"), "website");
  assert.equal(og("title"), "Valentin Boussot · Medical Image Analysis Researcher");
  assert.equal(og("url"), SITE);
  assert.equal(og("site_name"), "Valentin Boussot");
  assert.match(og("description") ?? "", /IMPACT/);
  assert.equal(og("image"), OG_IMAGE);
  assert.equal(og("image:width"), "1200");
  assert.equal(og("image:height"), "630");
  assert.ok(og("image:alt"), "og:image:alt present for accessibility");
});

/* --- Twitter / X card ----------------------------------------------------- */

test("exposes a summary_large_image Twitter card", () => {
  const tw = name => html.match(new RegExp(`<meta name="twitter:${name}" content="([^"]+)">`))?.[1];
  assert.equal(tw("card"), "summary_large_image");
  assert.ok(tw("title"));
  assert.match(tw("description") ?? "", /KonfAI/);
  assert.equal(tw("image"), OG_IMAGE);
  // No unverified handle should be asserted.
  assert.doesNotMatch(html, /twitter:(site|creator)/);
});

/* --- Favicon + fallback --------------------------------------------------- */

test("references the SVG favicon and a PNG apple-touch-icon fallback", () => {
  assert.match(html, /<link rel="icon" href="assets\/img\/favicon\.svg" type="image\/svg\+xml">/);
  assert.match(html, /<link rel="apple-touch-icon" href="assets\/img\/apple-touch-icon\.png">/);
});

/* --- Social / icon image assets exist at the declared sizes --------------- */

function pngSize(path) {
  const b = readFileSync(path);
  // PNG signature + IHDR: width/height are big-endian uint32 at byte 16 and 20.
  assert.equal(b.readUInt32BE(0), 0x89504e47, `${path} is a PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

test("og image and apple-touch-icon exist with the declared dimensions", () => {
  assert.ok(existsSync("assets/img/og-cover.png"), "og-cover.png exists");
  assert.deepEqual(pngSize("assets/img/og-cover.png"), { w: 1200, h: 630 });
  assert.ok(existsSync("assets/img/apple-touch-icon.png"), "apple-touch-icon.png exists");
  assert.deepEqual(pngSize("assets/img/apple-touch-icon.png"), { w: 180, h: 180 });
});

/* --- Structured data (schema.org/Person) ---------------------------------- */

test("embeds valid schema.org/Person JSON-LD with accurate facts", () => {
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(raw, "JSON-LD block present");
  const data = JSON.parse(raw); // throws if the JSON is malformed
  assert.equal(data["@type"], "Person");
  assert.equal(data.name, "Valentin Boussot");
  assert.equal(data.url, SITE);
  assert.match(data.affiliation.name, /LTSI/);
  assert.match(data.alumniOf.name, /Université de Rennes/);
  for (const url of [
    "https://github.com/vboussot",
    "https://scholar.google.com/citations?user=efBKE4IAAAAJ",
    "https://huggingface.co/VBoussot",
    "https://www.linkedin.com/in/valentin-boussot-896ab71b0"
  ]) {
    assert.ok(data.sameAs.includes(url), `sameAs includes ${url}`);
  }
});

/* --- robots.txt + sitemap.xml --------------------------------------------- */

test("robots.txt allows crawling and points to the sitemap", () => {
  const robots = readFileSync("robots.txt", "utf8");
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/vboussot\.github\.io\/sitemap\.xml/);
});

test("sitemap.xml lists the canonical home URL", () => {
  const sitemap = readFileSync("sitemap.xml", "utf8");
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(sitemap, new RegExp(`<loc>${SITE}</loc>`));
});
