import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import {
	videoPlaying,
	setVideoPlaying,
	youtubeApiReady,
	setYoutubeApiReady,
} from '@/frontend/stores';

export default function YoutubePlayer(props: { id: string }) {
	let video: HTMLDivElement | undefined;

	const [player, setPlayer] = createSignal<YT.Player | undefined>(undefined);

	onMount(() => {
		// load youtube API if it doesn't exist or is being loaded
		if (!window.YT && youtubeApiReady() != null) {
			setYoutubeApiReady(null);
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.head.insertBefore(tag, document.head.firstChild);
			window.onYouTubeIframeAPIReady = function () {
				setYoutubeApiReady(true);
			};
		}

		createEffect(() => {
			if (!youtubeApiReady() || !video) return;

			const YT = window.YT;
			const p = new YT.Player(video, {
				height: '100%',
				width: '100%',
				videoId: props.id,
				playerVars: { rel: 0 },
				events: {
					onReady: () => {},
					onError: (e) => console.error('YouTube player error:', e.data),
					onStateChange: (e) => setVideoPlaying(e.data === YT.PlayerState.PLAYING),
				},
			});

			setPlayer(p);

			onCleanup(() => {
				player()?.destroy();
				setPlayer(undefined);
			});
		});
	});

	createEffect(() => {
		if (!player() || !youtubeApiReady()) return;
		if (!videoPlaying()) player()?.pauseVideo();
	});

	return <div class="select-none" ref={video} />;
}
