import { writable, get } from 'svelte/store';

const modalState = {
  mobile: 0,
  talk: 1,
  review: 2,
};

export const modals = {
  ...modalState,
  idx: writable<null | number>(null),
  open: (idx: number) => modals.idx.set(idx),
  close: () => modals.idx.set(null),
  toggle: (idx: number) =>
    modals.is(idx) ? modals.close() : modals.open(idx),
  is: (idx: number) => get(modals.idx) == idx,
};

type SlideshowState = {
  length: number;
  idx: number;
};

const slideshowState = {
  hero: writable<SlideshowState>({ length: 0, idx: 0 }),
};

export const slideshows = {
  ...slideshowState,
  next: (key: keyof typeof slideshowState) =>
    slideshowState[key].update(s => ({ ...s, idx: (s.idx + 1) % s.length })),
  prev: (key: keyof typeof slideshowState) =>
    slideshowState[key].update(s => ({ ...s, idx: (s.idx - 1 + s.length) % s.length })),
  set: (key: keyof typeof slideshowState, idx: number) =>
    slideshowState[key].update(s => ({ ...s, idx })),
};
