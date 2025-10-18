import { createSignal, For } from 'solid-js';
import SlideNav from '@/components/SlideNav';
import Image from '@/components/Image';
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
			<div class={cn('relative h-80 max-h-180 min-h-50 w-full sm:h-[60vh] sm:min-h-120')}>
				<For each={props.content.images}>
					{(image, i) => (
						<Image
							loading={i() == 0 ? 'eager' : 'lazy'}
							fetchpriority={i() == 0 ? 'high' : 'low'}
							active={i() === idx()}
							anim="fade"
							pos="right"
							image={image}
							widths={[400, 650, 1400]}
						/>
					)}
				</For>
			</div>

			<SlideNav
				class="2xl:w-diff my-3 flex-col sm:mb-0 sm:flex-row 2xl:mt-0 2xl:flex-col"
				idx={idx()}
				setIdx={setIdx}
				length={props.content.images.length}
			/>
		</>
	);
}
