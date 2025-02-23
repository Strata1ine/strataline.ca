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
  for (let slideshow of document.querySelectorAll("[data-slideshow]")) {
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
  }

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
});
