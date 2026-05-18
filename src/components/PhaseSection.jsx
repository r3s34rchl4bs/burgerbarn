import { useState } from 'react'
import StatusBadge from './StatusBadge.jsx'

export default function PhaseSection({ phase, selectedTaskId, onSelectTask }) {
  const [open, setOpen] = useState(true)
  const { done, total } = phase.progress
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-900/60 transition-colors text-left"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-zinc-600 text-xs font-mono shrink-0 w-14">Phase {phase.number}</span>
          <span className="text-zinc-100 font-medium text-sm truncate">{phase.title}</span>
          <span className="text-zinc-600 text-xs shrink-0 hidden sm:block">{phase.months}</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-6">
          <div className="flex items-center gap-2">
            <div className="w-16 h-px bg-zinc-800 relative">
              <div
                className="absolute inset-y-0 left-0 bg-zinc-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-zinc-600 text-xs tabular-nums">{done}/{total}</span>
          </div>
          <span className="text-zinc-700 text-xs">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="divide-y divide-zinc-800/60 border-t border-zinc-800">
          {phase.tasks.map(task => (
            <button
              key={task.id}
              onClick={() => onSelectTask(selectedTaskId === task.id ? null : task.id)}
              className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-zinc-900/60 ${
                selectedTaskId === task.id ? 'bg-zinc-900' : ''
              }`}
            >
              <StatusBadge status={task.status} />
              <span className={`flex-1 text-sm ${
                task.status === 'done' ? 'text-zinc-600 line-through' : 'text-zinc-300'
              }`}>
                {task.title}
              </span>
              <span className="text-zinc-700 text-xs shrink-0">›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
