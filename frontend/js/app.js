const app = document.querySelector("#app");

document.addEventListener("DOMContentLoaded", () => {
  changePage("landing");
})

window.addEventListener("hashchange", changePage);

async function changePage(location) {
  let viewName = window.location.hash.split("#")[1];
  if (typeof location === "string") viewName = location;

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
    default: {
      app.innerHTML = await getHtml(viewName);
    }
  }

}
async function getHtml(viewName) {
  const resp = await fetch(`../views/${viewName}.html`);
  const html = await resp.text();
  return html;
}