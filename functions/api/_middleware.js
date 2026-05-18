export async function onRequest(context) {
  context.data.user = { sub: null, name: 'Team', role: 'owner' }
  return context.next()
}
