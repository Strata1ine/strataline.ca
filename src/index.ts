import smoothscroll from 'smoothscroll-polyfill';
window.__forceSmoothScrollPolyfill__ = true;
smoothscroll.polyfill();

function slideNext(id: string, slideNum: number) {
  const slideshow = document.getElementById(id);

  if (slideshow != null && slideshow instanceof HTMLElement && slideNum >= 0 && slideNum < slideshow.children.length) {
    const prevIndexAttr = parseInt(slideshow.getAttribute("data-slide-idx") ?? "0", 10);
    const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;

    document.querySelectorAll(`[data-slide-nav="${id}"]`).forEach((slideButton) => {
      if (!(slideButton instanceof HTMLElement)) return;

      slideButton.children[prevIndex].classList.remove("active");
      slideButton.children[slideNum].classList.add("active");
      slideButton.setAttribute("data-slide-idx", slideNum.toString());
    });

    slideshow.children[prevIndex].classList.remove("active");
    slideshow.children[slideNum].classList.add("active");
    slideshow.setAttribute("data-slide-mutated", "");
    slideshow.setAttribute("data-slide-idx", slideNum.toString());
  }
}

function inScreen(e: Element) {
  const rect = e.getBoundingClientRect();
  return !(rect.bottom < 0 || rect.top > window.innerHeight);
}

window.slideNext = slideNext;
window.addEventListener('load', function() {
  document.querySelectorAll("[data-slideshow]").forEach(slideshow => {
    const speedAttr = parseInt(slideshow.getAttribute("data-slideshow-speed") ?? "3000", 10);
    const speed = isNaN(speedAttr) ? 1000 : speedAttr;

    this.setInterval(() => {
      if (!inScreen(slideshow)) {
        return;
      }

      if (!slideshow.hasAttribute("data-slide-mutated")) {
        const prevIndexAttr = parseInt(slideshow.getAttribute("data-slide-idx") ?? "0", 10);
        const prevIndex = isNaN(prevIndexAttr) ? 0 : prevIndexAttr;
        const nextIndex = (prevIndex + 1) % slideshow.children.length;
        slideNext(slideshow.id.toString(), nextIndex);
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


  document.querySelectorAll("[data-review]").forEach(slider => {
    const cards = slider.querySelectorAll('[data-review-card]');
    const threshold = 25;
    if (cards.length === 0) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let idx = 0;

    const finalizeDrag = (pageX: number) => {
      if (!isDown) return;

      const diff = pageX - startX;
      const width = cards[idx].getBoundingClientRect().width + parseFloat(window.getComputedStyle(cards[idx]).marginLeft) || 0;
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
    }) as EventListener);

    slider.addEventListener('mouseleave', () => { isDown = false; });
    slider.addEventListener('mousemove', ((e: MouseEvent): void => {
      if (!isDown) return;
      const diff = e.pageX - startX;
      if (Math.abs(diff) > threshold) {
        slider.scrollLeft = scrollLeft - diff;
      }
    }) as EventListener, { passive: true });

    slider.addEventListener('touchmove', ((e: TouchEvent) => {
      if (!isDown) return;
      const diff = e.changedTouches[0].pageX - startX;
      if (Math.abs(diff) > threshold) {
        finalizeDrag(e.changedTouches[0].pageX);
        isDown = false;
      }
    }) as EventListener, { passive: true });

    slider.addEventListener('mouseup', ((e: MouseEvent): void => { finalizeDrag(e.pageX); isDown = false; }) as EventListener);
  });
});
