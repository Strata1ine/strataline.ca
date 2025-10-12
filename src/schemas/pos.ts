import { z } from 'astro:content';
export const ZPos = z.union([z.literal('left'), z.literal('right')]);
export const DefaultPos = ZPos.default('left');
export type Pos = z.infer<typeof ZPos>;

export function swapNextPos(pos: Pos) {
	pos = swapPos(pos);
}

export function swapPos(pos: Pos): Pos {
	return pos === 'left' ? 'right' : 'left';
}
