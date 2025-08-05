export async function onRequest(context: { locals: App.Locals }, next: () => Promise<Response>): Promise<Response> {
  return next();
}
