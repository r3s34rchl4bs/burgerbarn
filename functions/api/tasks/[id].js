import { json, err } from '../_shared/response.js'

export async function onRequestGet({ params, env }) {
  const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(params.id).first()
  if (!task) return err('Task not found', 404)

  const comments = await env.DB.prepare(`
    SELECT c.*, u.name as user_name, u.email as user_email
    FROM comments c JOIN users u ON c.user_id = u.id
    WHERE c.task_id = ? ORDER BY c.created_at ASC
  `).bind(params.id).all()

  const activity = await env.DB.prepare(`
    SELECT a.*, u.name as user_name
    FROM activity_log a JOIN users u ON a.user_id = u.id
    WHERE a.task_id = ? ORDER BY a.created_at DESC
  `).bind(params.id).all()

  return json({ ...task, comments: comments.results, activity: activity.results })
}

export async function onRequestPatch({ params, request, env, data }) {
  const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(params.id).first()
  if (!task) return err('Task not found', 404)

  const body = await request.json()
  const { status } = body

  const validStatuses = ['not_started', 'in_progress', 'done', 'blocked']
  if (!validStatuses.includes(status)) return err('Invalid status')

  const now = new Date().toISOString()

  await env.DB.prepare(
    'UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?'
  ).bind(status, now, params.id).run()

  if (status !== task.status && data.user?.sub) {
    await env.DB.prepare(
      'INSERT INTO activity_log (id, task_id, user_id, action, old_value, new_value, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(), params.id, data.user.sub,
      'status_changed', task.status, status, now
    ).run()
  }

  const updated = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(params.id).first()
  return json(updated)
}
