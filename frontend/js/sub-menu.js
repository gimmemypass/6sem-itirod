const subMenuBtn = document.querySelector(".sub-menu__btn");
const subMenuList = document.querySelector(".sub-menu__list");

subMenuBtn.addEventListener("click", () => {
  console.log("open");
  subMenuList.classList.toggle("open");
})