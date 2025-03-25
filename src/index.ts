import smoothscroll from 'smoothscroll-polyfill';
window.__forceSmoothScrollPolyfill__ = true;
smoothscroll.polyfill();

declare global {
  interface Window {
    slideNext: (id: string, slideNum: number) => void;
    toggleDropdown: (e: HTMLElement) => void;
    toggleMenu: (id: string) => void;
    activeVideo: HTMLVideoElement | null;
  }
}

if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) target.scrollIntoView();
  setTimeout(() => {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }, 0);
}

window.addEventListener('hashchange', () => {
  setTimeout(() => {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }, 0);
});

function inScreen(e: Element) {
  const rect = e.getBoundingClientRect();
  return !(rect.bottom < 0 || rect.top > window.innerHeight);
}

window.slideNext = function(id: string, slideNum: number) {
  const slideshow = document.getElementById(id) as HTMLElement;
  const prevIndexAttr = parseInt(slideshow.getAttribute("data-idx") ?? "0", 10);
  const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;

  document.querySelectorAll(`[data-id="${id}"]`).forEach((slideButton) => {
    slideButton.children[prevIndex].classList.remove("active");
    slideButton.children[slideNum].classList.add("active");
    slideButton.setAttribute("data-idx", slideNum.toString());
  });

  slideshow.children[prevIndex].classList.remove("active");
  slideshow.children[prevIndex].setAttribute("inert", "");
  slideshow.children[slideNum].classList.add("active");
  slideshow.children[slideNum].removeAttribute("inert");
  slideshow.setAttribute("data-lock", "");
  slideshow.setAttribute("data-idx", slideNum.toString());
}

let lastActiveMenu: HTMLElement | null;
window.toggleDropdown = function(e: HTMLElement) {
  const dropdown = e.nextElementSibling as HTMLElement;
  dropdown.classList.toggle("active");
  if (e.classList.toggle("active")) {
    lastActiveMenu = e;
    dropdown.removeAttribute("inert");
    dropdown.removeAttribute("aria-hidden");
  } else {
    lastActiveMenu = null;
    dropdown.setAttribute("inert", "");
    dropdown.setAttribute("aria-hidden", "true");
  }
}

window.addEventListener("click", function(e) {
  if (lastActiveMenu != null) {
    const targetElement = e.target as HTMLElement;
    const menu = lastActiveMenu.nextElementSibling as HTMLElement;
    if (!lastActiveMenu.contains(targetElement) && !menu.contains(targetElement)) {
      window.toggleDropdown(lastActiveMenu);
      lastActiveMenu = null;
    }
  }
});

window.toggleMenu = function(id: string) {
  const menu = document.getElementById(id) as HTMLElement;

  if (menu.classList.contains("active")) {
    menu.setAttribute("inert", "");
  } else {
    menu.removeAttribute("inert");
  }

  menu.classList.toggle("active");
  document.body.classList.toggle("overflow-hidden");

  const e = document.querySelector(`[data-idx="${id}"]`) as HTMLElement;
  if (e != null) {
    e.classList.toggle("active");
  }
}

window.onload = () => {
  setTimeout(() => {
    document.querySelectorAll("[data-safari-bad]").forEach(e => {
      const classes = (e.getAttribute("data-safari-bad") || "").split(" ");
      for (let clazz of classes) {
        e.classList.add(clazz);
      }
    });
  }, 20);

  document.querySelectorAll("[data-slideshow]").forEach(slideshow => {
    const speedAttr = parseInt(slideshow.getAttribute("data-slideshow-speed") ?? "4000", 10);
    const speed = isNaN(speedAttr) ? 4000 : speedAttr;

    setInterval(() => {
      if (inScreen(slideshow) && window.activeVideo == null &&
        slideshow.querySelector(':hover') == null
      ) {
        if (!slideshow.hasAttribute("data-lock")) {
          const prevIndexAttr = parseInt(slideshow.getAttribute("data-idx") ?? "0", 10);
          const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;
          const nextIndex = (prevIndex + 1) % slideshow.children.length;
          window.slideNext(slideshow.id.toString(), nextIndex);
        } else {
          slideshow.removeAttribute("data-lock");
        }
      }

    }, speed);
  });
}
