import { createSignal, For } from 'solid-js';
import SlideNav from '@/components/SlideNav';
import { Image, imageWrapperVariants } from '@/components/Image';
import { slideshow } from '@/frontend/slideshow';
import type { Props as HeroMeta } from './Hero.astro';

export default function ImageCarousel(props: HeroMeta) {
	const [idx, setIdx] = createSignal(0);
	slideshow({
		idx: idx(),
		setIdx: setIdx,
		length: props.content.length,
		speed: props.speed,
	});
	return (
		<>
			<div class="relative h-[50vh] w-full">
				<For each={props.content}>
					{(image, i) => (
						<Image active={i() === idx()} anim="fade" image={image} widths={[400, 650, 1300]} />
					)}
				</For>
			</div>

			<SlideNav
				class="2xl:w-diff mt-3 2xl:mt-0 2xl:flex-col"
				idx={idx()}
				setIdx={setIdx}
				length={props.content.length}
			/>
		</>
	);
}
