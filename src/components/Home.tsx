import { cn } from '@/frontend/utils';
import type { ComponentProps } from 'solid-js';
import House from '~icons/ph/house-line-fill';

export default function Home(
	props: ComponentProps<'a'> & {
		slug?: string;
		desc?: string;
		class?: string;
	},
) {
	const { slug, desc = 'Go home', class: customClass, ...rest } = props;

	return (
		<a
			class={cn(`inline-flex cursor-pointer items-end gap-3`, customClass)}
			{...rest}
			href={slug ? `/#${slug}` : `/`}
		>
			<House aria-hidden={true} class="text-accent-dark size-8 translate-y-[7%] xl:size-12" />
			<span class="desc-base text-accent-dark leading-none font-semibold">{desc}</span>
		</a>
	);
}
