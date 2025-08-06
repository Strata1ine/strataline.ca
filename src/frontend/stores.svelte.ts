import { writable, type Writable } from 'svelte/store';
export const videoPlaying: Writable<boolean> = writable(false);
export const youtubeApiReady: Writable<boolean | null> = writable(false);

let counter = 0;
export const genUid = (): string => {
  return `uid-${counter += 1}`;
};

let idx: null | number = $state(null);

export const modals = {
  mobile: 0,
  talk: 1,
  review: 2,
  open: (i: number) => idx = i,
  close: () => idx = null,
  toggle: (i: number) =>
    modals.is(i) ? modals.close() : modals.open(i),
  is: (i: number) => i == idx,
};
