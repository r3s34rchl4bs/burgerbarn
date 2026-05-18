import { verifyPassword } from '../_shared/crypto.js'
import { signToken, setTokenCookie } from '../_shared/auth.js'
import { json, err } from '../_shared/response.js'

export async function onRequestPost({ request, env }) {
  const { email, password } = await request.json()
  if (!email || !password) return err('Email and password required')

  const user = await env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email.toLowerCase().trim()).first()

  if (!user) return err('Invalid email or password', 401)

  const ok = await verifyPassword(password, user.password_hash)
  if (!ok) return err('Invalid email or password', 401)

  const token = await signToken(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    env.JWT_SECRET
  )

  return json(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    200,
    { 'Set-Cookie': setTokenCookie(token) }
  )
}
