let subMenuBtn = document.querySelector(".sub-menu__btn");
let subMenuList = document.querySelector(".sub-menu__list");

document.addEventListener("header", () => {
  subMenuBtn = document.querySelector(".sub-menu__btn");
  subMenuList = document.querySelector(".sub-menu__list");
  subMenuBtn.addEventListener("click", toggleMenu);
})

subMenuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  subMenuList.classList.toggle("open");

  document.addEventListener("click", closeMenu);

  function closeMenu(e) {
    if (e.target.closest(".sub-menu")) return;

    subMenuList.classList.remove("open");
    document.removeEventListener("click", closeMenu);
  }
}