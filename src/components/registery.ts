import { register } from "@build/components";
import type { SchemaContext } from "astro:content";
import { z } from "zod";
import * as Components from "./index";

register({
  id: "Hero",
  init: (context: SchemaContext) => ({
    title: z.string(),
    description: z.string(),
    images: z.array(
      z.object({
        meta: context.image(),
        alt: z.string(),
      })
    ),
  }),
  render: Components.Hero,
});
