import { z } from "zod";
import { type SchemaContext } from 'astro:content';
import type { JSXElement } from "solid-js";
export const componentsMeta: SchemaComponent[] = [];

import("@/index");

export type SchemaComponent = {
  id: string,
  init: (context: SchemaContext) => {},
  render: (props: any) => JSXElement,
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

export function render(components: any[]): JSXElement[] {
  return components.map((componentData) => {
    const component = componentsMeta.find(
      (meta: SchemaComponent) => meta.id === componentData.type
    );

    return component?.render(componentData);
  });
}

