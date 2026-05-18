import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { api } from '../lib/api.js'
import StatusBadge from './StatusBadge.jsx'

function timeAgo(str) {
  try { return formatDistanceToNow(new Date(str), { addSuffix: true }) }
  catch { return '' }
}

function initial(name) {
  if (!name) return '?'
  if (name.length <= 2) return name.toUpperCase()
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Overview({ phases, onSelectPhase }) {
  const totalDone  = phases.reduce((s, p) => s + p.progress.done, 0)
  const totalTasks = phases.reduce((s, p) => s + p.progress.total, 0)
  const pct        = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0

  const blocked = phases.flatMap(p =>
    p.tasks.filter(t => t.status === 'blocked').map(t => ({ ...t, phaseTitle: p.title, phaseNum: p.number }))
  )

  const inProgress = phases.flatMap(p =>
    p.tasks.filter(t => t.status === 'in_progress').map(t => ({ ...t, phaseTitle: p.title, phaseNum: p.number }))
  )

  const { data: activity = [] } = useQuery({
    queryKey: ['activity'],
    queryFn:  () => api.get('/api/activity'),
    refetchInterval: 30_000,
  })

  const currentPhase = phases.find(p => p.progress.done < p.progress.total) || phases[phases.length - 1]

  return (
    <div className="space-y-4">

      {/* Hero — overall progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Overall Progress</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">{pct}%</span>
              <span className="text-gray-400 text-sm">{totalDone} of {totalTasks} tasks done</span>
            </div>
          </div>
          {currentPhase && (
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Active Phase</p>
              <p className="text-sm font-medium text-gray-700">Phase {currentPhase.number}</p>
              <p className="text-xs text-gray-400">{currentPhase.title}</p>
            </div>
          )}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? 'bg-emerald-500' : 'bg-gray-900'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Phase breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Phase Breakdown</p>
        </div>
        <div className="divide-y divide-gray-100">
          {phases.map((phase, i) => {
            const p = phase.progress.total > 0
              ? Math.round((phase.progress.done / phase.progress.total) * 100)
              : 0
            const allDone    = phase.progress.done === phase.progress.total
            const hasBlocked = phase.tasks.some(t => t.status === 'blocked')
            return (
              <button
                key={phase.id}
                onClick={() => onSelectPhase(i + 1)}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-gray-400 text-xs font-mono w-14 shrink-0">Phase {phase.number}</span>
                <span className="text-gray-700 text-sm flex-1 truncate">{phase.title}</span>
                {hasBlocked && (
                  <span className="text-xs text-red-500 font-medium shrink-0">Blocked</span>
                )}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${allDone ? 'bg-emerald-500' : 'bg-gray-900'}`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 tabular-nums w-8">{phase.progress.done}/{phase.progress.total}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* In Progress */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">In Progress</p>
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded px-1.5 py-0.5">
              {inProgress.length}
            </span>
          </div>
          {inProgress.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {inProgress.map(task => (
                <div key={task.id} className="px-5 py-3">
                  <p className="text-sm text-gray-700">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Phase {task.phaseNum} · {task.phaseTitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-4 text-sm text-gray-400">No tasks in progress.</p>
          )}
        </div>

        {/* Blocked */}
        <div className={`border rounded-xl shadow-sm overflow-hidden ${blocked.length > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}>
          <div className="px-5 py-3.5 border-b border-red-100 flex items-center justify-between">
            <p className={`text-xs uppercase tracking-widest font-medium ${blocked.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>
              Blocked
            </p>
            {blocked.length > 0 && (
              <span className="text-xs bg-red-100 text-red-600 border border-red-200 rounded px-1.5 py-0.5">
                {blocked.length}
              </span>
            )}
          </div>
          {blocked.length > 0 ? (
            <div className="divide-y divide-red-100">
              {blocked.map(task => (
                <div key={task.id} className="px-5 py-3">
                  <p className="text-sm text-red-800">{task.title}</p>
                  <p className="text-xs text-red-400 mt-0.5">Phase {task.phaseNum} · {task.phaseTitle}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-4 text-sm text-gray-400">Nothing blocked.</p>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Recent Activity</p>
        </div>
        {activity.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {activity.map(item => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                  {initial(item.user_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-medium text-gray-800">{item.user_name}</span>
                    {item.action === 'status_changed' && (
                      <span className="text-sm text-gray-500">
                        marked <span className="text-gray-700 font-medium">{item.task_title}</span> as
                      </span>
                    )}
                    {item.action === 'commented' && (
                      <span className="text-sm text-gray-500">
                        commented on <span className="text-gray-700 font-medium">{item.task_title}</span>
                      </span>
                    )}
                    {item.action === 'assigned' && (
                      <span className="text-sm text-gray-500">
                        assigned <span className="text-gray-700 font-medium">{item.task_title}</span> to {item.new_value}
                      </span>
                    )}
                    {item.action === 'status_changed' && (
                      <StatusBadge status={item.new_value} />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Phase {item.phase_number} · {timeAgo(item.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5 py-6 text-sm text-gray-400 text-center">
            No activity yet. Start updating tasks to see the history here.
          </p>
        )}
      </div>
    </div>
  )
}
