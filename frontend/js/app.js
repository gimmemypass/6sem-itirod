import { Good } from "./goods/good.js";
import { getHtml, insertStaticElems, possibleHash } from "./router.js";

const app = document.querySelector("#app");
let auth; // instance of Auth, which will be created in login view
const good = new Good();

// insertStaticElems("footer");
// insertStaticElems("header");
changePage("landing")

window.addEventListener("hashchange", changePage);

async function changePage(location) {
  let viewName = window.location.hash.split("#")[1];
  if (typeof location === "string") viewName = location;
  if (!possibleHash.includes(viewName)) return;

  switch (viewName) {
    case "location": {
      app.innerHTML = await getHtml("landing");
      document.getElementById("location").scrollIntoView({
        behavior: "smooth"
      });
      break;
    }
    case "opening-hours": {
      document.querySelector(".shedule__title").scrollIntoView({
        behavior: "smooth"
      });
      break;
    }
    case "login": {
      app.innerHTML = await getHtml(viewName);
      auth = new Auth({
        loginBtn: document.querySelector(".login-btn"),
        registerBtn: document.querySelector(".register-btn"),
        form: document.forms.login,
        errorField: document.querySelector(".error-field"),
      });
      break;
    }
    case "profile": {
      app.innerHTML = await getHtml(viewName);
      auth.setLogoutBtn(document.querySelector(".logout-btn"));
      break;
    }
    case "manage-goods": {
      if (auth.isAdmin()) {
        app.innerHTML = await getHtml(viewName);
      }
      good.setAddBtn(document.querySelector(".add-good-btn"));
      good.setGoodsList(document.querySelector(".goods__list"));
      good.setModal(document.querySelector("#modal"));
      good.showAll(good.getGoodTypes(), true);
      break;
    }
    case "desserts": {
      app.innerHTML = await getHtml(viewName);
      good.setGoodsList(document.querySelector(".goods__list"));
      good.setSortSelect(document.querySelector("#sort-form__select"));
      good.showAll(["dessert"], false);
      break;
    }
    case "coffee": {
      app.innerHTML = await getHtml(viewName);
      good.setGoodsList(document.querySelector(".goods__list"));
      good.setSortSelect(document.querySelector("#sort-form__select"));
      good.showAll(["coffee"], false);
      break;
    }
    case "cart": {
      app.innerHTML = await getHtml(viewName);
      good.setGoodsList(document.querySelector(".goods__list"));
      good.setTotalPriceNode(document.querySelector(".cart__price"));
      good.showUserCart();
      break;
    }
    default: {
      app.innerHTML = await getHtml(viewName);
    }
  }
}