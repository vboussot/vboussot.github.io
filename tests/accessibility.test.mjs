import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("assets/css/styles.css", "utf8");
const mainScript = readFileSync("assets/js/main.js", "utf8");
const helpers = readFileSync("assets/js/view-helpers.js", "utf8");

/* --- Document structure & landmarks --------------------------------------- */

test("declares language and a single top-level heading", () => {
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, "exactly one <h1>");
  assert.ok((html.match(/<h2\b/g) ?? []).length >= 6, "an <h2> per section");
});

test("exposes a skip link, a focusable main, and the core landmarks", () => {
  assert.match(html, /<a class="skip-link" href="#main">Skip to content<\/a>/);
  assert.match(html, /<main id="main" tabindex="-1">/);
  assert.match(html, /<header class="site-header">/);
  assert.match(html, /<nav class="nav" id="primary-nav" aria-label="Primary">/);
  assert.match(html, /<footer class="site-footer">/);
});

test("names every content section via its existing heading id", () => {
  const sections = [
    "about",
    "research",
    "impact",
    "projects",
    "publications",
    "contact"
  ];

  sections.forEach(id => {
    const tag = html.match(new RegExp(`<section[^>]*id="${id}"[^>]*>`))?.[0];
    assert.ok(tag, `section #${id} is present`);
    assert.match(tag, new RegExp(`aria-labelledby="${id}-title"`));
    assert.match(
      html,
      new RegExp(`<h2 id="${id}-title"`),
      `heading #${id}-title that names the region exists`
    );
  });
});

/* --- Controls have accessible names & state ------------------------------- */

test("interactive controls carry accessible names and ARIA state", () => {
  assert.match(
    html,
    /<button class="icon-btn theme-toggle" type="button" aria-pressed="[^"]*" aria-label="[^"]+">/
  );
  assert.match(
    html,
    /<button class="icon-btn nav-toggle" type="button" aria-expanded="[^"]*" aria-controls="primary-nav" aria-label="[^"]+">/
  );
  // The brand mark is decorative; the link itself is named.
  assert.match(html, /<a class="brand" href="#main" aria-label="[^"]+">/);
  assert.match(html, /<span class="brand__mark" aria-hidden="true">VB<\/span>/);
});

/* --- Icons are decorative; meaning lives in adjacent text ------------------ */

test("all icon SVGs are hidden from assistive tech", () => {
  const iconTags = html.match(/<svg class="icon[^>]*>/g) ?? [];
  assert.ok(iconTags.length > 0, "icons are present");
  assert.ok(
    iconTags.every(tag => /aria-hidden="true"/.test(tag)),
    "every inline .icon SVG is aria-hidden"
  );
  // The off-screen sprite container is hidden and non-focusable.
  assert.match(
    html,
    /<svg width="0" height="0" aria-hidden="true" focusable="false"/
  );
  // The shared renderer also emits aria-hidden icons.
  assert.match(helpers, /setAttribute\("aria-hidden", "true"\)/);
});

/* --- Results / rankings highlight ----------------------------------------- */

test("ranking metrics expose a screen-reader 'place' qualifier", () => {
  // No rank should be a bare ordinal with no spoken context.
  assert.doesNotMatch(
    html,
    /class="metric__rank">[^<]*<\/span>/,
    "ranks must wrap a visually-hidden qualifier, never close bare"
  );
  const qualifiers = html.match(/class="visually-hidden"> place<\/span>/g) ?? [];
  assert.ok(
    qualifiers.length >= 4,
    "each ranking value is announced as an Nth place"
  );
});

/* --- Brand logos are accessible ------------------------------------------- */

test("product logos are decorative and backed by a text heading", () => {
  // Brand cards carry the real repo logo with empty alt — the adjacent <h3>
  // already names the project, so the name is never announced twice.
  const logos = html.match(/<img src="assets\/img\/logos\/[^>]*>/g) ?? [];
  assert.ok(logos.length >= 3, "KonfAI, IMPACT-Reg and IMPACT-Synth show their logo");
  assert.ok(
    logos.every(img => /\balt=""/.test(img)),
    "logos use empty alt so screen readers rely on the heading"
  );
});

/* --- External links open safely & announce the new context ---------------- */

test("every new-tab link is secured with rel=noopener", () => {
  const blankAnchors = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
  assert.ok(blankAnchors.length > 0);
  assert.ok(
    blankAnchors.every(anchor => /rel="noopener"/.test(anchor)),
    "target=_blank anchors set rel=noopener"
  );
});

/* --- CSS affordances: focus, reduced motion, both themes ------------------ */

test("stylesheet provides focus, reduced-motion and visually-hidden support", () => {
  assert.match(css, /\.skip-link\s*\{/);
  assert.match(css, /:focus-visible\s*\{/);
  assert.match(css, /\.visually-hidden\s*\{/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
});

/* --- Behaviour respects user preferences --------------------------------- */

test("scripts honour reduced motion and keep toggle state in sync", () => {
  assert.match(
    mainScript,
    /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/
  );
  assert.match(mainScript, /if \(reduceMotion\.matches/);
  // Theme toggle keeps an accurate, spoken state.
  assert.match(mainScript, /setAttribute\("aria-pressed", String\(dark\)\)/);
  assert.match(mainScript, /setAttribute\(\s*"aria-label",\s*dark \?/);
});
