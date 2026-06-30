import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync("index.html", "utf8");
const upstreamBlock = html.match(
  /<!-- Upstream contribution[\s\S]*?<\/aside>/
)?.[0];

test("renders the GitHub-verified Elastix upstream contribution", () => {
  assert.ok(upstreamBlock, "upstream contribution block is present");
  assert.match(upstreamBlock, /<p class="upstream__label">Upstream contribution<\/p>/);
  // The single, third-party-validated credential: IMPACT merged into official Elastix.
  assert.match(upstreamBlock, /<strong>IMPACT<\/strong>/);
  assert.match(upstreamBlock, /<strong>Elastix<\/strong>/);
});

test("links to Elastix safely and no longer mentions OME-Zarr / NGFF", () => {
  const link = upstreamBlock.match(
    /<a class="upstream__link" href="([^"]+)" target="_blank" rel="noopener">/
  );
  assert.ok(link, "upstream link present");
  assert.equal(link[1], "https://github.com/SuperElastix/elastix");

  // OME-Zarr / NGFF must not appear anywhere on the page.
  assert.doesNotMatch(html, /OME-Zarr|NGFF|ngff-zarr|Next Generation File Format/i);
  // No unverified ITK claim either.
  assert.doesNotMatch(html, /InsightSoftwareConsortium\/ITK/);
});
