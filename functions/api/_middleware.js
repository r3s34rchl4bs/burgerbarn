import { verifyToken, parseCookies } from './_shared/auth.js'
import { err } from './_shared/response.js'

const PUBLIC = ['/api/auth/login', '/api/auth/logout', '/api/setup']

export async function onRequest(context) {
  const { request, next, env } = context
  const url = new URL(request.url)

  if (PUBLIC.includes(url.pathname)) return next()

  const cookies = parseCookies(request.headers.get('Cookie'))
  if (!cookies.token) return err('Unauthorized', 401)

  try {
    const payload = await verifyToken(cookies.token, env.JWT_SECRET)
    context.data.user = payload
    return next()
  } catch {
    return err('Unauthorized', 401)
  }
}
