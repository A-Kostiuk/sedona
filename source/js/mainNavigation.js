const mobileNavigation = () => {
  const button = document.querySelector(".main-nav__toggle");
  const mainNav = document.querySelector(".main-nav");

  mainNav.classList.remove("main-nav--nojs");

  button.addEventListener("click", () => {
    mainNav.classList.toggle("main-nav--closed");
    mainNav.classList.toggle("main-nav--opened");
  });
};

mobileNavigation()
