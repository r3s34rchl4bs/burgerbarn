import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { api } from '../lib/api.js'
import StatusBadge from './StatusBadge.jsx'

const STATUSES = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress',  label: 'In Progress' },
  { value: 'done',         label: 'Done' },
  { value: 'blocked',      label: 'Blocked' },
]

function timeAgo(dateStr) {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true }) }
  catch { return '' }
}

function ActivityItem({ item }) {
  if (item.action === 'status_changed') {
    return (
      <div className="flex items-start gap-2 text-xs text-slate-400">
        <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" />
        <span>
          <span className="text-slate-300 font-medium">{item.user_name}</span>
          {' '}changed status to{' '}
          <StatusBadge status={item.new_value} />
          <span className="text-slate-600 ml-1">{timeAgo(item.created_at)}</span>
        </span>
      </div>
    )
  }
  if (item.action === 'commented') {
    return (
      <div className="flex items-start gap-2 text-xs text-slate-400">
        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />
        <span>
          <span className="text-slate-300 font-medium">{item.user_name}</span>
          {' '}commented
          <span className="text-slate-600 ml-1">{timeAgo(item.created_at)}</span>
        </span>
      </div>
    )
  }
  return null
}

export default function TaskPanel({ taskId, onClose, onUpdated }) {
  const qc              = useQueryClient()
  const [comment, setComment] = useState('')
  const commentRef      = useRef(null)

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn:  () => api.get(`/api/tasks/${taskId}`),
    refetchInterval: 15_000,
  })

  const updateStatus = useMutation({
    mutationFn: status => api.patch(`/api/tasks/${taskId}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task', taskId] })
      onUpdated()
    },
  })

  const postComment = useMutation({
    mutationFn: content => api.post(`/api/tasks/${taskId}/comments`, { content }),
    onSuccess: () => {
      setComment('')
      qc.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })

  function handleCommentSubmit(e) {
    e.preventDefault()
    if (!comment.trim()) return
    postComment.mutate(comment.trim())
  }

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 bg-black/40 z-10 md:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[460px] bg-slate-900 border-l border-slate-800 z-20 flex flex-col shadow-2xl">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Task Detail</p>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Loading…</div>
        ) : task ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {/* Task info */}
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold text-base leading-snug mb-3">{task.title}</h2>

              {/* Status selector */}
              <div className="mb-3">
                <p className="text-xs text-slate-500 mb-1.5">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus.mutate(s.value)}
                      disabled={updateStatus.isPending}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        task.status === s.value
                          ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                          : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {task.description && (
                <p className="text-slate-400 text-sm leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Comments */}
            <div className="px-5 py-4 border-b border-slate-800">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                Comments {task.comments?.length > 0 && `(${task.comments.length})`}
              </p>

              {task.comments?.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {task.comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-500/80 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-white text-sm font-medium">{c.user_name}</span>
                          <span className="text-slate-600 text-xs">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-sm mb-4">No comments yet.</p>
              )}

              {/* Add comment */}
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <textarea
                  ref={commentRef}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCommentSubmit(e)
                  }}
                  placeholder="Add a comment… (⌘↵ to send)"
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500 resize-none scrollbar-thin"
                />
                <button
                  type="submit"
                  disabled={!comment.trim() || postComment.isPending}
                  className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
                >
                  {postComment.isPending ? 'Posting…' : 'Post'}
                </button>
              </form>
            </div>

            {/* Activity log */}
            {task.activity?.length > 0 && (
              <div className="px-5 py-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Activity</p>
                <div className="space-y-2.5">
                  {task.activity.map(item => (
                    <ActivityItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Task not found.</div>
        )}
      </div>
    </>
  )
}
