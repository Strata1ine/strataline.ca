import { clsx } from 'clsx';
// import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<string | undefined | null | false>) {
	// I don't think I need it
	// return twMerge(clsx(inputs));
	return clsx(inputs);
}
