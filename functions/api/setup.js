import { hashPassword } from './_shared/crypto.js'
import { signToken, setTokenCookie } from './_shared/auth.js'
import { json, err } from './_shared/response.js'

export async function onRequestGet({ env }) {
  const row = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first()
  return json({ needsSetup: row.count === 0 })
}

export async function onRequestPost({ request, env }) {
  const row = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first()
  if (row.count > 0) return err('Setup already complete', 403)

  const { name, email, password } = await request.json()
  if (!name || !email || !password) return err('name, email and password are required')
  if (password.length < 8) return err('Password must be at least 8 characters')

  const id   = crypto.randomUUID()
  const hash = await hashPassword(password)

  await env.DB.prepare(
    'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, email.toLowerCase().trim(), name.trim(), hash, 'owner').run()

  const token = await signToken({ sub: id, name: name.trim(), email: email.toLowerCase().trim(), role: 'owner' }, env.JWT_SECRET)

  return json(
    { id, name: name.trim(), email: email.toLowerCase().trim(), role: 'owner' },
    200,
    { 'Set-Cookie': setTokenCookie(token) }
  )
}
