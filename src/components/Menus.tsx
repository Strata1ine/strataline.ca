import Dialog from '@corvu/dialog';
import type { JSX } from 'solid-js';
import { Show } from 'solid-js';
import X from '~icons/ph/x-bold';

function DialogForm(props: {
	title: string;
	name: string;
	desc?: string;
	action?: string;
	children?: JSX.Element;
}) {
	return (
		<>
			<Dialog.Overlay class="data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% fixed inset-0 z-2 bg-white/40 backdrop-blur-2xl" />
			<Dialog.Content class="data-open:animate-in data-open:zoom-in-98% data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out data-closed:zoom-out-98% fixed inset-0 z-2 overflow-y-scroll">
				<div class="relative mx-auto w-full max-w-120 bg-white p-10 sm:my-10 sm:rounded-md">
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
				</div>
			</Dialog.Content>
		</>
	);
}

// function WriteReview() {
// 	const [open, setOpen] = createSignal(false);
// 	const persistedContent = createPersistent(() => {
// 		return (
// 			<div class="mt-12 space-y-11">
// 				<Inputs.Email required />
// 				<Inputs.Select name="Location" items={['Select a location', ...business.areaServed]} />
// 				<Inputs.TextArea name="Review" />
// 				<Actions.Button variant="fill">Submit</Actions.Button>
// 			</div>
// 		);
// 	});
//
// 	return {
// 		open,
// 		setOpen,
// 		dialog: (
// 			<Dialog>
// 				<Dialog.Portal>
// 					<BlurredDialog>
// 						<Form
// 							title="Write a review"
// 							desc="We will verify your submission via email."
// 							name="review"
// 							action="/submissions/review"
// 						>
// 							{persistedContent()}
// 						</Form>
// 					</BlurredDialog>
// 				</Dialog.Portal>
// 			</Dialog>
// 		),
// 	};
// }

const Menus = { DialogForm };
export default Menus;
