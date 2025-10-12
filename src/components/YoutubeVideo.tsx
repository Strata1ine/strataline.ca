import { onMount, onCleanup, createEffect } from "solid-js";
import {
	videoPlaying,
	setVideoPlaying,
	youtubeApiReady,
	setYoutubeApiReady,
} from "@/frontend/stores";

export default function YoutubePlayer(props: { id: string }) {
	let video: HTMLDivElement | undefined;

	onMount(() => {
		// load youtube API if it doesn't exist or is being loaded
		if (!window.YT && youtubeApiReady() != null) {
			setYoutubeApiReady(null);
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			document.head.insertBefore(tag, document.head.firstChild);
			window.onYouTubeIframeAPIReady = function () {
				setYoutubeApiReady(true);
			};
		}

		let player: YT.Player | undefined;
		let videoPlayingCleanup: (() => void) | undefined;

		// Watch for API ready state
		createEffect(() => {
			const ready = youtubeApiReady();
			if (ready && video) {
				const YT = window.YT;
				player = new YT.Player(video, {
					height: "100%",
					width: "100%",
					videoId: props.id,
					playerVars: {
						rel: 0,
					},
					events: {
						onReady: () => {
							// Watch videoPlaying changes after player is ready
							const cleanup = createEffect(() => {
								const isPlaying = videoPlaying();
								if (!isPlaying && player && player.getPlayerState() === YT.PlayerState.PLAYING) {
									player.pauseVideo();
								}
							});
							videoPlayingCleanup = cleanup;
						},
						onError: (event) => {
							console.error("YouTube player error: ", event.data);
						},
						onStateChange: (event) => {
							if (event.data === YT.PlayerState.PLAYING) {
								setVideoPlaying(true);
							} else if (
								event.data === YT.PlayerState.PAUSED ||
								event.data === YT.PlayerState.ENDED
							) {
								setVideoPlaying(false);
							}
						},
					},
				});
			}
		});

		onCleanup(() => {
			videoPlayingCleanup?.();
			if (player && player.destroy) {
				player.destroy();
			}
		});
	});

	return <div class="select-none" ref={video}></div>;
}
