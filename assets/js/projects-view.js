/* =============================================================================
   Valentin Boussot — Projects section renderer.

   Consumes the verified records exposed by projects.js and composes the
   existing grid, card, chip and link primitives. Rendering is idempotent so
   this task remains compatible with older Phase 4 drafts during development.
   ========================================================================== */

(function () {
  "use strict";

  var projects =
    window.siteContent && Array.isArray(window.siteContent.projects)
      ? window.siteContent.projects
      : [];
  var helpers = window.siteView || {};
  var el = helpers.el;
  var icon = helpers.icon;

  // The card link adapts to where the project lives. GitHub repos keep the
  // monochrome mark and "GitHub repository" label; Hugging Face artifacts carry
  // the real, full-colour Hugging Face logo (assets/img/logos/huggingface.svg).
  function repoLink(project) {
    if (project.host === "huggingface") {
      return el(
        "a",
        {
          class: "eco-card__link",
          href: project.url,
          target: "_blank",
          rel: "noopener",
          "aria-label":
            "View " + project.name + " on Hugging Face (opens in a new tab)"
        },
        [
          el("img", {
            class: "link-logo",
            src: "assets/img/logos/huggingface.svg",
            alt: "",
            width: "16",
            height: "16",
            loading: "lazy",
            decoding: "async"
          }),
          "Hugging Face",
          icon("arrow-up-right")
        ]
      );
    }
    return el(
      "a",
      {
        class: "eco-card__link",
        href: project.url,
        target: "_blank",
        rel: "noopener",
        "aria-label": "View " + project.name + " on GitHub (opens in a new tab)"
      },
      [icon("github"), "GitHub repository", icon("arrow-up-right")]
    );
  }

  function projectCard(project) {
    var metaItems = [el("li", { class: "chip", text: project.category })];
    // Primary language (GitHub repos only; Hugging Face artifacts have none).
    if (project.language) {
      metaItems.push(el("li", { class: "chip", text: project.language }));
    }
    // GitHub star count (verified snapshot in projects.js). Shown only when > 0;
    // the ★ glyph is decorative, the accessible name carries the meaning.
    if (typeof project.stars === "number" && project.stars > 0) {
      metaItems.push(
        el(
          "li",
          {
            class: "chip chip--stars",
            "aria-label": project.stars + " GitHub stars"
          },
          [
            el("span", { class: "chip__star", "aria-hidden": "true", text: "★" }),
            " " + project.stars
          ]
        )
      );
    }
    var meta = el("ul", { class: "cluster", role: "list" }, metaItems);

    return el("li", { class: "card eco-card project-card" }, [
      el("h3", { class: "eco-card__title", text: project.name }),
      el("p", { class: "eco-card__text", text: project.description }),
      meta,
      repoLink(project)
    ]);
  }

  function renderProjects() {
    var grid = document.getElementById("projects-grid");
    if (!grid) return;

    grid.replaceChildren();

    if (!projects.length) {
      grid.appendChild(
        el("li", {
          class: "placeholder",
          text: "Project data is temporarily unavailable."
        })
      );
      return;
    }

    projects.forEach(function (project) {
      grid.appendChild(projectCard(project));
    });
  }

  try {
    if (typeof el !== "function" || typeof icon !== "function") {
      throw new Error("Shared view helpers are unavailable");
    }
    renderProjects();
  } catch (error) {
    if (window.console && console.warn) {
      console.warn("[projects-view.js] Projects failed to render:", error);
    }
  }
})();
