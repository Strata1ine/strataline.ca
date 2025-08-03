import { get } from "svelte/store";
import { videoPlaying } from "./stores.svelte";

type SlideshowParams = {
  idx: number,
  setIdx: (v: number) => void,
  length: number,
  speed: number
};

export function slideshow(
  node: HTMLElement,
  { idx, setIdx, length, speed }: SlideshowParams
) {
  let timeoutId: NodeJS.Timeout | null = null;
  let isVisible = false;

  function clear() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function next() {
    clear();
    if (isVisible && length > 1 && !get(videoPlaying)) {
      timeoutId = setTimeout(() => {
        setIdx((idx + 1) % length);
      }, speed * 1000);
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting !== isVisible) {
      isVisible = entry.isIntersecting;
      next();
    }
  });

  observer.observe(node);

  
  const unsub = videoPlaying.subscribe((playing) => {
    if (playing) {
      next();
    } else {
      clear();
    }
  });

  return {
    update: (slideshow: SlideshowParams) => {
      idx = slideshow.idx;
      next();
    },
    destroy: () => {
      clear();
      unsub();
      observer.disconnect();
    }
  };
}
