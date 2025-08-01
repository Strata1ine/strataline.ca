import { onMount } from "svelte";

export const useQueryDevice = (breakpoint = 700) => {
  let isMobile = $state(true);

  onMount(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = () => isMobile = mediaQuery.matches;

    handler();
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  });

  return {
    get isMobile() { return isMobile; }
  };
};
