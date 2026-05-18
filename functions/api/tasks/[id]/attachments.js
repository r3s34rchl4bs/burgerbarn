import { json, err } from '../../_shared/response.js'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function onRequestGet({ params, env }) {
  const rows = await env.DB.prepare(`
    SELECT a.*, u.name as user_name
    FROM attachments a JOIN users u ON a.user_id = u.id
    WHERE a.task_id = ? ORDER BY a.created_at ASC
  `).bind(params.id).all()
  return json(rows.results)
}

export async function onRequestPost({ params, request, env, data }) {
  let formData
  try { formData = await request.formData() }
  catch { return err('Expected multipart/form-data') }

  const file = formData.get('file')
  if (!file || typeof file === 'string') return err('No file provided')
  if (file.size > MAX_BYTES) return err('File too large — max 10 MB')

  const task = await env.DB.prepare('SELECT id FROM tasks WHERE id = ?').bind(params.id).first()
  if (!task) return err('Task not found', 404)

  const id  = crypto.randomUUID()
  const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : ''
  const r2Key = `tasks/${params.id}/${id}${ext ? '.' + ext : ''}`

  await env.FILES.put(r2Key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })

  const now = new Date().toISOString()
  await env.DB.prepare(`
    INSERT INTO attachments (id, task_id, user_id, filename, content_type, size, r2_key, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, params.id, data.user.sub, file.name, file.type || 'application/octet-stream', file.size, r2Key, now).run()

  return json({ id, filename: file.name, content_type: file.type, size: file.size, created_at: now }, 201)
}
