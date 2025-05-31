import { getCollection } from 'astro:content';
import { Pos, swapPos } from '@sections/meta';

export async function onRequest(context: { locals: App.Locals }, next: () => Promise<Response>): Promise<Response> {
  const [index] = await getCollection("index");
  context.locals.index = index;
  context.locals.services = await getCollection("services", ({ data }) => import.meta.env.DEV || !data?.draft);
  context.locals.nextPos = Pos.Left;
  context.locals.getNextPos = function(this: App.Locals): Pos {
    this.nextPos = swapPos(this.nextPos);
    return this.nextPos;
  };

  return next();
}
