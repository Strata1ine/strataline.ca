import { tick } from "svelte";
import { modals } from "./stores";
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
].join(", ");

export function focusLock(node) {
  let isActive = false;
  let focusable = Array.from(node.querySelectorAll(interactable));
  let previousFocus;
  let focusedIdx = 0;

  function update(active) {
    isActive = active;
    document.body.classList.toggle("overflow-hidden", active);

    if (active) {
      previousFocus = document.activeElement;
      focusedIdx = 1;

      if (
        previousFocus &&
        previousFocus.classList.contains("include-in-focuslock") &&
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
        if (focusable[focusedIdx]) focusable[focusedIdx].focus();
      });
    } else {
      document
        .querySelectorAll(interactable)
        .forEach((e) => e.removeAttribute("inert"));

      if (previousFocus) previousFocus.focus();
    }
  }

  const keydown = (event) => {
    if (!isActive) return;

    if (event.key === "Escape") {
      modals.close();
    } else if (event.key === "Tab") {
      event.preventDefault();

      if (event.shiftKey) {
        focusedIdx = (focusedIdx - 1 + focusable.length) % focusable.length;
      } else {
        focusedIdx = (focusedIdx + 1) % focusable.length;
      }

      focusable[focusedIdx].focus();
    }
  };

  window.addEventListener("keydown", keydown);

  return {
    update: update,
    destroy() {
      window.removeEventListener("keydown", keydown);
      update(false);
    },
  };
}
