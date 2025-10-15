import Dialog from '@corvu/dialog';
import type { ComponentProps, JSX } from 'solid-js';
import { Show } from 'solid-js';
import createPersistent from 'solid-persistent';
import Inputs from '@/components/Inputs';
import Actions from '@/components/Actions';
import X from '~icons/ph/x-bold';
import business from '#/business.json';

function LetsTalk(props: { children: JSX.Element } & ComponentProps<'button'>) {
	const persistedContent = createPersistent(() => {
		return (
			<div class="mt-12 space-y-11">
				<Inputs.Email required />
				<Inputs.PhoneNumber validate />
				<Inputs.Select name="Location" items={["Select a location", ...business.areaServed]} />
				<Inputs.TextArea name="Messege" />
				<Inputs.Photos />
				<Actions.Button variant="fill">Submit</Actions.Button>
			</div>
		);
	});

	return (
		<Dialog>
			<Dialog.Trigger {...props}>{props.children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay class="data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% fixed inset-0 z-4 bg-white/40 backdrop-blur-2xl" />
				<Dialog.Content class="data-open:animate-in data-open:zoom-in-98% data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out data-closed:zoom-out-98% fixed inset-0 z-4 overflow-y-scroll">
					<div class="relative mx-auto w-full max-w-120 bg-white p-10 sm:my-10 sm:rounded-md">
						<Form title="Let's talk" desc="Feel free to ask a question and a quote." name="contact">
							{persistedContent()}
						</Form>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
}

function Form(props: {
	title: string;
	name: string;
	desc?: string;
	action?: string;
	children?: JSX.Element;
}) {
	return (
		<>
			<div class="gap-inset flex items-center">
				<Dialog.Label class="flex-1 font-serif text-5xl font-bold lg:text-6xl">
					{props.title}
				</Dialog.Label>

				<Dialog.Close type="button" class="bg-tone cursor-pointer rounded-[50%] p-2" tabIndex={0}>
					<X class="size-10 rounded-[50%] lg:w-11" />
				</Dialog.Close>
			</div>

			<Show when={props.desc}>
				<Dialog.Description class="mt-3 text-base">{props.desc}</Dialog.Description>
			</Show>

			<form
				name={props.name}
				action={props.action}
				enctype="multipart/form-data"
				method="post"
				data-netlify
			>
				<input type="hidden" name="form-name" value={props.name} />
				{props.children}
			</form>
		</>
	);
}

const Menus = { LetsTalk };
export default Menus;
