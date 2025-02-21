export function slideNext(id: string, slideIdx: number) {
  const slideshow = document.getElementById(id);
  if (slideshow != null && slideshow instanceof HTMLElement && slideIdx >= 0 && slideIdx < slideshow.children.length) {
    const newSlide = slideshow.children[slideIdx];
    for (let i = 0; i < slideshow.children.length; i++) {
      slideshow.children[i].classList.remove('active');
    }
    newSlide.classList.add("active");
  }
}
