/* =============================================================================
   Valentin Boussot — vboussot.github.io
   Client-side interactions. Dependency-free, progressive enhancement.

   Loaded with `defer`, so the DOM is already parsed when this runs. The inline
   <head> script has already added the `.js` class and applied any pinned theme,
   so there is no flash of the wrong colour scheme.

   Features (each isolated so one failure can't disable the others):
     1. Theme toggle  — system default, manual light/dark, persisted
     2. Mobile nav    — disclosure pattern with ARIA, Escape, outside-click
     3. Anchor scroll — smooth in-page scrolling + a11y focus, reduced-motion aware
     4. Reveal        — IntersectionObserver, disabled under reduced motion
     5. Footer year   — keep the copyright current
     6. Podium medals — gold/silver/bronze badge on the top-3 ranking metrics
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function isolate(name, fn) {
    try {
      fn();
    } catch (err) {
      // Never let one broken feature take down the rest of the page.
      if (window.console && console.warn) console.warn("[main.js] " + name + " failed:", err);
    }
  }

  /* 1. THEME TOGGLE ========================================================= */
  isolate("theme-toggle", function () {
    var STORAGE_KEY = "theme";
    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    // True when the *effective* scheme is dark, whether pinned or from the OS.
    function isDark() {
      var pinned = root.dataset.theme;
      if (pinned === "dark") return true;
      if (pinned === "light") return false;
      return prefersDark.matches;
    }

    // The CSS swaps the sun/moon icon purely from `data-theme` + the media
    // query, so here we only keep the accessible state in sync.
    function sync() {
      var dark = isDark();
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }

    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {}
      sync();
    });

    // While following the OS (no pinned choice), react if the OS theme changes.
    prefersDark.addEventListener("change", function () {
      if (!root.dataset.theme) sync();
    });

    sync();
  });

  /* 2. MOBILE NAVIGATION (disclosure) ====================================== */
  isolate("mobile-nav", function () {
    var header = document.querySelector(".site-header");
    var navToggle = document.querySelector(".nav-toggle");
    if (!header || !navToggle) return;

    function isOpen() {
      return header.hasAttribute("data-nav-open");
    }
    function setOpen(open) {
      if (open) header.setAttribute("data-nav-open", "");
      else header.removeAttribute("data-nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    }

    navToggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    // Escape closes and returns focus to the toggle.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        setOpen(false);
        navToggle.focus();
      }
    });

    // Click outside the header closes the menu.
    document.addEventListener("click", function (e) {
      if (isOpen() && !header.contains(e.target)) setOpen(false);
    });

    // If the viewport grows past the mobile breakpoint, drop the open state so
    // the desktop nav is never stuck in the "open" styling.
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });

    // Expose for the anchor-scroll handler below.
    root.__closeNav = function () {
      if (isOpen()) setOpen(false);
    };
  });

  /* 3. SMOOTH IN-PAGE ANCHOR SCROLLING ===================================== */
  isolate("anchor-scroll", function () {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute("href");
      if (!hash || hash.length < 2) return; // ignore bare "#"

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      if (typeof root.__closeNav === "function") root.__closeNav();

      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      // Keep the URL shareable without an extra jump.
      if (window.history && history.pushState) history.pushState(null, "", hash);

      // Move focus to the destination for keyboard / screen-reader users.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* 4. REVEAL ON SCROLL ==================================================== */
  isolate("reveal", function () {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // Respect reduced motion (and missing IO support): just show everything.
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  });

  /* 5. FOOTER YEAR ========================================================= */
  isolate("footer-year", function () {
    var el = document.getElementById("footer-year");
    if (el) el.textContent = String(new Date().getFullYear());
  });

  /* 6. PODIUM MEDALS ======================================================= */
  // Turn the leading rank of each .metric into a podium badge: a gold / silver /
  // bronze medal for places 1–3, with 4th+ receding (.metric--plain). Pure
  // enhancement — without JS the rank stays as its (gold) text, fully readable.
  isolate("podium-medals", function () {
    var SVGNS = "http://www.w3.org/2000/svg";
    var PLACE = { 1: "gold", 2: "silver", 3: "bronze" };
    document.querySelectorAll(".metric").forEach(function (metric) {
      var rank = metric.querySelector(".metric__rank");
      if (!rank) return;
      var match = (rank.textContent || "").match(/\d+/);
      if (!match) return;
      var place = PLACE[parseInt(match[0], 10)];
      if (!place) {
        metric.classList.add("metric--plain");
        return;
      }
      metric.classList.add("metric--" + place);
      var svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("class", "metric__medal");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      var use = document.createElementNS(SVGNS, "use");
      use.setAttribute("href", "#icon-medal");
      svg.appendChild(use);
      rank.insertBefore(svg, rank.firstChild);
    });
  });
})();
