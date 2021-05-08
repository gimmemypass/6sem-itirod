import { getHtml, insertStaticElems } from "./router.js";

let lang = document.querySelector("#language");

document.addEventListener("footer", () => {
  lang = document.querySelector("#language");
  lang.addEventListener("change", changeLang);
})

lang.addEventListener("change", changeLang);

function changeLang(e) {
  let viewName = window.location.hash.split("#")[1] || "landing";
  switch (e.target.value) {
    case "ru": {
      document.documentElement.lang = "ru";
      window.location.hash = "";
      insertStaticElems("header");
      insertStaticElems("footer");
      window.location.hash = viewName;
      break;
    }
    case "en": {
      document.documentElement.lang = "en";
      window.location.hash = "";
      insertStaticElems("header");
      insertStaticElems("footer");
      window.location.hash = viewName;
      break;
    }
  }
}