import { createSignal, For, Show, Switch, Match } from 'solid-js';
// import Slidenav from '@/components/actions/Slidenav';
// import YoutubeVideo from '@/components/YoutubeVideo';
// import Video from '@/components/Video';
import { actionStyles } from '@/components/actions/styles';
import { slideshow } from '@/frontend/slideshow';
import type { Props as CardshowMeta } from './Cardshow.astro';

type Props = {
	meta: CardshowMeta['content'];
	speed: number;
};

export default function Cardshow(props: Props) {
	const [idx, setIdx] = createSignal(0);

	return (
		<>
			<div class="2xl:w-diff flex-shrink-0" />
			<div
				class="contain-paint flex rounded-md bg-accent"
				ref={(el) =>
					slideshow(el, () => ({
						idx: idx(),
						setIdx,
						length: props.meta.length,
						speed: props.speed,
					}))
				}
			>
				<For each={props.meta}>
					{(card, i) => {
						const isActive = () => i() === idx();
						return (
							<div
								class={`flex min-w-full flex-col items-center justify-center gap-6 px-5 py-8 transition-opacity duration-800 sm:flex-row sm:gap-8 sm:px-0 sm:py-0 ${
									isActive() ? '' : 'pointer-events-none opacity-0'
								}`}
								inert={!isActive()}
								style={{ translate: `-${i() * 100}% 0` }}
							>
								<div class="contain-paint relative aspect-video w-full flex-shrink-0 rounded-sm sm:aspect-auto sm:h-full sm:w-1/2 sm:rounded-none">
									{/*<Switch>
										<Match when={card.media.type === 'image'}>
											<></>
											{/*
											<img
												class={`absolute w-full ${imageStyles({
													x: (card.media as any).image.x,
													y: (card.media as any).image.y,
												})}`}
												{...(card.media as any).image}
												loading="lazy"
												decoding="async"
											/>

										</Match>
										<Match when={card.media.type === 'video'}>
											<Video
												poster={(card.media as any).image?.src}
												url={(card.media as any).url}
											/>
										</Match>
										<Match when={card.media.type === 'yt-video'}>
											<YoutubeVideo id={(card.media as any).id} />
										</Match>
									</Switch>
									*/}
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
				{/*<Slidenav idx={idx()} setIdx={setIdx} length={props.meta.length} />*/}
			</div>
		</>
	);
}
