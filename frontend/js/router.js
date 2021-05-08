const possibleHash = [
  "landing",
  "location",
  "opening-hours",
  "login",
  "desserts",
  "coffee",
  "profile",
  "cart",
  "manage-goods"
];

async function getHtml(viewName) {
  switch (document.documentElement.lang) {
    case "ru": {
      const resp = await fetch(`../views/ru/${viewName}.ru.html`);
      const html = await resp.text();
      return html;
    }
    case "en": {
      const resp = await fetch(`../views/${viewName}.html`);
      const html = await resp.text();
      return html;
    }
  }
}

async function insertStaticElems(elemName) {
  const elemNode = document.querySelector(`#${elemName}`);

  switch (document.documentElement.lang) {
    case "ru": {
      const resp = await fetch(`../views/ru/${elemName}.ru.html`);
      const html = await resp.text();
      elemNode.innerHTML = html;
      document.dispatchEvent(new CustomEvent(elemName))
      break;
    }
    case "en": {
      const resp = await fetch(`../views/${elemName}.html`);
      const html = await resp.text();
      elemNode.innerHTML = html;
      document.dispatchEvent(new CustomEvent(elemName))
      break;
    }
  }
}

export { getHtml, insertStaticElems, possibleHash }