import { getCollection } from 'astro:content';
import { Pos } from '~/components/variants';
import { config } from "~/config";

export async function onRequest(context: { locals: App.Locals }, next: () => Promise<Response>): Promise<Response> {
  const [index] = await getCollection("index");
  context.locals.index = index;
  context.locals.services = await getCollection("services", ({ data }) => import.meta.env.DEV || !data?.draft);
  context.locals.faqData = [];
  context.locals.reviewData = [];
  context.locals.nextPos = Pos.Left;
  context.locals.getNextPos = function(this: App.Locals): Pos {
    this.nextPos = this.nextPos === Pos.Left ? Pos.Right : Pos.Left;
    return this.nextPos;
  };


  context.locals.nextSwap = Pos.Left;
  context.locals.getNextSwap = function(this: App.Locals): Pos {
    this.nextSwap = this.nextSwap === Pos.Left ? Pos.Right : Pos.Left;
    return this.nextSwap;
  };

  context.locals.globalDefaults = config.globalDefaults;
  return next();
}
