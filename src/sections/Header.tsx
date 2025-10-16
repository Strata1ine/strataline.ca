import { For } from 'solid-js';
import type { Props as HeaderMeta } from './Header.astro';
import styles from './Header.module.scss';
import { cn } from '@/frontend/utils';
import Popover from '@corvu/popover';

export default function Header(props: { content: HeaderMeta['content'] }) {
	return (
		<>
			<Popover
				restoreFocus={false}
				floatingOptions={{
					flip: true,
					hide: false,
					shift: true,
					offset: {
						mainAxis: 20,
						crossAxis: -100,
					},
				}}
			>
				{(popover) => {
					return (
						<>
							<Popover.Trigger
								class={cn('size-10 cursor-pointer touch-manipulation', styles.burger)}
							/>
							<Popover.Portal>
								<Popover.Content
									class={cn(
										'flex flex-col gap-7 rounded-xl bg-white p-9 border-accent border',
										'data-open:animate-in data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out data-open:zoom-in-80% data-closed:zoom-out-80%',
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
														class={cn(styles.link, 'text-base font-semibold')}
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
								</Popover.Content>
							</Popover.Portal>
						</>
					);
				}}
			</Popover>
		</>
	);
}
