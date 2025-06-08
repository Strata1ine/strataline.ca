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

export function focusLock(node) {
  let focusable = Array.from(node.querySelectorAll(interactable.filter(e => e.tabIndex !== -1)));
  let previousFocus;
  let focusedIdx = 0;

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  node.addEventListener('keydown', handleKeyDown, true);

  return {
    update: (active) => {
      document.body.classList.toggle("overflow-hidden", active);

      if (active) {
        previousFocus = document.activeElement;
        focusedIdx = 1;

        if (
          previousFocus &&
          previousFocus.hasAttribute("include-in-focuslock") &&
          !focusable.includes(previousFocus)
        ) {
          focusable.unshift(previousFocus);
        }

        Array.from(document.querySelectorAll(interactable))
          .filter((e) => !focusable.includes(e))
          .forEach((e) => {
            e.setAttribute("inert", "");
          });

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
      node.removeEventListener('keydown', handleKeyDown, true);
      update(false);
    },
  };
}
