import { useState } from 'react'
import StatusBadge from './StatusBadge.jsx'

const PHASE_COLORS = [
  'border-amber-500',
  'border-orange-500',
  'border-yellow-500',
  'border-lime-500',
  'border-green-500',
  'border-emerald-500',
]

export default function PhaseSection({ phase, selectedTaskId, onSelectTask }) {
  const [open, setOpen] = useState(true)
  const pct = phase.progress.total > 0
    ? Math.round((phase.progress.done / phase.progress.total) * 100)
    : 0
  const color = PHASE_COLORS[(phase.number - 1) % PHASE_COLORS.length]

  return (
    <div className={`bg-slate-900 rounded-xl border border-slate-800 border-l-4 ${color} overflow-hidden`}>
      {/* Phase header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-slate-500 text-sm font-mono shrink-0">Phase {phase.number}</span>
          <span className="text-white font-semibold truncate">{phase.title}</span>
          <span className="text-slate-500 text-xs shrink-0 hidden sm:inline">{phase.months}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-slate-400 text-xs">{phase.progress.done}/{phase.progress.total}</span>
          </div>
          <span className="text-slate-500 text-sm">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {/* Task list */}
      {open && (
        <div className="divide-y divide-slate-800/60">
          {phase.tasks.map(task => (
            <button
              key={task.id}
              onClick={() => onSelectTask(selectedTaskId === task.id ? null : task.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-800/50 ${
                selectedTaskId === task.id ? 'bg-slate-800' : ''
              }`}
            >
              <StatusBadge status={task.status} />
              <span className={`flex-1 text-sm ${
                task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'
              }`}>
                {task.title}
              </span>
              <span className="text-slate-600 text-xs hidden sm:inline shrink-0">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
