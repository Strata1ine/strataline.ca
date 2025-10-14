import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import X from '~icons/ph/x-bold';

import Dialog from '@corvu/dialog';

export default function ModalForm(props: {
	title: string;
	desc?: string;
	id?: string;
	class?: string;
	action?: string;
	children?: JSX.Element;
	name: string;
}) {
	const handleSubmit = (e: SubmitEvent) => {};

	return (
		<div class="px-inset relative mx-auto w-full max-w-120 rounded-md bg-white py-12 sm:my-10 sm:px-10">
			<div class="gap-inset flex items-center">
				<h2 class="flex-1 font-serif text-5xl font-bold" id={props.id}>
					{props.title}
				</h2>

				<Dialog.Close
					type="button"
					class="bg-tone cursor-pointer rounded-[50%] p-2"
					// onClick={handleClose}
					tabIndex={0}
				>
					<X class="size-10 rounded-[50%] lg:w-11" />
				</Dialog.Close>
			</div>

			<form
				class={props.className}
				name={props.name}
				enctype="multipart/form-data"
				method="post"
				action={props.action}
				onSubmit={handleSubmit}
				data-netlify
			>
				<input type="hidden" name="form-name" value={props.name} />
				<Show when={props.desc}>
					<Dialog.Description class="mt-3 text-base">{props.desc}</Dialog.Description>
				</Show>
				{props.children}
			</form>
		</div>
	);
}
