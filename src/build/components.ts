import { z } from "zod";
import { type SchemaContext } from 'astro:content';
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export const componentRegistry: Record<string, SchemaComponent> = {};

export type SchemaComponent = {
  id: string,
  schema: (c: SchemaContext) => z.ZodRawShape;
  load: () => Promise<{ default: AstroComponentFactory }>;
};

export function parseRegistry(c: SchemaContext) {
  const schemas = Object.values(componentRegistry).map((item, i) =>
    z.object({
      type: z.literal(item.id),
      _componentIdx: z.number().int().default(i),
      ...item.schema(c),
    }),
  );

  if (schemas.length === 0) {
    console.warn("componentRegistry is empty");
    return z.preprocess(() => [], z.array(z.never()));
  }

  const [first, ...rest] = schemas;
  return z.array(z.discriminatedUnion('type', [first, ...rest]));
}

export type SchemaRegistry = z.infer<ReturnType<typeof parseRegistry>>;

export type ComponentRegistry = Record<
  string,
  {
    schema: (c: SchemaContext) => z.ZodRawShape;
    load: () => Promise<{ default: AstroComponentFactory }>;
  }
>;

export function updateComponentRegistry(
  registry: ComponentRegistry,
): void {
  console.log("Component registry flushed");
  for (const [id, { schema, load }] of Object.entries(registry)) {
    componentRegistry[id] = { id, schema, load };
  }
}
