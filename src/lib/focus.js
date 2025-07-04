import { tick } from "svelte";

export const interactable = [
  "a[href]",
  "button",
  "input",
  "textarea",
  "select",
  "details",
  "summary",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="textbox"]',
  "video",
  "audio",
];

export function clickOutside(node, callback) {
  function c(event) {
    if (!node.contains(event.target)) {
      callback();
    }
  }

  document.addEventListener('click', c, true);
  document.addEventListener('focusin', c, true);

  return {
    update(newCallback) {
      callback = newCallback;
    },
    destroy() {
      document.removeEventListener('click', c, true);
      document.removeEventListener('focusin', c, true);
    }
  };
}

export function focusLock(node) {
  let focusable = Array.from(node.querySelectorAll(interactable.filter(e => e.tabIndex !== -1)));
  let previousFocus;
  let focusedIdx = 0;

  return {
    update: (active) => {
      document.body.classList.toggle("overflow-hidden", active);

      if (active) {
        previousFocus = document.activeElement;
        focusedIdx = 1;

        if (
          previousFocus &&
          previousFocus.hasAttribute("data-include-in-focuslock") &&
          !focusable.includes(previousFocus)
        ) {
          focusable.unshift(previousFocus);
        }

        Array.from(document.querySelectorAll(interactable))
          .filter((e) => !focusable.includes(e))
          .forEach((e) => {
            e.setAttribute("inert", "");
          });

        if (!focusable[1]) return;
        tick().then(() => {
          focusable[1].focus();
        });
      } else {
        document
          .querySelectorAll(interactable)
          .forEach((e) => e.removeAttribute("inert"));

        if (previousFocus) previousFocus.focus();
      }
    },
    destroy() {
      update(false);
    },
  };
}
