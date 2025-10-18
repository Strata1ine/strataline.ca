import { createSignal } from 'solid-js';

export const [videoPlaying, setVideoPlaying] = createSignal<boolean>(false);
export const [youtubeApi, setYoutubeApi] = createSignal<boolean>(false);
