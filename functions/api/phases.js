import { json } from './_shared/response.js'

export async function onRequestGet({ env }) {
  const phases = await env.DB.prepare(
    'SELECT * FROM phases ORDER BY number'
  ).all()

  const tasks = await env.DB.prepare(`
    SELECT t.*, u.name as assigned_to_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    ORDER BY t.phase_id, t.order_index
  `).all()

  const result = phases.results.map(phase => {
    const phaseTasks = tasks.results.filter(t => t.phase_id === phase.id)
    return {
      ...phase,
      tasks: phaseTasks,
      progress: {
        done:  phaseTasks.filter(t => t.status === 'done').length,
        total: phaseTasks.length,
      },
    }
  })

  return json(result)
}
