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
const menuHref = (item: HeaderMeta['content'][number]) => {
	if (item.href) return item.href;
	if (item.id?.startsWith('http') || item.id?.startsWith('/')) return item.id;
	return `#${item.id}`;
};

export default function Header(props: { content: HeaderMeta['content'] }) {
	return (
		<div class="inline-flex min-w-0 flex-nowrap items-center justify-end gap-x-1 min-[380px]:gap-x-2 sm:gap-x-4">
			<LetsTalk
				aria-label="Open contact form"
				class="shrink-0 cursor-pointer rounded-md bg-secondary px-2 py-1.5 font-serif text-xs font-bold leading-none text-white shadow-sm transition hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary min-[380px]:px-3 min-[380px]:py-2 min-[380px]:text-base sm:px-5 sm:text-xl"
			>
				Contact
			</LetsTalk>
			<a
				class="shrink-0 whitespace-nowrap text-[10px] leading-none hover:text-primary min-[380px]:text-xs sm:text-base"
				href={emailHref}
				aria-label={`Email Strataline at ${business.email}`}
			>
				{business.email}
			</a>
			<a
				class="shrink-0 whitespace-nowrap text-[10px] leading-none hover:text-primary min-[380px]:text-xs sm:text-base"
				href={phoneHref}
				aria-label={`Call Strataline at ${business.telephone}`}
			>
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
									'z-20 size-8 shrink-0 cursor-pointer touch-manipulation text-white min-[380px]:size-10',
									styles.burger,
								)}
								aria-label="mobile menu"
							/>
							<Dialog.Content
								class={cn(
									'data-open:animate-in data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out sm:data-open:zoom-in-80% sm:data-closed:zoom-out-80%',
									'fixed top-11 right-0 left-0 z-10 flex max-h-[calc(100svh-2.75rem)] flex-col items-end gap-5 overflow-y-auto bg-black/70 px-5 py-6 text-white backdrop-blur-lg min-[380px]:top-13 min-[380px]:max-h-[calc(100svh-3.25rem)] sm:border-primary-dark sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:max-h-none sm:translate-y-4 sm:items-start sm:gap-7 sm:overflow-visible sm:rounded-xl sm:border-2 sm:bg-white sm:p-9 sm:text-black sm:backdrop-blur-none',
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
													href={menuHref(item)}
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
