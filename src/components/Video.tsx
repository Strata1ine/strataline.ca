import { onMount, onCleanup, createEffect } from 'solid-js';
import { videoPlaying, setVideoPlaying } from '@/frontend/stores';
import { cn } from '@/frontend/utils';

export default function Video(props: { poster: string; url: string; fit?: 'cover' | 'contain' }) {
	let node: HTMLVideoElement | undefined;

	createEffect(() => {
		if (!videoPlaying() && node && !node.paused) {
			node.pause();
		}
	});

	onMount(() => {
		if (!node) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry && entry.isIntersecting === false) {
				setVideoPlaying(false);
			}
		});
		observer.observe(node);

		onCleanup(() => {
			observer.disconnect();
		});
	});

	return (
		<video
			ref={node}
			poster={props.poster}
			preload="none"
			class={cn(
				'absolute size-full cursor-pointer',
				props.fit === 'contain' ? 'bg-black object-contain' : 'object-cover',
			)}
			controls
			onPlay={() => setVideoPlaying(true)}
			onPause={() => setVideoPlaying(false)}
			onEnded={() => setVideoPlaying(false)}
		>
			<source src={props.url} />
			Your browser does not support the video tag.
		</video>
	);
}
