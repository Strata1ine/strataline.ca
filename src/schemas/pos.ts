import { z } from 'astro:content';
export const ZPos = z.union([z.literal('left'), z.literal('right')]);
export const DefaultPos = ZPos.default('left');
export type Pos = z.infer<typeof ZPos>;
