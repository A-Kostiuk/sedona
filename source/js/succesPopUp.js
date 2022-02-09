const modalSucces = document.querySelector(".modal--succes");
const modalFalture = document.querySelector(".modal--falture");
const modalCloseSucces = modalSucces.querySelector(".modal__button");
const modalCloseFalture = modalFalture.querySelector(".modal__button");
const form = document.querySelector(".feedback-form");

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    form.setAttribute("novalidate", true);
    if (form.checkValidity()) {
      modalSucces.classList.add("modal--show");
    } else {
      modalFalture.classList.add("modal--show");
    }
})

let closePopUp = (button, modal) => {
  button.addEventListener("click", () => {
  modal.classList.remove("modal--show");
  })
}
closePopUp(modalCloseSucces, modalSucces);
closePopUp(modalCloseFalture, modalFalture);

window.addEventListener("keydown", (evt) => {
  if (evt.keyCode === 27 && (modalSucces.classList.contains("modal--show") || modalFalture.classList.contains("modal--show"))) {
    modalFalture.classList.remove("modal--show");
    modalSucces.classList.remove("modal--show");
  }
})
