import { Pos, swapPos } from '@sections/meta';

export async function onRequest(context: { locals: App.Locals }, next: () => Promise<Response>): Promise<Response> {
  context.locals.nextPos = Pos.Left;
  context.locals.getNextPos = function(this: App.Locals): Pos {
    this.nextPos = swapPos(this.nextPos);
    return this.nextPos;
  };

  return next();
}
