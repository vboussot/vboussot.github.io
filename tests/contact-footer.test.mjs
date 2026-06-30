import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync("index.html", "utf8");
const mainScript = readFileSync("assets/js/main.js", "utf8");
const contactBlock = html.match(
  /<!-- CONTACT [\s\S]*?<section class="section" id="contact"[^>]*>[\s\S]*?<\/section>/
)?.[0];
const heroBlock = html.match(
  /<!-- HERO [\s\S]*?<section class="hero">[\s\S]*?<\/section>/
)?.[0];
const footerBlock = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0];

const profiles = [
  {
    href: "https://github.com/vboussot",
    icon: "github",
    label: "GitHub"
  },
  {
    href: "https://scholar.google.com/citations?user=efBKE4IAAAAJ",
    icon: "scholar",
    label: "Google Scholar"
  },
  {
    href: "https://huggingface.co/VBoussot",
    icon: "huggingface",
    label: "Hugging Face"
  },
  {
    href: "https://www.linkedin.com/in/valentin-boussot-896ab71b0",
    icon: "linkedin",
    label: "LinkedIn"
  }
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function anchorFor(block, href) {
  return block?.match(
    new RegExp(`<a\\b[^>]*href="${escapeRegExp(href)}"[^>]*>`)
  )?.[0];
}

function assertSecureExternalAnchor(anchor) {
  assert.match(anchor, /target="_blank"/);
  const relTokens = anchor.match(/\brel="([^"]+)"/)?.[1].split(/\s+/) ?? [];
  assert.ok(relTokens.includes("noopener"));
}

test("renders a clear primary email action and all verified profile links", () => {
  assert.ok(contactBlock, "Contact section is present");
  assert.match(contactBlock, /<div class="reveal contact flow">/);
  assert.match(contactBlock, /<p class="lead contact__intro">/);
  assert.doesNotMatch(contactBlock, /placeholder|style=/);
  assert.match(contactBlock, /<ul class="cluster contact__links" role="list">/);

  const emailAnchor = anchorFor(contactBlock, "mailto:valentin@fideus.io");
  assert.match(emailAnchor, /class="btn btn--primary"/);
  assert.match(contactBlock, /<use href="#icon-mail"><\/use>/);
  assert.match(contactBlock, />\s*valentin@fideus\.io\s*<\/a>/);

  profiles.forEach(profile => {
    const anchor = anchorFor(contactBlock, profile.href);
    assert.ok(anchor, `${profile.label} contact link is present`);
    assert.match(anchor, /class="btn"/);
    assertSecureExternalAnchor(anchor);
    assert.match(contactBlock, new RegExp(`<use href="#icon-${profile.icon}"></use>`));
    assert.match(contactBlock, new RegExp(`${profile.label}[\\s\\S]*?opens in a new tab`));
  });
});

test("reuses the hero link and icon primitives in Contact", () => {
  assert.ok(heroBlock, "Hero section is present");

  [...profiles, { href: "mailto:valentin@fideus.io", icon: "mail" }].forEach(
    profile => {
      assert.ok(anchorFor(heroBlock, profile.href), `${profile.href} is available in Hero`);
      assert.ok(anchorFor(contactBlock, profile.href), `${profile.href} is available in Contact`);
      assert.match(heroBlock, new RegExp(`<use href="#icon-${profile.icon}"></use>`));
      assert.match(contactBlock, new RegExp(`<use href="#icon-${profile.icon}"></use>`));
    }
  );
});

test("keeps the footer minimal, current, and fully linked", () => {
  assert.ok(footerBlock, "Footer is present");
  assert.match(
    footerBlock,
    new RegExp(`<span id="footer-year">${new Date().getFullYear()}</span> Valentin Boussot`)
  );
  assert.match(mainScript, /new Date\(\)\.getFullYear\(\)/);

  profiles.forEach(profile => {
    const anchor = anchorFor(footerBlock, profile.href);
    assert.ok(anchor, `${profile.label} footer link is present`);
    assertSecureExternalAnchor(anchor);
  });

  assert.ok(anchorFor(footerBlock, "mailto:valentin@fideus.io"));
  assert.equal((footerBlock.match(/<li>/g) ?? []).length, 5);
});
