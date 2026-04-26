import { createEffect, For } from 'solid-js';
import type { Props as HeaderMeta } from './Header.astro';
import styles from './Header.module.scss';
import { cn } from '@/frontend/utils';
import Dialog from '@corvu/dialog';
import { LetsTalk } from '@/components/Talk';
import business from '#/business.json';

const digits = business.telephone.replace(/\D/g, '');
const phoneHref = `tel:${digits.length === 10 ? `+1${digits}` : `+${digits}`}`;
const emailHref = `mailto:${business.email}`;

export default function Header(props: { content: HeaderMeta['content'] }) {
	return (
		<div class="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
			<LetsTalk
				aria-label="Open contact form"
				class="cursor-pointer rounded-md bg-secondary px-4 py-2 font-serif text-lg font-bold leading-none text-white shadow-sm transition hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:px-5 sm:text-xl"
			>
				Contact
			</LetsTalk>
			<a class="hover:text-primary" href={emailHref} aria-label={`Email Strataline at ${business.email}`}>
				{business.email}
			</a>
			<a class="hover:text-primary" href={phoneHref} aria-label={`Call Strataline at ${business.telephone}`}>
				{business.telephone}
			</a>
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
									'z-2 size-10 cursor-pointer touch-manipulation text-white',
									styles.burger,
								)}
								aria-label="mobile menu"
							/>
							<Dialog.Content
								class={cn(
									'data-open:animate-in data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out sm:data-open:zoom-in-80% sm:data-closed:zoom-out-80%',
									'border-primary-dark fixed top-16 right-0 bottom-0 left-0 z-2 flex flex-col justify-center gap-7 bg-white p-9 text-black sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:translate-y-4 sm:rounded-xl sm:border-2',
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
													class={cn(styles.link, 'font-serif text-3xl font-semibold text-nowrap')}
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
		</div>
	);
}
