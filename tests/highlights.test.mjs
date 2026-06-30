import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync("index.html", "utf8");

/* Two narrative highlights, pinned so a later edit can't quietly drop them or
   reorder them out of place:

   1. A single synthesis-bias highlight in the Research section — the insight that
      a supervised CT-synthesis model trained on a CT target registered onto the
      source inherits the registration convention's residual error, so the
      benchmark carries a hidden performance floor (Goodhart's law). It sits after
      the guiding "one idea" beat and before the Results, where it reframes how the
      rankings read.
   2. The IMPACT intro framed as the methods above shipped as open software (the
      "one idea" is explained once, in "The idea", and not repeated here), with
      each surviving deep-dive pointing back down to the ecosystem — encoding the
      Research -> Software through-line in text, not just in layout.

   Whitespace is normalised before phrase checks so assertions don't depend on
   where the HTML source happens to wrap (the browser collapses it the same way). */

const norm = (s) => s.replace(/\s+/g, " ");
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

// Scope the "within #research" checks to the Research section: from its id
// attribute up to the start of the IMPACT section. ('id="research"' does not
// match 'id="research-title"', whose next char is "-", not a quote.)
const research = html.slice(
  html.indexOf('id="research"'),
  html.indexOf('id="impact"')
);

// The bias block runs from its wrapper to the Results marker that follows it,
// so the slice is exactly the highlight — never the explanatory comment above it.
const biasOpen = '<div class="reveal bias">';
const biasBlock = research.slice(
  research.indexOf(biasOpen),
  research.indexOf("<!-- Results -->")
);

test("a single synthesis-bias highlight lives in the Research section", () => {
  const blocks = research.match(/<div class="reveal bias">/g) ?? [];
  assert.equal(blocks.length, 1, "exactly one .bias highlight in #research");
});

test("the bias highlight carries a heading and names the key idea", () => {
  const heading = biasBlock.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/);
  assert.ok(heading, "the bias block exposes an <h3> heading");
  assert.ok(heading[1].trim().length > 0, "the bias heading has text");

  const body = norm(biasBlock);
  assert.ok(body.includes("Goodhart"), "names Goodhart's law");
  assert.ok(
    body.includes("performance floor"),
    "names the performance-floor consequence"
  );
});

test("the bias highlight sits after the guiding one-idea beat and before the Results", () => {
  const overviewIdx = research.indexOf("research__overview");
  const biasIdx = research.indexOf(biasOpen);
  const resultsIdx = research.indexOf("<h3>Results</h3>");

  assert.ok(overviewIdx >= 0, "the opening one-idea overview beat is present");
  assert.ok(biasIdx >= 0, "the bias highlight is present");
  assert.ok(resultsIdx >= 0, "the Results sub-section is present");

  assert.ok(overviewIdx < biasIdx, "bias comes after the guiding one-idea beat");
  assert.ok(biasIdx < resultsIdx, "bias comes before the Results");

  // The guiding-idea beat (after the clinical problem, before the bias) carries
  // the "one idea" framing, so the bias reframes rankings the reader has already
  // been told follow from that one idea. Matched in real content, not a comment.
  const opening = stripComments(research.slice(overviewIdx, biasIdx));
  assert.match(
    norm(opening),
    /\bone idea\b/i,
    "the guiding-idea beat states the one idea"
  );

  // The duplicated mid-section "Central idea" callout was removed (say it once).
  assert.equal(
    (research.match(/<blockquote class="reveal callout">/g) ?? []).length,
    0,
    "the old mid-section Central-idea callout is gone"
  );
});

test("the bias highlight appends an Approfondir disclosure with a question summary", () => {
  // Progressive disclosure on the bias: a no-JS <details class="deepdive"> appended
  // inside the .bias block, opening with a plain question, expanding the same
  // reference-is-not-truth argument in short labelled beats.
  const detail = biasBlock.match(/<details class="deepdive">[\s\S]*?<\/details>/)?.[0];
  assert.ok(detail, 'the .bias block appends a <details class="deepdive"> disclosure');

  const summary = detail.match(/<summary>([\s\S]*?)<\/summary>/)?.[1];
  assert.ok(summary, "the disclosure exposes a <summary> affordance");
  assert.match(summary.trim(), /\?$/, "the summary doubles as a plain question");

  // Any figure actually shipped inside the disclosure (as opposed to the reserved
  // comment slot) must reference a real file with non-empty alt. With the bias loop
  // reserved, comment-stripping leaves no live figure here — which is allowed.
  const liveFigure = stripComments(detail).match(
    /<figure class="deepdive__figure">[\s\S]*?<\/figure>/
  )?.[0];
  if (liveFigure) {
    const img = liveFigure.match(/<img\b[^>]*>/)?.[0] ?? "";
    const src = img.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(src && existsSync(src), `shipped bias figure exists on disk: ${src}`);
    const alt = img.match(/\balt="([^"]*)"/)?.[1];
    assert.ok(alt && alt.trim().length > 0, "shipped bias figure carries non-empty alt");
  }
});

test("the IMPACT intro frames the methods above as shipped open software", () => {
  const intro = html.match(
    /<div class="reveal impact__intro flow">[\s\S]*?<\/div>/
  )?.[0];
  assert.ok(intro, "the IMPACT intro block is present");

  const lead = intro.match(/<p class="lead">([\s\S]*?)<\/p>/)?.[1];
  assert.ok(lead, "the IMPACT intro carries a .lead paragraph");

  const text = norm(lead);
  // The intro cross-references up into Research instead of re-explaining the idea:
  // the "one idea / feature space" framing is stated once, in "The idea", so it is
  // deliberately NOT repeated here. This section is framed as the software.
  assert.ok(
    text.includes("methods above"),
    "the lead references the methods above"
  );
  assert.ok(
    text.includes("software"),
    "frames the methods as shipped open software"
  );
  ["registration", "synthesis"].forEach((domain) => {
    assert.ok(text.includes(domain), `the lead names the "${domain}" library`);
  });
});

test("the two IMPACT methods point back down to the IMPACT ecosystem", () => {
  // Scoped to the contributions list. The first two deep-dives are the shipped IMPACT
  // methods (IMPACT-Reg, IMPACT-Synth) and must cross-reference the ecosystem below; the
  // third (the wPCA deformation model) has no public release, so it is exempt.
  const contributions =
    html.match(/<ol class="contributions"[\s\S]*?<\/ol>/)?.[0] ?? "";
  const deepdives =
    contributions.match(/<details class="deepdive">[\s\S]*?<\/details>/g) ?? [];
  assert.equal(deepdives.length, 3, "three contribution deep-dives present");
  deepdives.slice(0, 2).forEach((block, i) => {
    assert.ok(
      norm(block).includes("the IMPACT ecosystem (below)"),
      `deep-dive ${i + 1} cross-references the IMPACT ecosystem (below)`
    );
  });
});
