import { createEffect, For } from 'solid-js';
import type { Props as HeaderMeta } from './Header.astro';
import styles from './Header.module.scss';
import { cn } from '@/frontend/utils';
import Dialog from '@corvu/dialog';

export default function Header(props: { content: HeaderMeta['content'] }) {
	return (
		<Dialog preventScrollbarShift={false}>
			{(popover) => {
				createEffect(() => {
					if (popover.open) {
						document.body.scrollTop = document.documentElement.scrollTop = 1;
					}
				});

				return (
					<>
						<Dialog.Trigger
							class={cn(
								'z-2 size-10 cursor-pointer touch-manipulation text-neutral-950',
								styles.burger,
							)}
							aria-label="mobile menu"
						/>
						<Dialog.Content
							class={cn(
								'data-open:animate-in data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out sm:data-open:zoom-in-80% sm:data-closed:zoom-out-80%',
								'border-primary-dark fixed top-20 right-0 bottom-0 left-0 z-2 flex flex-col justify-center gap-7 bg-white p-9 sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:translate-y-4 sm:rounded-xl sm:border-2',
							)}
						>
							<ul class="contents">
								<For
									each={props.content}
									children={(item, index) => (
										<li
											class="animate-in [animation-fill-mode:backwards]"
											style={{
												'--tw-enter-translate-x': '-5rem',
												'animation-delay': `${index() * 150}ms`,
											}}
										>
											<a
												class={cn(styles.link, 'font-serif text-3xl text-nowrap font-semibold')}
												href={`#${item.id}`}
												tabindex="0"
												onClick={() => popover.setOpen(false)}
											>
												{item.name}
											</a>
										</li>
									)}
								/>
							</ul>
						</Dialog.Content>
					</>
				);
			}}
		</Dialog>
	);
}
