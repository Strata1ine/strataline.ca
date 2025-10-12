import type { Props as CardshowMeta } from './Cardshow.astro';

import { createSignal, For, Show } from 'solid-js';
import Image from '@/components/Image';
import Slidenav from '@/components/actions/Slidenav';
import YoutubeVideo from '@/components/YoutubeVideo';
import Video from '@/components/Video';
import { actionStyles } from '@/components/actions/styles';
import { slideshow } from '@/frontend/slideshow';

export default function Cardshow(props: { meta: CardshowMeta['content']; speed: number }) {
	const [idx, setIdx] = createSignal(0);

	return (
		<>
			<div class="2xl:w-diff flex-shrink-0" />
			<div
				class="bg-accent flex rounded-md contain-paint"
				ref={(el) =>
					slideshow(el, {
						idx: idx(),
						setIdx: setIdx,
						length: props.meta.length,
						speed: props.speed,
					})
				}
			>
				<For each={props.meta}>
					{(card, i) => {
						const isActive = () => i() === idx();
						return (
							<div
								class={`sm:px-auto flex min-w-full flex-col items-center justify-center gap-6 px-5 py-8 transition-opacity duration-800 sm:flex-row sm:gap-8 sm:px-0 sm:py-0 ${
									isActive() ? '' : 'pointer-events-none opacity-0'
								}`}
								inert={!isActive()}
								style={{ translate: `-${i() * 100}% 0` }}
							>
								<div class="relative w-full flex-shrink-0 rounded-sm contain-paint sm:aspect-auto sm:h-full sm:w-1/2 sm:rounded-none">
									{(() => {
										switch (card.media.type) {
											case 'image':
												return <Image image={card.media.image} widths={[400, 650, 1300]} />;
											case 'video':
												return <Video poster={card.media.image.src.src} url={card.media.url} />;
											case 'yt-video':
												return <YoutubeVideo id={card.media.id} />;
										}
									})()}
								</div>

								<div class="w-full sm:my-10">
									<h3 class="heading-4xl mb-1">{card.title}</h3>
									<p class="desc-base">{card.desc}</p>

									<Show when={card.link}>
										{(link) => (
											<div class="mt-7">
												<a
													rel="noopener noreferrer"
													class={actionStyles()}
													target="_blank"
													href={link().url}
												>
													{link().name}
												</a>
											</div>
										)}
									</Show>
								</div>

								<div class="hidden sm:block" />
							</div>
						);
					}}
				</For>
			</div>

			<div class="2xl:w-diff mt-3 flex flex-shrink-0 items-center justify-center gap-2 2xl:mt-0 2xl:flex-col">
				<Slidenav idx={idx()} setIdx={setIdx} length={props.meta.length} />
			</div>
		</>
	);
}
