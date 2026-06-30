/* =============================================================================
   Valentin Boussot — shared, dependency-free DOM view helpers.

   Renderers use these helpers to create trusted text nodes and sprite icons
   without duplicating DOM construction code or interpolating HTML strings.
   ========================================================================== */

(function () {
  "use strict";

  function el(tag, props, children) {
    var node = document.createElement(tag);

    if (props) {
      Object.keys(props).forEach(function (key) {
        if (key === "class") node.className = props[key];
        else if (key === "text") node.textContent = props[key];
        else node.setAttribute(key, props[key]);
      });
    }

    (children || []).forEach(function (child) {
      if (child == null) return;
      node.appendChild(
        typeof child === "string" ? document.createTextNode(child) : child
      );
    });

    return node;
  }

  function icon(id) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");

    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#icon-" + id);
    svg.appendChild(use);

    return svg;
  }

  window.siteView = window.siteView || {};
  window.siteView.el = el;
  window.siteView.icon = icon;
})();
