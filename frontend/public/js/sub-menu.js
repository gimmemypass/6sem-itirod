const subMenuBtn = document.querySelector(".sub-menu__btn");
const subMenuList = document.querySelector(".sub-menu__list");

subMenuBtn.addEventListener("click", () => {
  subMenuList.classList.toggle("open");
})