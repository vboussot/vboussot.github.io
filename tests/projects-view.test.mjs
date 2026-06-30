import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { createFakeDocument, FakeElement } from "./fake-dom.mjs";

function loadProjectsView() {
  const grid = new FakeElement("ul");
  const elements = new Map([["projects-grid", grid]]);
  const warnings = [];
  const window = {
    console: {
      warn: (...args) => warnings.push(args)
    }
  };
  const document = createFakeDocument(elements);
  const context = vm.createContext({ window, document });

  vm.runInContext(readFileSync("assets/js/view-helpers.js", "utf8"), context);
  vm.runInContext(readFileSync("assets/js/projects.js", "utf8"), context);
  vm.runInContext(readFileSync("assets/js/projects-view.js", "utf8"), context);

  return { grid, projects: window.siteContent.projects, warnings, context };
}

test("renders every verified project with accessible repository metadata", () => {
  const { grid, projects, warnings } = loadProjectsView();

  assert.equal(warnings.length, 0);
  assert.equal(grid.childNodes.length, projects.length);
  assert.equal(projects.length, 17);

  grid.childNodes.forEach((card, index) => {
    const project = projects[index];
    const title = card.querySelector(".eco-card__title");
    const description = card.querySelector(".eco-card__text");
    const metadata = card.querySelector(".cluster");
    const link = card.querySelector(".eco-card__link");

    assert.ok(card.hasClass("card"));
    assert.ok(card.hasClass("eco-card"));
    assert.equal(title.textContent, project.name);
    assert.equal(description.textContent, project.description);
    assert.ok(metadata.textContent.includes(project.category));
    // Language chip is GitHub-only; Hugging Face artifacts have none.
    if (project.language) {
      assert.ok(metadata.textContent.includes(project.language));
    }
    assert.equal(link.getAttribute("href"), project.url);
    assert.equal(link.getAttribute("target"), "_blank");
    assert.equal(link.getAttribute("rel"), "noopener");
    // GitHub repos and Hugging Face artifacts announce their own host.
    const expectedHost =
      project.host === "huggingface" ? "Hugging Face" : "GitHub";
    assert.equal(
      link.getAttribute("aria-label"),
      `View ${project.name} on ${expectedHost} (opens in a new tab)`
    );
  });
});

test("is idempotent when the renderer is evaluated more than once", () => {
  const { grid, projects, warnings, context } = loadProjectsView();

  vm.runInContext(readFileSync("assets/js/projects-view.js", "utf8"), context);

  assert.equal(warnings.length, 0);
  assert.equal(grid.childNodes.length, projects.length);
});
