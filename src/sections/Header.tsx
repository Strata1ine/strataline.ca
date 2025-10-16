// import Modal from "@/components/modals/Modal.svelte";
// import Burger from "@/components/decor/Burger.svelte";
// import { modals, genUid } from "@/frontend/stores.svelte";

import { For } from 'solid-js';
import type { Props as HeaderMeta } from './Header.astro';
import styles from './Header.module.scss';
import { cn } from '@/frontend/utils';

export function Burger(props: { open: boolean }) {
	return <div class={cn('pointer-events-none', styles.burger)} classList={{ open: props.open }} />;
}

export default function Header(props: { content: HeaderMeta['content'] }) {
	// const open = createMemo(() => modals.is(modals.mobile));
	// const uid = genUid();

	return (
		<>
			{/* 
			<ul class="mt-1 hidden gap-14 xl:flex">
				<For
					each={props.content}
					children={(item, _) => (
						<li>
							<a class={cn(styles.link, 'relative text-base')} href={`#${item.id}`} tabindex="0">
								{item.name}
							</a>
						</li>
					)}
				/>
			</ul>
      */}

			<button class="size-10 cursor-pointer touch-manipulation ">
				<Burger></Burger>
			</button>

			{/* 
      <Modal class={modalStyles({ open: open() })} uid={uid} open={open()} onOpenChange={(v) => v ? modals.toggle(modals.mobile) : modals.close()}>
        <ul class="flex h-full flex-col items-start justify-center gap-6">
          {props.content.map((item) => (
            <li>
              <a
                href={`#${item.id}`}
                onClick={() => {
                  modals.close();
                }}
                tabindex="0"
                class="heading-2xl leading-none"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </Modal>
      */}
		</>
	);
}
