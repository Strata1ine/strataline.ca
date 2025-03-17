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

function inScreen(e: Element) {
  const rect = e.getBoundingClientRect();
  return !(rect.bottom < 0 || rect.top > window.innerHeight);
}

window.slideNext = function(id: string, slideNum: number) {
  const slideshow = document.getElementById(id) as HTMLElement;
  const prevIndexAttr = parseInt(slideshow.getAttribute("data-slide-idx") ?? "0", 10);
  const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;

  document.querySelectorAll(`[data-id="${id}"]`).forEach((slideButton) => {
    slideButton.children[prevIndex].classList.remove("active");
    slideButton.children[slideNum].classList.add("active");
    slideButton.setAttribute("data-slide-idx", slideNum.toString());
  });

  slideshow.children[prevIndex].classList.remove("active");
  slideshow.children[slideNum].classList.add("active");
  slideshow.setAttribute("data-slide-mutated", "");
  slideshow.setAttribute("data-slide-idx", slideNum.toString());
}

let lastActiveMenu: HTMLElement | null;
window.toggleDropdown = function(e: HTMLElement) {
  const dropdown = e.nextElementSibling as HTMLElement;
  dropdown.classList.toggle("active");
  if (e.classList.toggle("active")) {
    lastActiveMenu = e;
  } else {
    lastActiveMenu = null;
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
  menu.classList.toggle("active");
  document.body.classList.toggle("overflow-hidden");

  // the menu's trigger button, optional
  const e = document.querySelector(`[data-idx="${id}"]`) as HTMLElement;
  if (e != null) {
    e.classList.toggle("active");
    document.documentElement.classList.remove("scroll-smooth");
    e.scrollIntoView(true);
    setTimeout(() => {
      window.scrollBy(0, -16);

      document.documentElement.classList.add("scroll-smooth");
    }, 0);
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
        if (!slideshow.hasAttribute("data-slide-mutated")) {
          const prevIndexAttr = parseInt(slideshow.getAttribute("data-slide-idx") ?? "0", 10);
          const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;
          const nextIndex = (prevIndex + 1) % slideshow.children.length;
          window.slideNext(slideshow.id.toString(), nextIndex);
        } else {
          slideshow.removeAttribute("data-slide-mutated");
        }
      }

    }, speed);
  });

  document.querySelectorAll("[data-carousel-wrapper]").forEach((wrapper) => {
    const carousel = wrapper.querySelector("[data-carousel]") as HTMLElement;
    carousel.innerHTML += carousel.innerHTML;

    const speedAttr = parseFloat(
      carousel.getAttribute("data-carousel-speed") ?? "1.0"
    );

    const wantedSpeed = isNaN(speedAttr) ? 1.0 : speedAttr;

    let autoDirection = 1;
    let currentSpeed = wantedSpeed;
    let isDown = false;
    let startX = 0;
    let dragOffset = 0;
    let rawOffset = 0;
    let lastXDiff = 0;

    function updateTranslation() {
      const halfWidth = carousel.scrollWidth / 2;
      const visibleOffset = ((rawOffset % halfWidth) + halfWidth) % halfWidth;
      carousel.setAttribute(
        "style",
        `transform: translateX(-${visibleOffset}px)`
      );
    }

    function animate() {
      if (!isDown && inScreen(carousel)) {
        rawOffset += autoDirection * currentSpeed;
        updateTranslation();
      }

      requestAnimationFrame(animate);
    }

    animate();

    wrapper.addEventListener(
      "pointerdown",
      ((e: PointerEvent): void => {
        isDown = true;
        currentSpeed = 0;
        startX = e.pageX;
        dragOffset = rawOffset;
        wrapper.setPointerCapture(e.pointerId);
        e.preventDefault();
      }) as EventListener
    );

    wrapper.addEventListener(
      "pointermove",
      ((e: PointerEvent): void => {
        if (!isDown) return;
        const xDiff = e.pageX - startX;
        lastXDiff = xDiff;
        rawOffset = dragOffset - xDiff;
        updateTranslation();
      }) as EventListener
    );

    wrapper.addEventListener(
      "pointerup",
      ((e: PointerEvent): void => {
        isDown = false;
        currentSpeed = wantedSpeed;
        wrapper.releasePointerCapture(e.pointerId);
        autoDirection = lastXDiff > 0 ? -1 : 1;
      }) as EventListener
    );

    wrapper.addEventListener(
      "pointercancel",
      ((e: PointerEvent): void => {
        isDown = false;
        currentSpeed = wantedSpeed;
        wrapper.releasePointerCapture(e.pointerId);
      }) as EventListener
    );
  });
}
