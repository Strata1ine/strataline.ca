import { z } from "zod";
import { type SchemaContext } from 'astro:content';
export const componentsMeta: SchemaComponent[] = [];

export type SchemaComponent = {
  id: string,
  init: (context: SchemaContext) => {},
  client?: null | string,
  render: any,
};

export function register(
  ctx: SchemaComponent,
) {
  componentsMeta.push(ctx);
}

export function buildSchemaRegistery(context: SchemaContext) {
  return z.array(z.discriminatedUnion('type',
    componentsMeta.map((item, i) =>
      z.object({
        type: z.literal(item.id),
        idx: z.number().int().default(i),
        ...item.init(context)
      })
    ) as any
  ));
}
