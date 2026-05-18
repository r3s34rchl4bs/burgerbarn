import { json } from './_shared/response.js'

export async function onRequestGet({ env }) {
  const phases = await env.DB.prepare(
    'SELECT * FROM phases ORDER BY number'
  ).all()

  const tasks = await env.DB.prepare(
    'SELECT * FROM tasks ORDER BY phase_id, order_index'
  ).all()

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
