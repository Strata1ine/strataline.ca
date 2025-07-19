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
  "area[href]",
  "iframe",
  "object",
  "embed",
  "video[controls]",
  "audio[controls]",
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="switch"]',
  '[role="textbox"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="tree"]',
  '[role="grid"]',
  '[role="treegrid"]'
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
  let focusable = Array.from(node.querySelectorAll(interactable)).filter(el => el.getAttribute('aria-disabled') !== 'true' && !el.hasAttribute('inert'));
  let previousFocus;
  let focusedIdx = 0;

  function tabDown(e) {
    if (e.key !== 'Tab' || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }

  return {
    update: (active) => {
      node.addEventListener('keydown', tabDown);
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

        if (!focusable[0]) return;
        tick().then(() => {
          focusable[0].focus();
        });
      } else {
        node.removeEventListener('keydown', tabDown);
        document
          .querySelectorAll(interactable)
          .forEach((e) => e.removeAttribute("inert"));

        if (previousFocus) previousFocus.focus();
      }
    },
    destroy() {
      update(false);
      node.removeEventListener('keydown', tabDown);
    },
  };
}
