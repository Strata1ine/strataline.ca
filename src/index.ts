import smoothscroll from 'smoothscroll-polyfill';
window.__forceSmoothScrollPolyfill__ = true;
smoothscroll.polyfill();

const isIOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

declare global {
  interface Window {
    slideNext: (id: string, slideNum: number) => void;
    toggleDropdown: (e: HTMLElement) => void;
    toggleFaq: (e: HTMLElement) => void;
    toggleMenu: (id: string) => void;
    sliderTo: (idx: number) => void;
    carouselNext: (id: string) => void;
    carouselPrev: (id: string) => void;
  }
}

window.carouselNext = (id: string) => {
  const e = document.getElementById(id) as HTMLElement;
  handleCarousel(e, true);
}

window.carouselPrev = (id: string) => {
  const e = document.getElementById(id) as HTMLElement;
  handleCarousel(e, false);
}

function handleCarousel(e: HTMLElement, next: boolean) {
  const idx = parseInt(e.getAttribute("data-idx") || "0") || 0;
  const length = e.children.length - 1;
  if (length <= 0) {
    return;
  }

  let nextIdx: number;
  if (next) {
    nextIdx = (idx + 1) % length;
  } else {
    nextIdx = (idx - 1 + length) % length;
  }

  e.setAttribute("style", `transform: translateX(-${nextIdx * 110}%)`)
  e.setAttribute("data-idx", nextIdx.toString());
  e.children[nextIdx].children[0]?.setAttribute("loading", "eager");

  if (next) {
    nextIdx = (nextIdx + 1) % length;
  } else {
    nextIdx = (nextIdx - 1 + length) % length;
  }

  e.children[nextIdx].children[0]?.setAttribute("loading", "eager");
}

function inScreen(e: Element) {
  const rect = e.getBoundingClientRect();
  return !(rect.bottom < 0 || rect.top > window.innerHeight);
}

window.slideNext = function(id: string, slideNum: number) {
  const slideshow = document.getElementById(id) as HTMLElement;
  const prevIndexAttr = parseInt(slideshow.getAttribute("data-slide-idx") ?? "0", 10);
  const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;

  document.querySelectorAll(`[data-slide-nav="${id}"]`).forEach((slideButton) => {
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
    e.scrollIntoView(true);
  }
}

window.toggleFaq = function(e: HTMLElement) {
  let p = e.querySelector("p");
  let expand = e.querySelector(".expand");
  if (p != null && p instanceof HTMLElement) {
    p.classList.toggle("active");
  }

  if (expand != null && expand instanceof HTMLElement) {
    expand.classList.toggle("active");
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
    const speedAttr = parseInt(slideshow.getAttribute("data-slideshow-speed") ?? "3000", 10);
    const speed = isNaN(speedAttr) ? 1000 : speedAttr;

    setInterval(() => {
      if (!inScreen(slideshow)) {
        return;
      }

      if (!slideshow.hasAttribute("data-slide-mutated")) {
        const prevIndexAttr = parseInt(slideshow.getAttribute("data-slide-idx") ?? "0", 10);
        const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;
        const nextIndex = (prevIndex + 1) % slideshow.children.length;
        window.slideNext(slideshow.id.toString(), nextIndex);
      } else {
        slideshow.removeAttribute("data-slide-mutated");
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

  const slider = document.getElementById("review-slider");
  if (slider != null && slider instanceof HTMLElement) {
    const scrollbar = document.getElementById("review-scroller") as HTMLElement;
    const cards = slider.querySelectorAll("[data-slider-card]");
    const ml = parseFloat(window.getComputedStyle(cards[0]).marginLeft) || 0;
    const isSliderOutside = window.matchMedia(`(max-width: ${((cards[0].getBoundingClientRect().width + ml) * cards.length) / 2 + 15}px)`);
    scrollbar.setAttribute("style", `width: ${100 / sliderLength(cards.length)}%`);

    isSliderOutside.addEventListener("change", function() {
      handleChange();
    });

    function handleChange() {
      if (!isSliderOutside.matches && cards.length <= 2) {
        scrollbar.parentElement?.classList.add("hidden");
      } else {
        scrollbar.parentElement?.classList.remove("hidden");
      }
    }

    const threshold = 25;
    if (cards.length === 0) return;

    function sliderLength(n: number): number {
      return n - (isSliderOutside.matches ? 0 : 1);
    }

    window.sliderTo = function(idx: number) {
      const cards = slider.querySelectorAll('[data-slider-card]');
      const width = cards[idx].getBoundingClientRect().width + ml;
      slider.scrollTo({ left: width * idx, behavior: 'smooth' });
      scrollbar.setAttribute("style", `transform: translateX(${idx * 100}%); width: ${100 / sliderLength(cards.length)}%`);
    }

    handleChange();

    let isDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let idx = 0;

    const finalizeDrag = (pageX: number, pageY: number): void => {
      if (!isDown) return;

      const diffX = pageX - startX;
      const diffY = pageY - startY;
      const style = window.getComputedStyle(cards[idx]);
      const width =
        cards[idx].getBoundingClientRect().width +
        parseFloat(style.marginLeft);

      if (Math.abs(diffX) < Math.abs(diffY)) {
        slider.scrollTo({ left: width * idx, behavior: "smooth" });
        return;
      }

      let steps = Math.round(Math.abs(diffX) / width);
      if (steps === 0 && Math.abs(diffX) > threshold) {
        steps = 1;
      }

      if (diffX < 0) {
        idx = Math.min(idx + steps, sliderLength(cards.length) - 1);
      } else if (diffX > 0) {
        idx = Math.max(idx - steps, 0);
      }

      slider.scrollTo({ left: width * idx, behavior: "smooth" });
      scrollbar.setAttribute(
        "style",
        `transform: translateX(${idx * 100}%); width: ${100 / sliderLength(cards.length)}%`
      );
    };

    if (isIOS) {
      // Use touch events on iOS.
      slider.addEventListener(
        "touchstart",
        ((e: TouchEvent): void => {
          isDown = true;
          startX = e.touches[0].pageX;
          startY = e.touches[0].pageY;
          scrollLeft = slider.scrollLeft;
        }) as EventListener,
        { passive: true }
      );

      slider.addEventListener(
        "touchmove",
        ((e: TouchEvent): void => {
          if (!isDown) return;
          // Prevent default if horizontal movement dominates,
          // to avoid iOS interfering with the drag gesture.
          if (
            Math.abs(e.touches[0].pageX - startX) >
            Math.abs(e.touches[0].pageY - startY)
          ) {
            e.preventDefault();
          }
          const diff = e.touches[0].pageX - startX;
          slider.scrollLeft = scrollLeft - diff;
        }) as EventListener,
        { passive: false }
      );

      slider.addEventListener(
        "touchend",
        ((e: TouchEvent): void => {
          if (!isDown) return;
          finalizeDrag(
            e.changedTouches[0].pageX,
            e.changedTouches[0].pageY
          );
          isDown = false;
        }) as EventListener,
        { passive: true }
      );

      slider.addEventListener(
        "touchcancel",
        ((e: TouchEvent): void => {
          if (!isDown) return;
          finalizeDrag(
            e.changedTouches[0].pageX,
            e.changedTouches[0].pageY
          );
          isDown = false;
        }) as EventListener,
        { passive: true }
      );
    } else {
      // Use pointer events on non-iOS.
      slider.addEventListener(
        "pointerdown",
        ((e: PointerEvent): void => {
          isDown = true;
          startX = e.pageX;
          startY = e.pageY;
          scrollLeft = slider.scrollLeft;
          slider.setPointerCapture(e.pointerId);
        }) as EventListener,
        { passive: true }
      );

      slider.addEventListener(
        "pointermove",
        ((e: PointerEvent): void => {
          if (!isDown) return;
          // Prevent default if horizontal movement dominates.
          if (Math.abs(e.pageX - startX) > Math.abs(e.pageY - startY)) {
            e.preventDefault();
          }
          const diff = e.pageX - startX;
          slider.scrollLeft = scrollLeft - diff;
        }) as EventListener,
        { passive: false }
      );

      slider.addEventListener(
        "pointerup",
        ((e: PointerEvent): void => {
          if (!isDown) return;
          finalizeDrag(e.pageX, e.pageY);
          isDown = false;
          slider.releasePointerCapture(e.pointerId);
        }) as EventListener,
        { passive: true }
      );

      slider.addEventListener(
        "pointercancel",
        ((e: PointerEvent): void => {
          if (!isDown) return;
          finalizeDrag(e.pageX, e.pageY);
          isDown = false;
          slider.releasePointerCapture(e.pointerId);
        }) as EventListener,
        { passive: true }
      );

      slider.addEventListener(
        "pointerleave",
        (() => {
          isDown = false;
        }) as EventListener,
        { passive: true }
      );
    }
  }
}
