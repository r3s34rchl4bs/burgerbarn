import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api.js'
import StatusBadge from './StatusBadge.jsx'

const STATUSES = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress',  label: 'In progress' },
  { value: 'done',         label: 'Done' },
  { value: 'blocked',      label: 'Blocked' },
]

export default function TaskPanel({ taskId, onClose, onUpdated }) {
  const qc = useQueryClient()

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn:  () => api.get(`/api/tasks/${taskId}`),
    refetchInterval: 20_000,
  })

  const updateStatus = useMutation({
    mutationFn: status => api.patch(`/api/tasks/${taskId}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task', taskId] })
      onUpdated()
    },
  })

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-10 md:hidden" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-zinc-950 border-l border-zinc-800 z-20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">Task</span>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-300 transition-colors text-sm"
          >
            Close
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Loading…</div>
        ) : task ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {/* Task title + description */}
            <div className="px-6 py-5 border-b border-zinc-800/60">
              <h2 className="text-zinc-100 font-medium text-base leading-snug mb-3">{task.title}</h2>
              {task.description && (
                <p className="text-zinc-500 text-sm leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Status */}
            <div className="px-6 py-5 border-b border-zinc-800/60">
              <p className="text-zinc-600 text-xs uppercase tracking-widest mb-3">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => updateStatus.mutate(s.value)}
                    disabled={updateStatus.isPending}
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                      task.status === s.value
                        ? 'border-zinc-400 text-zinc-100 bg-zinc-800'
                        : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity (shown only if there is any) */}
            {task.activity?.length > 0 && (
              <div className="px-6 py-5">
                <p className="text-zinc-600 text-xs uppercase tracking-widest mb-3">Activity</p>
                <div className="space-y-2.5">
                  {task.activity.map(item => (
                    <div key={item.id} className="flex items-start gap-2.5 text-xs text-zinc-500">
                      <span className="w-1 h-1 rounded-full bg-zinc-700 mt-1.5 shrink-0" />
                      <span>
                        <span className="text-zinc-400">{item.user_name}</span>
                        {item.action === 'status_changed' && (
                          <> changed status to <StatusBadge status={item.new_value} /></>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Not found.</div>
        )}
      </div>
    </>
  )
}
