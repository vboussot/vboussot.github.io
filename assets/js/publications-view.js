/* =============================================================================
   Valentin Boussot — Publications section renderer.

   Consumes publications.js and composes semantic grouped lists from the
   existing card, chip and link primitives. Rendering is idempotent.
   ========================================================================== */

(function () {
  "use strict";

  var publications =
    window.siteContent && Array.isArray(window.siteContent.publications)
      ? window.siteContent.publications
      : [];
  var helpers = window.siteView || {};
  var el = helpers.el;
  var icon = helpers.icon;
  var groups = [
    { type: "preprint", title: "Preprints & flagship works" },
    { type: "journal", title: "Journal articles" },
    { type: "conference", title: "Selected conference papers" }
  ];

  function authorsNode(authors) {
    var node = el("p", { class: "publication__authors" });
    var token = "Boussot V.";

    authors.split(token).forEach(function (part, index) {
      if (index > 0) node.appendChild(el("strong", { text: token }));
      if (part) node.appendChild(document.createTextNode(part));
    });

    return node;
  }

  function metadataNode(publication) {
    var children = [
      el("span", { class: "publication__venue", text: publication.venue })
    ];

    if (publication.year) {
      children.push(" · ");
      children.push(
        el("time", {
          datetime: String(publication.year),
          text: String(publication.year)
        })
      );
    }

    if (publication.status === "under review") {
      children.push(
        el("span", {
          class: "chip chip--accent publication__status",
          text: "Under review"
        })
      );
    }

    return el("p", { class: "publication__meta" }, children);
  }

  function publicationItem(publication) {
    var children = [
      el("h4", { class: "publication__title", text: publication.name }),
      authorsNode(publication.authorsShort),
      metadataNode(publication)
    ];

    if (publication.link) {
      children.push(
        el(
          "a",
          {
            class: "eco-card__link publication__link",
            href: publication.link,
            target: "_blank",
            rel: "noopener",
            "aria-label":
              "Open " +
              publication.linkLabel +
              " for “" +
              publication.name +
              "” (opens in a new tab)"
          },
          [publication.linkLabel, icon("arrow-up-right")]
        )
      );
    }

    return el(
      "li",
      {
        class: "card publication",
        "data-type": publication.type,
        "data-status": publication.status
      },
      children
    );
  }

  function publicationGroup(group) {
    var headingId = "publication-group-" + group.type;
    var items = publications.filter(function (publication) {
      return publication.type === group.type;
    });
    var list = el("ol", { class: "publications__list", role: "list" });

    items.forEach(function (publication) {
      list.appendChild(publicationItem(publication));
    });

    return el(
      "section",
      { class: "publications__group", "aria-labelledby": headingId },
      [
        el("h3", {
          class: "publications__group-title",
          id: headingId,
          text: group.title
        }),
        list
      ]
    );
  }

  function renderPublications() {
    var root = document.getElementById("publications-list");
    if (!root) return;

    root.replaceChildren();

    if (!publications.length) {
      root.appendChild(
        el("p", {
          class: "placeholder",
          text: "Publication data is temporarily unavailable."
        })
      );
      return;
    }

    groups.forEach(function (group) {
      if (
        publications.some(function (publication) {
          return publication.type === group.type;
        })
      ) {
        root.appendChild(publicationGroup(group));
      }
    });
  }

  try {
    if (typeof el !== "function" || typeof icon !== "function") {
      throw new Error("Shared view helpers are unavailable");
    }
    renderPublications();
  } catch (error) {
    if (window.console && console.warn) {
      console.warn("[publications-view.js] Publications failed to render:", error);
    }
  }
})();
