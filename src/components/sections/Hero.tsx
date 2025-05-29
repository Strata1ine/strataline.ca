import { z } from "zod";
import { register } from "@build/components";
import { type SchemaContext } from "astro:content";

export const Hero = (props: any) => {
  return (
    <main
      class="relative flex h-svh max-h-200 min-h-160 overflow-x-clip sm:max-h-350 sm:min-h-210"
    >
      <div
        class="bg-accent absolute z-[-1] hidden h-full w-[25.7%] rounded-br-sm sm:block xl:w-(--right-hero-offset)"
      />

      <div class="2xl:max-w-outer px-inset 2xl:mx-auto flex items-center gap-6 pt-15 sm:py-0 xl:gap-7 2xl:gap-9">
        <div class="relative flex-1">
        </div>
        <div class="relative flex-1">
          <h1 class="mb-2 font-serif text-5xl font-bold text-balance">
            {props.title}
          </h1>

          <p class="font-sans text-base">
            {props.description}
          </p>

          <div class="mt-8 pb-17" />
        </div>
      </div>
    </main>
  );
};

register({
  id: "Section.Hero",
  init: (context: SchemaContext) => ({
    title: z.string(),
    images: z.array(
      z.object({
        path: context.image(),
        alt: z.string(),
      })
    ),
  }),
  render: Hero,
});
