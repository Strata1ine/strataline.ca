import { z } from "zod";
import { type SchemaContext } from 'astro:content';
export const componentsMeta: SchemaComponent[] = [];

export type SchemaComponent = {
  id: string,
  meta: (c: SchemaContext) => {},
  render: any,
};

export function register(
  ctx: SchemaComponent,
) {
  componentsMeta.push(ctx);
}

export function buildSchemaRegistery(c: SchemaContext) {
  return z.preprocess(
    (data: any) => data.filter((item: any) =>
      componentsMeta.some(comp => comp.id === item.type)
    ),
    z.array(z.discriminatedUnion('type',
      componentsMeta.map((item, i) =>
        z.object({
          type: z.literal(item.id),
          idx: z.number().int().default(i),
          ...item.meta(c)
        })
      ) as any
    ))
  );
}
