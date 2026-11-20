/*const { invoke } = window.__TAURI__.core;*/

/* Navigation */
let isProgrammaticScroll = false;

const viewContainer = document.querySelector("#view-container");
const views = document.querySelectorAll("#view-container .view");
const navbarButtons = [...document.querySelectorAll("#bottom-navbar button")];

/**
 *
 * @param {Number} idx - Index of the view
 */
function viewChangedHandler(idx) {
  let activeButton = navbarButtons[idx];

  navbarButtons.forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });

  activeButton.classList.add("active");
  activeButton.setAttribute("aria-pressed", "true");
}

document.addEventListener("DOMContentLoaded", () => {
  viewContainer.scrollTo({
    left: views[2].offsetLeft, // Homepage
    behavior: 'instant'
  });

  viewContainer.addEventListener('scroll', () => {
    if (isProgrammaticScroll) { return;  }

    let activeView = Math.round(viewContainer.scrollLeft / viewContainer.clientWidth);
    viewChangedHandler(activeView);
  });

  navbarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let idx = navbarButtons.indexOf(button);

      isProgrammaticScroll = true;

      viewContainer.scrollTo({
        left: views[idx].offsetLeft,
        behavior: 'smooth'
      });

      viewContainer.addEventListener("scrollend", () => {
        isProgrammaticScroll = false;
      }, { once: true });

      viewChangedHandler(idx);
    });
  });
});
