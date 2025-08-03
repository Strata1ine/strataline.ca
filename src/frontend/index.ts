import { youtubeApiReady } from "./stores.svelte";

if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) target.scrollIntoView();
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

window.addEventListener('hashchange', () => {
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
});

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.insertBefore(tag, document.head.firstChild);

declare global {
  interface Window {
    onYouTubeIframeAPIReady(): void;
  }
}

window.onYouTubeIframeAPIReady = function() {
  youtubeApiReady.set(true);
};
