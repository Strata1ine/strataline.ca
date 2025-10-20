import Dialog from '@corvu/dialog';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import X from '~icons/ph/x-bold';

const siteUrl = import.meta.env.SITE;

function DialogForm(props: {
	title: string;
	id: string;
	desc?: string;
	action?: string;
	children?: JSX.Element;
}) {
	return (
		<>
			<Dialog.Overlay class="data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% fixed inset-0 z-2 bg-white/40 backdrop-blur-2xl" />
			<Dialog.Content class="data-open:animate-in data-open:zoom-in-98% data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out data-closed:zoom-out-98% fixed inset-0 z-2 overflow-y-scroll">
				<div class="relative mx-auto w-full max-w-120 bg-white p-10 sm:my-10 sm:rounded-lg">
					<div class="flex items-center gap-3">
						<Dialog.Label class="flex-1 font-serif text-5xl font-bold sm:text-6xl">
							{props.title}
						</Dialog.Label>

						<Dialog.Close
							type="button"
							class="bg-tone cursor-pointer rounded-[50%] p-2"
							tabIndex={0}
						>
							<X class="size-10 rounded-[50%] lg:w-11" />
						</Dialog.Close>
					</div>

					<Show when={props.desc}>
						<Dialog.Description class="mt-3 text-base">{props.desc}</Dialog.Description>
					</Show>

					<form action={`https://submit-form.com/${props.id}`} method="post">
						<input type="hidden" name="_redirect" value={`${siteUrl}${props.action}`} />
						{props.children}
					</form>
				</div>
			</Dialog.Content>
		</>
	);
}

const Menus = { DialogForm };
export default Menus;
