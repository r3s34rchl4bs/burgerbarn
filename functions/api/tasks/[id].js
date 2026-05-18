import { json, err } from '../_shared/response.js'

export async function onRequestGet({ params, env }) {
  const task = await env.DB.prepare(`
    SELECT t.*, u.name as assigned_to_name
    FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.id = ?
  `).bind(params.id).first()
  if (!task) return err('Task not found', 404)

  const comments = await env.DB.prepare(`
    SELECT c.*, u.name as user_name
    FROM comments c JOIN users u ON c.user_id = u.id
    WHERE c.task_id = ? ORDER BY c.created_at ASC
  `).bind(params.id).all()

  const activity = await env.DB.prepare(`
    SELECT a.*, u.name as user_name
    FROM activity_log a JOIN users u ON a.user_id = u.id
    WHERE a.task_id = ? ORDER BY a.created_at DESC
  `).bind(params.id).all()

  const attachments = await env.DB.prepare(`
    SELECT a.*, u.name as user_name
    FROM attachments a JOIN users u ON a.user_id = u.id
    WHERE a.task_id = ? ORDER BY a.created_at ASC
  `).bind(params.id).all()

  return json({ ...task, comments: comments.results, activity: activity.results, attachments: attachments.results })
}

export async function onRequestPatch({ params, request, env, data }) {
  const task = await env.DB.prepare('SELECT * FROM tasks WHERE id = ?').bind(params.id).first()
  if (!task) return err('Task not found', 404)

  const body = await request.json()
  const now  = new Date().toISOString()

  if (body.status !== undefined) {
    const valid = ['not_started', 'in_progress', 'done', 'blocked']
    if (!valid.includes(body.status)) return err('Invalid status')

    await env.DB.prepare(
      'UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?'
    ).bind(body.status, now, params.id).run()

    if (body.status !== task.status && data.user?.sub) {
      await env.DB.prepare(
        'INSERT INTO activity_log (id, task_id, user_id, action, old_value, new_value, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(crypto.randomUUID(), params.id, data.user.sub, 'status_changed', task.status, body.status, now).run()
    }
  }

  if (body.assigned_to !== undefined) {
    const assignee = body.assigned_to
      ? await env.DB.prepare('SELECT id, name FROM users WHERE id = ?').bind(body.assigned_to).first()
      : null
    if (body.assigned_to && !assignee) return err('User not found')

    await env.DB.prepare(
      'UPDATE tasks SET assigned_to = ?, updated_at = ? WHERE id = ?'
    ).bind(body.assigned_to || null, now, params.id).run()

    if (data.user?.sub) {
      await env.DB.prepare(
        'INSERT INTO activity_log (id, task_id, user_id, action, new_value, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(crypto.randomUUID(), params.id, data.user.sub, 'assigned',
        assignee ? assignee.name : 'Unassigned', now).run()
    }
  }

  const updated = await env.DB.prepare(`
    SELECT t.*, u.name as assigned_to_name
    FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.id = ?
  `).bind(params.id).first()

  return json(updated)
}
