import Check from "~icons/ph/check-bold";
import X from "~icons/ph/x-bold";

export default function ValidityIcon(props: { valid?: boolean }) {
	return (
		<div class="relative size-6" aria-live="polite">
			<Check
				class={
					"text-success absolute size-full duration-250 " +
					(!props.valid ? "-translate-y-full opacity-0" : "")
				}
				aria-hidden={!props.valid}
				aria-label={props.valid ? "Valid" : undefined}
			/>
			<X
				class={
					"text-error size-full duration-250 " + (props.valid ? "-translate-y-full opacity-0" : "")
				}
				aria-hidden={!!props.valid}
				aria-label={!props.valid ? "Invalid" : undefined}
			/>
		</div>
	);
}
