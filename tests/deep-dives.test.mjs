import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync("index.html", "utf8");

/* The registration / synthesis duality presents two methods, each carrying a
   no-JS <details> disclosure appended inside its card. The disclosure adds a
   second, opt-in layer of depth without touching the short, scannable card__text
   layer above it. Both follow the identical four-part shape (Problem / Key idea /
   one method-specific part / Result) and close with their own illustrative figure
   from the defense deck — the IMPACT-Reg principle, the IMPACT-Synth pipeline.
   These tests pin that contract so a future edit can't quietly drop a part, a
   summary, or re-duplicate a figure.

   The two method figures are DISTINCT research/ diagrams, not the 3D Slicer
   captures: those live once each in the dedicated "Running in 3D Slicer" section.
   The shared-feature-space schematic likewise appears once, under "The guiding
   idea". The weighted-PCA lung-deformation model is a brief, deep-dive-less note
   in the Research section, so it is absent from these checks. */

const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

// The two contribution deep-dives, in document order (IMPACT-Reg, IMPACT-Synth).
// Scoped to the contributions list: the page now carries other .deepdive
// disclosures too (the bias "Approfondir"), but this contract is specifically the
// per-method deep-dive inside each card. The non-greedy match stops at each block's
// own </details>.
const contributions = html.match(/<ol class="contributions"[\s\S]*?<\/ol>/)?.[0] ?? "";
const deepdives = contributions.match(/<details class="deepdive">[\s\S]*?<\/details>/g) ?? [];

test("the page carries exactly three contribution deep-dives", () => {
  assert.equal(
    deepdives.length,
    3,
    'one <details class="deepdive"> per contribution (IMPACT-Reg, IMPACT-Synth, wPCA)'
  );
});

test("each deep-dive opens with a question summary and four labelled parts", () => {
  assert.equal(deepdives.length, 3, "three deep-dive blocks present");
  deepdives.forEach((block, i) => {
    const n = i + 1;
    const summary = block.match(/<summary>([\s\S]*?)<\/summary>/);
    assert.ok(summary, `deep-dive ${n} exposes a <summary> affordance`);
    assert.match(
      summary[1].trim(),
      /\?$/,
      `deep-dive ${n} summary doubles as a plain question`
    );

    const parts = block.match(/class="deepdive__part"/g) ?? [];
    const labels = block.match(/class="deepdive__label"/g) ?? [];
    assert.equal(
      parts.length,
      4,
      `deep-dive ${n}: one part each for Problem / Key idea / method-specific part / Result`
    );
    assert.ok(
      labels.length >= 4,
      `deep-dive ${n}: each part is introduced by a small-caps label`
    );
  });
});

test("each contribution deep-dive embeds its own principle/pipeline figure (a research/ diagram)", () => {
  assert.equal(deepdives.length, 3, "three deep-dive blocks present");
  const named = [
    ["IMPACT-Reg", deepdives[0]],
    ["IMPACT-Synth", deepdives[1]],
    ["wPCA", deepdives[2]],
  ];
  const seen = new Set();
  for (const [label, block] of named) {
    const figure = stripComments(block).match(
      /<figure class="deepdive__figure[^"]*">[\s\S]*?<\/figure>/
    )?.[0];
    assert.ok(figure, `${label} deep-dive embeds a live .deepdive__figure`);

    const img = figure.match(/<img\b[^>]*>/)?.[0] ?? "";
    const src = img.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(src, `${label} figure declares a src`);
    // A purpose-made diagram under research/, NOT a re-used 3D Slicer screenshot.
    assert.match(
      src,
      /^assets\/img\/research\//,
      `${label} figure is a research/ diagram, not a Slicer screenshot`
    );
    assert.ok(existsSync(src), `${label} figure exists on disk: ${src}`);

    const alt = img.match(/\balt="([^"]*)"/)?.[1];
    assert.ok(
      alt && alt.trim().length > 20,
      `${label} figure carries descriptive alt text`
    );

    assert.ok(!seen.has(src), `${label} figure is unique — no duplicated image: ${src}`);
    seen.add(src);
  }
});

test("each 3D Slicer screenshot appears exactly once, inside the 3D Slicer showcase", () => {
  const showcase = html.match(/<ul class="slicer__grid"[\s\S]*?<\/ul>/)?.[0] ?? "";
  assert.ok(showcase, "the 3D Slicer showcase grid is present");
  for (const src of [
    "assets/img/slicer/impact-reg.webp",
    "assets/img/slicer/impact-synth.webp",
  ]) {
    const occurrences = stripComments(html).split(src).length - 1;
    assert.equal(occurrences, 1, `${src} is referenced exactly once across the page`);
    assert.ok(showcase.includes(src), `${src} lives in the 3D Slicer showcase`);
    assert.ok(existsSync(src), `${src} exists on disk`);
  }
});

test("the three contributions keep their short, scannable card__text layer", () => {
  // Each card's collapsed layer, from its <h4> title to the deep-dive, must
  // still hold the original scannable summary paragraph and its distinctive copy.
  const cards = [
    {
      title: "Multimodal registration · IMPACT-Reg",
      phrase: "modality-agnostic semantic similarity metric",
    },
    {
      title: "Anatomy-preserving CT synthesis · IMPACT-Synth",
      phrase: "without displacing, erasing or",
    },
    {
      title: "Statistical deformation model · wPCA",
      phrase: "weighted-PCA prior over lung deformation",
    },
  ];

  for (const { title, phrase } of cards) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const scannable = html.match(
      new RegExp(`${escaped}<\\/h4>[\\s\\S]*?<details class="deepdive">`)
    )?.[0];
    assert.ok(scannable, `the deep-dive lives inside the "${title}" card`);
    assert.match(
      scannable,
      /<p class="card__text">/,
      `card__text was not removed from "${title}"`
    );
    assert.ok(
      scannable.includes(phrase),
      `the original scannable copy is intact for "${title}": ${phrase}`
    );
  }
});

/* Figures. The research story ships the author's own shared-feature-space schematic
   (deck slide, re-encoded to WebP) as a real file once, under "The guiding idea".
   The bias "loop" had no single clean raster in the deck, so its figure slot stays
   reserved inside a comment — never fabricated — the same honest-slot discipline
   the deep-dives already use for unshipped figures (verified via stripComments). */

test("the research story ships a real shared-feature-space figure with descriptive alt", () => {
  const figure = html.match(
    /<figure class="deepdive__figure deepdive__figure--full">[\s\S]*?<\/figure>/
  )?.[0];
  assert.ok(figure, "the shared-feature-space figure is present under the guiding idea");

  const img = figure.match(/<img\b[^>]*>/)?.[0] ?? "";
  const src = img.match(/\bsrc="([^"]+)"/)?.[1];
  assert.ok(src, "the duality figure declares a src");
  assert.match(src, /^assets\/img\/research\//, "it lives under assets/img/research/");
  assert.ok(existsSync(src), `the duality figure exists on disk: ${src}`);

  const alt = img.match(/\balt="([^"]*)"/)?.[1];
  assert.ok(alt && alt.trim().length > 0, "the diagram carries non-empty alt text");
  assert.match(
    alt,
    /feature|anatom|scan|segmentation/i,
    "the alt actually describes the figure (a diagram, not a logo)"
  );
});

test("the bias-loop figure slot is reserved in a comment, never fabricated", () => {
  const path = "assets/img/research/research-bias-loop.webp";
  assert.ok(html.includes(path), "the reserved bias-loop slot names its target path");
  assert.ok(
    !stripComments(html).includes(path),
    "the bias-loop path appears ONLY inside a comment — no live figure shipped"
  );
  assert.ok(!existsSync(path), "no bias-loop image was invented on disk");
});
