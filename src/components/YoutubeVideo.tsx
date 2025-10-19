import { onMount, onCleanup, createEffect } from 'solid-js';
import { setYoutubeApi, youtubeApi, videoPlaying, setVideoPlaying } from '@/frontend/stores';

function init(video: HTMLElement, id: string): YT.Player {
	const p = new window.YT.Player(video, {
		height: '100%',
		width: '100%',
		videoId: id,
		host: 'https://www.youtube-nocookie.com',
		playerVars: { rel: 0 },
		events: {
			onReady: (_) => {},
			onError: (e) => console.error('YouTube player error:', e.data),
			onStateChange: (e) => setVideoPlaying(e.data === window.YT.PlayerState.PLAYING),
		},
	});
	return p;
}

export default function YoutubePlayer(props: { id: string }) {
	let videoRef: HTMLDivElement | undefined;
	let player: YT.Player | undefined;

	onMount(() => {
		if (!videoRef) return;
		// load youtube API if it doesn't exist or is being loaded
		if (!youtubeApi()) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.head.insertBefore(tag, document.head.firstChild);

			window.onYouTubeIframeAPIReady = function () {
				setYoutubeApi(true);
				player = init(videoRef, props.id);
			};
		} else {
			player = init(videoRef, props.id);
		}
	});

	onCleanup(() => {
		player?.destroy();
	});

	createEffect(() => {
		if (videoPlaying() == false) player?.pauseVideo();
	});

	return <div ref={videoRef} />;
}
