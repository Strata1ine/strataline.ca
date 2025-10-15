import Dialog from '@corvu/dialog';
import type { ComponentProps, JSX } from 'solid-js';
import createPersistent from 'solid-persistent';
import Form from './Form.tsx';
import Fields from '@/components/Fields';

export default function LetsTalk(props: { children: JSX.Element } & ComponentProps<'button'>) {
	const persistedContent = createPersistent(() => {
		return (
			<div class="mt-12 space-y-12">
				<Fields.PhoneNumber validate />
			</div>
		);
	});

	return (
		<Dialog>
			<Dialog.Trigger {...props}>{props.children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay class="data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% fixed inset-0 z-4 bg-white/40 backdrop-blur-2xl" />
				<Dialog.Content class="data-open:animate-in data-open:zoom-in-98% data-closed:fade-out-0% data-open:fade-in-0% data-closed:animate-out data-closed:zoom-out-98% fixed inset-0 z-4">
					<div class="relative mx-auto mt-10 w-full max-w-120 rounded-md bg-white p-10">
						<Form
							title="Let's talk"
							desc="Feel free to ask a question and/or quote."
							name="contact"
						>
							{persistedContent()}
						</Form>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
}
