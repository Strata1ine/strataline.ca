import { createSignal, For } from 'solid-js';
import { imageWrapperStyles } from './styles';
import Slidenav from '@/components/actions/Slidenav';
// import FluidTalk from "@/components/decor/FluidTalk";
import CDNImage from '@/components/CDNImage';
import type { Props as HeroMeta } from './Hero.astro';
import { slideshow } from '@/frontend/slideshow';

export default function Hero(props: HeroMeta) {
	const [idx, setIdx] = createSignal(0);

	const ImageCarousel = () => (
		<For each={props.content}>
			{(image, i) => <CDNImage image={image} widths={[400, 650, 1300]} />}
		</For>
	);

	return (
		<div
			class="flex gap-6 py-20 sm:items-center sm:py-30 md:gap-8 xl:gap-11"
			ref={(el) =>
				slideshow(el, () => ({
					idx: idx(),
					setIdx: setIdx,
					length: props.content.length,
					speed: props.speed,
				}))
			}
		>
			<div class="hidden w-1/2 flex-none flex-col sm:flex 2xl:flex-row-reverse">
				<div class="h-[70vh] max-h-165 min-h-100 w-full rounded-sm contain-paint">
					<ImageCarousel />
				</div>

				<div class="2xl:w-diff mt-3 flex flex-shrink-0 items-center justify-center gap-2 2xl:mt-0 2xl:flex-col">
					<Slidenav idx={idx()} setIdx={setIdx} length={props.content.length} />
				</div>
			</div>

			<div>
				<h1 class="heading-6xl font-bold">{props.title}</h1>

				<div class="my-5 flex items-center gap-2 sm:hidden">
					<div
						class={`${imageWrapperStyles({
							pos: 'left',
							size: 'sm',
						})} flex-1`}
					>
						<ImageCarousel />
					</div>

					<div class="flex flex-col gap-2">
						<Slidenav idx={idx()} setIdx={setIdx} length={props.content.length} />
					</div>
				</div>

				<p class="desc-base mt-3">{props.desc}</p>

				{/* FluidTalk goes here */}
			</div>
		</div>
	);
}
