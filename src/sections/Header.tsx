// import Modal from "@/components/modals/Modal.svelte";
// import Burger from "@/components/decor/Burger.svelte";
// import { modals, genUid } from "@/frontend/stores.svelte";

import type { Props as HeaderMeta } from './Header.astro';

export default function Header(props: HeaderMeta) {
	// const open = createMemo(() => modals.is(modals.mobile));
	// const uid = genUid();

	return (
		<>
			<ul class="mt-1 hidden gap-14 md:flex">
				{props.content.map((item) => (
					<li>
						<a href={`#${item.id}`} class="desc-sm c relative" tabindex="0">
							{item.name}
						</a>
					</li>
				))}
			</ul>

			{/* 
      <button
        aria-label="Open mobile menu"
        class="relative z-1 size-10 cursor-pointer touch-manipulation md:hidden"
        data-include-in-focuslock
        tabindex="0"
        onClick={() => {
          document.body.scrollTop = 1;
          document.documentElement.scrollTop = 1;
          modals.toggle(modals.mobile);
        }}
      >
        <Burger open={open()} onOpenChange={() => modals.toggle(modals.mobile)} />
      </button>
      */}

			{/* 
      <Modal class={modalStyles({ open: open() })} uid={uid} open={open()} onOpenChange={(v) => v ? modals.toggle(modals.mobile) : modals.close()}>
        <ul class="px-inset flex h-full flex-col items-start justify-center gap-6">
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

			<style>
				{`
          .c {
            position: relative;
          }
          .c::after {
            content: "";
            position: absolute;
            bottom: -0.4rem;
            right: 10%;
            left: 10%;
            transform: scaleX(0);
            height: 1px;
            background: var(--color-black);
            transition: transform 200ms ease-in-out;
            opacity: 0.5;
          }
          .c:hover::after {
            transform: scaleX(1);
          }
        `}
			</style>
		</>
	);
}
