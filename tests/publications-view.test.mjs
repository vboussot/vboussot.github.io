import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { createFakeDocument, FakeElement } from "./fake-dom.mjs";

function loadPublicationsView() {
  const root = new FakeElement("div");
  const elements = new Map([["publications-list", root]]);
  const warnings = [];
  const window = {
    console: {
      warn: (...args) => warnings.push(args)
    }
  };
  const document = createFakeDocument(elements);
  const context = vm.createContext({ window, document });

  vm.runInContext(readFileSync("assets/js/view-helpers.js", "utf8"), context);
  vm.runInContext(readFileSync("assets/js/publications.js", "utf8"), context);
  vm.runInContext(
    readFileSync("assets/js/publications-view.js", "utf8"),
    context
  );

  return {
    context,
    publications: window.siteContent.publications,
    root,
    warnings
  };
}

test("defines a complete, factual publication schema in the required order", () => {
  const { publications } = loadPublicationsView();
  const requiredFields = [
    "name",
    "authorsShort",
    "venue",
    "year",
    "type",
    "status",
    "link"
  ];

  assert.equal(publications.length, 19);
  assert.deepEqual(
    Array.from(publications.slice(0, 3), publication => publication.name),
    [
      "IMPACT: A Generic Semantic Loss for Multimodal Medical Image Registration",
      "KonfAI: A Modular and Fully Configurable Framework for Deep Learning in Medical Imaging",
      "When Misalignment Becomes Supervision: Structured Label Noise in Supervised Synthetic CT Generation"
    ]
  );

  publications.forEach(publication => {
    requiredFields.forEach(field => {
      assert.ok(Object.hasOwn(publication, field), `${publication.name}: ${field}`);
    });
    assert.ok(["preprint", "journal", "conference"].includes(publication.type));
    assert.ok(["published", "under review"].includes(publication.status));
    assert.ok(publication.year === null || Number.isInteger(publication.year));
    assert.ok(publication.link === null || publication.link.startsWith("https://"));
    assert.ok(publication.name.length > 0);
    assert.ok(publication.authorsShort.length > 0);
    assert.ok(publication.venue.length > 0);
    if (publication.link) assert.ok(publication.linkLabel.length > 0);
  });

  const panther = publications.find(publication =>
    publication.name.startsWith("PANTHER Challenge Report:")
  );
  assert.deepEqual(
    {
      name: panther.name,
      venue: panther.venue,
      year: panther.year,
      status: panther.status,
      link: panther.link,
      linkLabel: panther.linkLabel
    },
    {
      name: "PANTHER Challenge Report: Cross-Domain Pancreatic Tumor Segmentation in Magnetic Resonance Imaging",
      venue: "Medical Image Analysis",
      year: 2026,
      status: "published",
      link: "https://doi.org/10.1016/j.media.2026.104186",
      linkLabel: "DOI: 10.1016/j.media.2026.104186"
    }
  );
});

test("renders every publication in semantic groups with honest review labels", () => {
  const { publications, root, warnings } = loadPublicationsView();
  const groups = root.querySelectorAll(".publications__group");
  const cards = root.querySelectorAll(".publication");
  const reviewLabels = root.querySelectorAll(".publication__status");

  assert.equal(warnings.length, 0);
  assert.equal(groups.length, 3);
  assert.deepEqual(
    groups.map(group => group.querySelector("h3").textContent),
    [
      "Preprints & flagship works",
      "Journal articles",
      "Selected conference papers"
    ]
  );
  assert.equal(cards.length, publications.length);
  assert.equal(
    reviewLabels.length,
    publications.filter(publication => publication.status === "under review").length
  );
  assert.ok(cards.every(card => card.hasClass("card")));
  assert.ok(
    cards.every(card => card.querySelector(".publication__authors").textContent.includes("Boussot V."))
  );
});

test("adds secure, descriptively labelled links only when verified", () => {
  const { publications, root } = loadPublicationsView();
  const cards = root.querySelectorAll(".publication");

  publications.forEach((publication, index) => {
    const link = cards[index].querySelector(".publication__link");

    if (!publication.link) {
      assert.equal(link, null);
      return;
    }

    assert.equal(link.getAttribute("href"), publication.link);
    assert.equal(link.getAttribute("target"), "_blank");
    assert.equal(link.getAttribute("rel"), "noopener");
    assert.ok(link.getAttribute("aria-label").includes(publication.name));
  });
});

test("is idempotent when the renderer is evaluated more than once", () => {
  const { context, publications, root, warnings } = loadPublicationsView();

  vm.runInContext(
    readFileSync("assets/js/publications-view.js", "utf8"),
    context
  );

  assert.equal(warnings.length, 0);
  assert.equal(root.querySelectorAll(".publication").length, publications.length);
});
