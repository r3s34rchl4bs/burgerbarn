import { useState } from 'react'
import StatusBadge from './StatusBadge.jsx'

function Assignee({ name }) {
  if (!name) return (
    <span className="text-xs text-gray-300 w-6 text-center">—</span>
  )
  return (
    <span
      title={name}
      className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center shrink-0"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export default function PhaseSection({ phase, selectedTaskId, onSelectTask }) {
  const [expanded, setExpanded] = useState({})
  const { done, total } = phase.progress
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  function toggleGuide(taskId, e) {
    e.stopPropagation()
    setExpanded(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Progress bar */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">{done} of {total} tasks completed</span>
          <span className={`text-xs font-semibold ${pct === 100 ? 'text-emerald-600' : 'text-gray-700'}`}>
            {pct}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-gray-900'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="divide-y divide-gray-100">
        {phase.tasks.map(task => (
          <div key={task.id}>
            <div className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
              selectedTaskId === task.id ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}>
              <StatusBadge status={task.status} />

              <button
                onClick={() => onSelectTask(task.id)}
                className={`flex-1 text-sm text-left transition-colors ${
                  task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {task.title}
              </button>

              <Assignee name={task.assigned_to_name} />

              {task.description && (
                <button
                  onClick={e => toggleGuide(task.id, e)}
                  className={`text-xs border rounded px-2 py-0.5 transition-colors shrink-0 ${
                    expanded[task.id]
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
                  }`}
                >
                  {expanded[task.id] ? 'Hide' : 'Guide'}
                </button>
              )}
            </div>

            {expanded[task.id] && task.description && (
              <div className="px-5 py-4 bg-blue-50 border-t border-blue-100">
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1.5">
                  How to complete this step
                </p>
                <p className="text-sm text-blue-900 leading-relaxed">{task.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
