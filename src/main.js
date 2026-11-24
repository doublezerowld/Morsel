const { invoke } = window.__TAURI__.core;

import Chart from 'chart.js/auto';

/* Navigation */
let isProgrammaticScroll = true; // Left 'true' due to the app always scrolling to the view contained in the URL hash (or home view if none exists)

const viewContainer = document.querySelector("#view-container");
const views = document.querySelectorAll("#view-container .view");

const navbarButtons = [...document.querySelectorAll("#bottom-navbar button")];

/* UI Components */
const translatorInput = document.querySelector("#translator-input");

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

function morseInputHandler(event) {

  // Send to Rust
  console.log(event.target.value);
  invoke('get_chars');
}

(async function() {
  const data = [
    { day: 1, count: 8 },
    { day: 2, count: 15 },
    { day: 3, count: 18 },
    { day: 4, count: 22 },
    { day: 5, count: 24 },
    { day: 6, count: 26 },
  ];

  new Chart(
    document.getElementById('letters'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.day),
        datasets: [
          {
            label: 'Characters learned',
            data: data.map(row => row.count)
          }
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day',
            }
          }
        }
      }
    }
  );
})();

document.addEventListener("DOMContentLoaded", () => {
  /*
  * NAVIGATION
  */

  // Show the view contained in the hash for debugging purposes
  let initialView = 2; // Homepage
  let hash = window.location.hash.substring(1);

  if (hash != '') {
    for (let i = 0; i < views.length; i++) {
      if (views[i].id === hash) {
        initialView = i;
        break;
      }
    }
  }

  viewContainer.scrollTo({
    left: views[initialView].offsetLeft,
    behavior: 'instant'
  });

  viewContainer.addEventListener('scroll', () => {
    if (isProgrammaticScroll) { return; }

    let activeView = Math.round(viewContainer.scrollLeft / viewContainer.clientWidth);
    viewChangedHandler(activeView);
  });

  isProgrammaticScroll = false;

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

      window.location.hash = views[idx].id;

      viewChangedHandler(idx);
    });
  });

  /*
  * UI
  */

  translatorInput.addEventListener("input", (str) => { morseInputHandler(str) });
});
