function slideNext(id: string, slideNum: number) {
  const slideshow = document.getElementById(id);

  document.querySelectorAll(`[data-slide-nav="${id}"]`).forEach((slideButton) => {
    if (!(slideButton instanceof HTMLElement)) return;

    const previousIndexAttr = slideButton.getAttribute("data-slide-idx");
    const previousIndex = (previousIndexAttr == null) ? 0 : parseInt(previousIndexAttr, 10);

    slideButton.children[previousIndex].classList.remove("active");
    slideButton.children[slideNum].classList.add("active");
    slideButton.setAttribute("data-slide-idx", slideNum.toString());
  });

  if (slideshow != null && slideshow instanceof HTMLElement && slideNum >= 0 && slideNum < slideshow.children.length) {
    const previousIndexAttr = slideshow.getAttribute("data-slide-idx");
    const previousIndex = (previousIndexAttr == null) ? 0 : parseInt(previousIndexAttr, 10);

    slideshow.children[previousIndex].classList.remove("active");
    slideshow.children[slideNum].classList.add("active");
    slideshow.setAttribute("data-slide-mutated", "");
    slideshow.setAttribute("data-slide-idx", slideNum.toString());
  }
}

window.slideNext = slideNext;
window.addEventListener('load', function() {
  const slideshows = document.querySelectorAll("[data-slideshow]");
  for (let slideshow of slideshows) {
    const speedAttr = slideshow.getAttribute("data-slideshow-speed");
    const speed = (speedAttr == null) ? 1000 : parseInt(speedAttr, 10);

    this.setInterval(() => {
      if (!slideshow.hasAttribute("data-slide-mutated")) {
        const previousIndexAttr = slideshow.getAttribute("data-slide-idx");
        const previousIndex = (previousIndexAttr == null) ? 0 : parseInt(previousIndexAttr, 10);
        const nextIndex = (previousIndex + 1) % slideshow.children.length;
        slideNext(slideshow.id.toString(), nextIndex);
      } else {
        slideshow.removeAttribute("data-slide-mutated");
      }
    }, speed);
  }
});
