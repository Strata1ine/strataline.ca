import { createSignal, For } from 'solid-js';
import SlideNav from '@/components/SlideNav';
import Image, { imageRoundedVariants } from '@/components/Image';
import { slideshow } from '@/frontend/slideshow';
import type { Props as HeroMeta } from './Hero.astro';
import { cn } from '@/frontend/utils';

export default function ImageCarousel(props: { content: HeroMeta['content'] }) {
	const [idx, setIdx] = createSignal(0);
	slideshow({
		idx: idx(),
		setIdx: setIdx,
		length: props.content.images.length,
		speed: props.content.speed,
	});

	return (
		<>
			<div
				class={cn(
					'relative h-80 max-h-180 min-h-50 w-full contain-content sm:h-[60vh] sm:min-h-120',
					imageRoundedVariants({ pos: 'right' }),
				)}
			>
				<For each={props.content.images}>
					{(image, i) => (
						<Image
							class="absolute inset-0"
							active={i() === idx()}
							anim="fade"
							image={image}
							widths={[400, 650, 1400]}
						/>
					)}
				</For>
			</div>

			<SlideNav
				class="2xl:w-diff my-3 sm:mb-0 2xl:mt-0 flex-col sm:flex-row 2xl:flex-col"
				idx={idx()}
				setIdx={setIdx}
				length={props.content.images.length}
			/>
		</>
	);
}
