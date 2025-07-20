import { writable, get } from 'svelte/store';

let counter = 0;

export const genUid = (): string => {
  return `uid-${counter += 1}`;
};

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
