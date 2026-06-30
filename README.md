# vboussot.github.io

Personal researcher website for Valentin Boussot. Medical image analysis:
multimodal registration, domain adaptation, and anatomical-representation
learning, with the IMPACT ecosystem and the KonfAI framework.

Static site served by GitHub Pages from the repository root. No build step and
no dependencies: plain HTML, CSS, and vanilla JavaScript, with progressive
enhancement, automatic light/dark theming, and a WCAG 2.2 AA pass.

## Structure

```
index.html             Page shell, navigation, and all content sections
assets/css/styles.css  Design system: tokens, light/dark, components
assets/js/             Theme toggle, nav, reveal, and the data-driven
                       Projects and Publications renderers
assets/img/            Logos, research figures, icons, social card
tests/*.test.mjs       Dependency-free content, renderer, a11y and SEO tests
```

## Local preview

```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000/
```

## Tests

```bash
node --test tests/*.test.mjs
```
