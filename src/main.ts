import Chart from 'chart.js/auto';
import { invoke } from '@tauri-apps/api/core';

/* Navigation */

// Left 'true' due to the app always scrolling to the view contained in the URL hash
// (or home view if none exists)
let isProgrammaticScroll = true;

const viewContainer = document.querySelector("#view-container");
const views = document.querySelectorAll<HTMLElement>("#view-container .view");

const navbarButtons = [...document.querySelectorAll("#bottom-navbar button")];

/* UI Components */
const translatorInput = document.querySelector("#translator-input");
const translatorOutput = document.querySelector("#translator-output");

// todo: add ui components for settings and all that, then have labels respond to <input> changes

/**
 *
 * @param {number} idx - Index of the view
 *
**/
function viewChangedHandler(idx: number) {
  let activeButton = navbarButtons[idx];

  if (!activeButton) {
      console.error(`Invalid view index: ${idx}`);
      return;
  }

  navbarButtons.forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });

  activeButton.classList.add("active");
  activeButton.setAttribute("aria-pressed", "true");
}

function morseInputHandler(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const input = target.value;

    invoke<string>('convert_from_morse', { input }).then((message: string) => {
        if (!translatorOutput) return;
        translatorOutput.textContent = message;
    });
}

// todo: proper chart
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
    document.getElementById('letters') as HTMLCanvasElement,
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

  if (!viewContainer) {
      throw new Error('viewContainer not found');
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

  if (!translatorInput) {
      throw new Error('translatorInput not found');
  }

  translatorInput.addEventListener("input", (str) => { morseInputHandler(str) });
});
