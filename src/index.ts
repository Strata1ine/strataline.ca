import smoothscroll from 'smoothscroll-polyfill';
window.__forceSmoothScrollPolyfill__ = true;
smoothscroll.polyfill();

declare global {
  interface Window {
    back: () => void;
    slideNext: (id: string, slideNum: number) => void;
    toggleDropdown: (e: HTMLElement) => void;
    toggleMenu: (id: string, dontScroll: boolean) => void;
    sliderTo: (id: string, idx: number) => void;
  }
}

function inScreen(e: Element) {
  const rect = e.getBoundingClientRect();
  return !(rect.bottom < 0 || rect.top > window.innerHeight);
}

window.back = function back() {
  if (history.length > 1 && document.referrer) {
    try {
      const referrerHost = new URL(document.referrer).hostname;
      const currentHost = window.location.hostname;

      if (referrerHost === currentHost) {
        history.back();
        return;
      }
    } catch (e) {
      // Handle potential URL parsing errors
      console.error("Error parsing referrer URL:", e);
    }
  }

  // Default fallback
  window.location.href = '/';
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

window.toggleMenu = function(id: string, dontScroll: boolean) {
  (document.getElementById(id) as HTMLElement).classList.toggle("active");
  document.body.classList.toggle("overflow-hidden");

  // bad api
  if (!dontScroll) {
    setTimeout(() => {
      if (document.scrollingElement != null) {
        document.scrollingElement.scrollTop = 0;
      }
    }, 0);
  }

  // the menu's trigger button, optional
  const e = document.querySelector(`[data-idx="${id}"]`) as HTMLElement;
  if (e != null) {
    e.classList.toggle("active");
  }
}

window.sliderTo = function(id: string, idx: number) {
  const slider = document.getElementById(id) as HTMLElement;
  const cards = slider.querySelectorAll('[data-slider-card]');
  const style = window.getComputedStyle(cards[idx]);
  const width = cards[idx].getBoundingClientRect().width + parseFloat(style.marginLeft) || 0;
  slider.scrollTo({ left: width * idx, behavior: 'smooth' });
  (slider.nextElementSibling?.children[0]).setAttribute("style", `transform: translateX(${idx * 100}%); width: ${100 / cards.length}%`);
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

  document.querySelectorAll("[data-carousel]").forEach(carousel => {
    // lol
    carousel.innerHTML += carousel.innerHTML += carousel.innerHTML;

    const speedAttr = parseFloat(carousel.getAttribute("data-carousel-speed") ?? "1.0");
    const speed = isNaN(speedAttr) ? 1.0 : speedAttr;
    let offset = 0;

    function animate() {
      if (inScreen(carousel)) {
        offset += speed;
        if (offset >= carousel.scrollWidth / 2) {
          offset = 0;
        }

        carousel.setAttribute("style", `transform: translateX(-${offset}px)`);
      }

      requestAnimationFrame(animate);
    }

    animate();
  });

  document.querySelectorAll("[data-slider]").forEach((slider, _: number) => {
    const cards = slider.querySelectorAll('[data-slider-card]');
    const scroller = slider.nextElementSibling?.children[0] as HTMLElement;

    const threshold = 25;
    const length = cards.length;
    if (length === 0) return;

    scroller.setAttribute("style", `width: ${100 / length}%`);

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let idx = 0;

    const finalizeDrag = (pageX: number) => {
      if (!isDown) return;

      const diff = pageX - startX;
      const style = window.getComputedStyle(cards[idx]);
      const width = cards[idx].getBoundingClientRect().width + parseFloat(style.marginLeft);
      let steps = Math.round(Math.abs(diff) / width);

      if (steps === 0 && Math.abs(diff) > threshold) {
        steps = 1;
      }

      if (diff < 0) {
        idx = Math.min(idx + steps, cards.length - 1);
      } else if (diff > 0) {
        idx = Math.max(idx - steps, 0);
      }


      slider.scrollTo({ left: width * idx, behavior: 'smooth' });
      scroller.setAttribute("style", `transform: translateX(${idx * 100}%); width: ${100 / length}%`);
    };

    slider.addEventListener('mousedown', ((e: MouseEvent): void => {
      isDown = true;
      startX = e.pageX;
      scrollLeft = slider.scrollLeft;
    }) as EventListener);

    slider.addEventListener('touchstart', ((e: TouchEvent): void => {
      isDown = true;
      startX = e.touches[0].pageX;
      scrollLeft = slider.scrollLeft;
    }) as EventListener, { passive: true });

    slider.addEventListener('mouseleave', () => { isDown = false; });
    slider.addEventListener('mousemove', ((e: MouseEvent): void => {
      if (!isDown) return;
      const diff = e.pageX - startX;
      if (Math.abs(diff) > threshold) {
        slider.scrollLeft = scrollLeft - diff;
      }
    }) as EventListener);

    slider.addEventListener('touchend', ((e: TouchEvent) => {
      if (!isDown) return;
      finalizeDrag(e.changedTouches[0].pageX);
      isDown = false;
    }) as EventListener, { passive: true });

    slider.addEventListener('mouseup', ((e: MouseEvent): void => { finalizeDrag(e.pageX); isDown = false; }) as EventListener);
  });
}
