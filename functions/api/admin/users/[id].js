import { json, err } from '../../_shared/response.js'

export async function onRequestDelete({ params, env, data }) {
  if (data.user.role !== 'owner') return err('Forbidden', 403)
  if (params.id === data.user.sub) return err('Cannot delete your own account')
  await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(params.id).run()
  return json({ ok: true })
}
