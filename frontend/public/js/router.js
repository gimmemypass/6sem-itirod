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

export { getHtml, possibleHash }