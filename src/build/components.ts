import { z } from "zod";
import { type SchemaContext } from 'astro:content';
export const componentsMeta: SchemaComponent[] = [];

export type SchemaComponent = {
  id: string,
  init: (context: SchemaContext) => {},
  render: any,
};

export function register(
  ctx: SchemaComponent,
) {
  componentsMeta.push(ctx);
}

export function buildSchemaRegistery(context: SchemaContext) {
  return z.array(z.discriminatedUnion('type',
    componentsMeta.map((item) =>
      z.object({
        type: z.literal(item.id),
        ...item.init(context)
      })
    ) as any
  ));
}
