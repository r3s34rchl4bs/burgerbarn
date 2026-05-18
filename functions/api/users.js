import { json } from './_shared/response.js'

export async function onRequestGet({ env }) {
  const rows = await env.DB.prepare(
    'SELECT id, name FROM users ORDER BY name'
  ).all()
  return json(rows.results)
}
