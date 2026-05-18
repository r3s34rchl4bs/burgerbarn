import { err } from '../_shared/response.js'

export async function onRequestGet({ params, env }) {
  const attachment = await env.DB.prepare('SELECT * FROM attachments WHERE id = ?').bind(params.id).first()
  if (!attachment) return err('Not found', 404)

  const object = await env.FILES.get(attachment.r2_key)
  if (!object) return err('File not found in storage', 404)

  return new Response(object.body, {
    headers: {
      'Content-Type': attachment.content_type,
      'Content-Disposition': `inline; filename="${attachment.filename}"`,
      'Cache-Control': 'private, max-age=3600',
      'Content-Length': String(attachment.size),
    },
  })
}

export async function onRequestDelete({ params, env, data }) {
  const attachment = await env.DB.prepare('SELECT * FROM attachments WHERE id = ?').bind(params.id).first()
  if (!attachment) return err('Not found', 404)

  await env.FILES.delete(attachment.r2_key)
  await env.DB.prepare('DELETE FROM attachments WHERE id = ?').bind(params.id).run()

  return new Response(null, { status: 204 })
}
