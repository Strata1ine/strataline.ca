import { createSignal } from 'solid-js';

export const [videoPlaying, setVideoPlaying] = createSignal<boolean>(false);
export const [youtubeApiReady, setYoutubeApiReady] = createSignal<boolean | null>(false);

// let counter = 0;
// export const genUid = (): string => {
// 	return `uid-${(counter += 1)}`;
// };

// const [idx, setIdx] = createSignal<null | number>(null);
//
// export const modals = {
// 	mobile: 0,
// 	talk: 1,
// 	review: 2,
// 	open: (i: number) => setIdx(i),
// 	close: () => setIdx(null),
// 	toggle: (i: number) => (modals.is(i) ? modals.close() : modals.open(i)),
// 	is: (i: number) => i === idx(),
// };
