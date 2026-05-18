import { json, err } from '../../_shared/response.js'

export async function onRequestPost({ params, request, env, data }) {
  const task = await env.DB.prepare('SELECT id FROM tasks WHERE id = ?').bind(params.id).first()
  if (!task) return err('Task not found', 404)

  const { content } = await request.json()
  if (!content || !content.trim()) return err('Comment content is required')

  const id  = crypto.randomUUID()
  const now = new Date().toISOString()

  await env.DB.prepare(
    'INSERT INTO comments (id, task_id, user_id, content, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, params.id, data.user.sub, content.trim(), now).run()

  await env.DB.prepare(
    'INSERT INTO activity_log (id, task_id, user_id, action, new_value, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(crypto.randomUUID(), params.id, data.user.sub, 'commented', content.trim().slice(0, 80), now).run()

  return json({
    id, task_id: params.id,
    user_id: data.user.sub,
    user_name: data.user.name,
    user_email: data.user.email,
    content: content.trim(),
    created_at: now,
  }, 201)
}
