export class FakeText {
  constructor(value) {
    this.textContent = value;
  }
}

export class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.className = "";
    this.attributes = new Map();
    this.childNodes = [];
    this._textContent = "";
  }

  appendChild(child) {
    this.childNodes.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.childNodes = [];
    children.forEach(child => this.appendChild(child));
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  set textContent(value) {
    this._textContent = String(value);
    this.childNodes = [];
  }

  get textContent() {
    return (
      this._textContent +
      this.childNodes.map(child => child.textContent).join("")
    );
  }

  hasClass(name) {
    return this.className.split(/\s+/).includes(name);
  }

  matches(selector) {
    return selector.startsWith(".")
      ? this.hasClass(selector.slice(1))
      : this.tagName === selector.toUpperCase();
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const matches = [];

    for (const child of this.childNodes) {
      if (!(child instanceof FakeElement)) continue;
      if (child.matches(selector)) matches.push(child);
      matches.push(...child.querySelectorAll(selector));
    }

    return matches;
  }
}

export function createFakeDocument(elements) {
  return {
    createElement: tag => new FakeElement(tag),
    createElementNS: (_namespace, tag) => new FakeElement(tag),
    createTextNode: value => new FakeText(value),
    getElementById: id => elements.get(id) ?? null
  };
}
