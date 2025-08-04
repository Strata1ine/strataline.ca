export async function onRequest(context: { locals: App.Locals }, next: () => Promise<Response>): Promise<Response> {
  context.locals.faqData = [];
  context.locals.reviewData = [];
  return next();
}
