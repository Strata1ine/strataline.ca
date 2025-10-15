import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import X from '~icons/ph/x-bold';

import Dialog from '@corvu/dialog';

export default function Form(props: {
	title: string;
	name: string;
	desc?: string;
	action?: string;
	children?: JSX.Element;
}) {
	return (
		<>
			<div class="gap-inset flex items-center">
				<Dialog.Label class="flex-1 font-serif text-5xl font-bold">{props.title}</Dialog.Label>

				<Dialog.Close type="button" class="bg-tone cursor-pointer rounded-[50%] p-2" tabIndex={0}>
					<X class="size-10 rounded-[50%] lg:w-11" />
				</Dialog.Close>
			</div>

			<form
				name={props.name}
				action={props.action}
				enctype="multipart/form-data"
				method="post"
				data-netlify
			>
				<input type="hidden" name="form-name" value={props.name} />
				<Show when={props.desc}>
					<Dialog.Description class="mt-3 text-base">{props.desc}</Dialog.Description>
				</Show>

				{props.children}
			</form>
		</>
	);
}
