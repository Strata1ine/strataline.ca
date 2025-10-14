import Dialog from '@corvu/dialog';
import type { ComponentProps, JSX } from 'solid-js';
import createPersistent from 'solid-persistent';
import Form from './Form.tsx';

export default function LetsTalk(props: { children: JSX.Element } & ComponentProps<'button'>) {
	const persistedContent = createPersistent(() => {
		return (
			<>
				<input />
			</>
		);
	});

	return (
		<Dialog>
			<Dialog.Trigger {...props}>{props.children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Content class="fixed inset-0 z-5 bg-white/40 backdrop-blur-2xl">
					<Form title="Let's talk" desc="Feel free to ask a question and/or quote.">
						{persistedContent()}
					</Form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
}
