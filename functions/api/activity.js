import { json } from './_shared/response.js'

export async function onRequestGet({ env }) {
  const rows = await env.DB.prepare(`
    SELECT a.*, u.name as user_name,
           t.title as task_title,
           p.title as phase_title, p.number as phase_number
    FROM activity_log a
    JOIN users u ON a.user_id = u.id
    JOIN tasks t ON a.task_id = t.id
    JOIN phases p ON t.phase_id = p.id
    ORDER BY a.created_at DESC
    LIMIT 30
  `).all()
  return json(rows.results)
}
