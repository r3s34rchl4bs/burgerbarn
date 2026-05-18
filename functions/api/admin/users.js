import { hashPassword } from '../_shared/crypto.js'
import { json, err } from '../_shared/response.js'

function ownerOnly(user) {
  if (user?.role !== 'owner') return err('Owner access required', 403)
  return null
}

export async function onRequestGet({ env, data }) {
  const denied = ownerOnly(data.user)
  if (denied) return denied

  const users = await env.DB.prepare(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at'
  ).all()

  return json(users.results)
}

export async function onRequestPost({ request, env, data }) {
  const denied = ownerOnly(data.user)
  if (denied) return denied

  const { name, email, password } = await request.json()
  if (!name || !email || !password) return err('name, email and password are required')
  if (password.length < 8) return err('Password must be at least 8 characters')

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email.toLowerCase().trim()).first()
  if (existing) return err('A user with that email already exists')

  const id   = crypto.randomUUID()
  const hash = await hashPassword(password)

  await env.DB.prepare(
    'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, email.toLowerCase().trim(), name.trim(), hash, 'partner').run()

  return json({ id, name: name.trim(), email: email.toLowerCase().trim(), role: 'partner' }, 201)
}
