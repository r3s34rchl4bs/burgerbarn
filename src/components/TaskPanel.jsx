import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { api } from '../lib/api.js'
import StatusBadge from './StatusBadge.jsx'

const STATUSES = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress',  label: 'In progress' },
  { value: 'done',         label: 'Done' },
  { value: 'blocked',      label: 'Blocked' },
]

function timeAgo(str) {
  try { return formatDistanceToNow(new Date(str), { addSuffix: true }) }
  catch { return '' }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(contentType) {
  if (contentType?.startsWith('image/')) return '🖼'
  if (contentType === 'application/pdf') return '📄'
  if (contentType?.includes('word') || contentType?.includes('document')) return '📝'
  if (contentType?.includes('sheet') || contentType?.includes('excel')) return '📊'
  return '📎'
}

function isImage(contentType) {
  return contentType?.startsWith('image/')
}

export default function TaskPanel({ taskId, onClose, onUpdated }) {
  const qc          = useQueryClient()
  const fileInputRef = useRef(null)
  const [comment, setComment]   = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn:  () => api.get(`/api/tasks/${taskId}`),
    refetchInterval: 20_000,
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn:  () => api.get('/api/users'),
    staleTime: Infinity,
  })

  const updateStatus = useMutation({
    mutationFn: status => api.patch(`/api/tasks/${taskId}`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['task', taskId] }); onUpdated() },
  })

  const assignUser = useMutation({
    mutationFn: assigned_to => api.patch(`/api/tasks/${taskId}`, { assigned_to }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['task', taskId] }); onUpdated() },
  })

  const postComment = useMutation({
    mutationFn: content => api.post(`/api/tasks/${taskId}/comments`, { content }),
    onSuccess: () => {
      setComment('')
      qc.invalidateQueries({ queryKey: ['task', taskId] })
      qc.invalidateQueries({ queryKey: ['activity'] })
    },
  })

  const deleteAttachment = useMutation({
    mutationFn: id => api.delete(`/api/attachments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['task', taskId] }),
  })

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File too large — max 10 MB')
      return
    }
    setUploadError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/tasks/${taskId}/attachments`, {
        method: 'POST',
        body: form,
        credentials: 'same-origin',
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Upload failed')
      }
      qc.invalidateQueries({ queryKey: ['task', taskId] })
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 bg-black/10 z-10 md:hidden" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white border-l border-gray-200 z-20 flex flex-col shadow-sm">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <span className="text-gray-400 text-xs uppercase tracking-widest font-medium">Task detail</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-sm transition-colors">Close</button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading…</div>
        ) : task ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin">

            {/* Title + description */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-gray-900 font-semibold text-base leading-snug mb-2">{task.title}</h2>
              {task.description && (
                <p className="text-gray-500 text-sm leading-relaxed">{task.description}</p>
              )}
            </div>

            {/* Status */}
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => updateStatus.mutate(s.value)}
                    disabled={updateStatus.isPending}
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                      task.status === s.value
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assign to */}
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Assigned to</p>
              <select
                value={task.assigned_to || ''}
                onChange={e => assignUser.mutate(e.target.value || null)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:border-gray-400 bg-white"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Attachments */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs uppercase tracking-widest">
                  Files {task.attachments?.length > 0 && `(${task.attachments.length})`}
                </p>
                <label className={`cursor-pointer text-xs border rounded px-2.5 py-1 transition-colors ${
                  uploading
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}>
                  {uploading ? 'Uploading…' : '+ Attach file'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    disabled={uploading}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.ppt,.pptx,.zip"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {uploadError && (
                <p className="text-red-500 text-xs mb-2">{uploadError}</p>
              )}

              {task.attachments?.length > 0 ? (
                <div className="space-y-2">
                  {task.attachments.map(a => (
                    <div key={a.id} className="group">
                      {isImage(a.content_type) ? (
                        <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                          <a href={`/api/attachments/${a.id}`} target="_blank" rel="noopener noreferrer">
                            <img
                              src={`/api/attachments/${a.id}`}
                              alt={a.filename}
                              className="w-full max-h-48 object-cover"
                            />
                          </a>
                          <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-100">
                            <div className="min-w-0">
                              <p className="text-gray-700 text-xs font-medium truncate">{a.filename}</p>
                              <p className="text-gray-400 text-xs">{formatSize(a.size)} · {timeAgo(a.created_at)}</p>
                            </div>
                            <button
                              onClick={() => deleteAttachment.mutate(a.id)}
                              disabled={deleteAttachment.isPending}
                              className="text-gray-300 hover:text-red-400 text-xs ml-2 transition-colors"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <span className="text-base shrink-0">{fileIcon(a.content_type)}</span>
                          <div className="flex-1 min-w-0">
                            <a
                              href={`/api/attachments/${a.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 text-xs font-medium hover:text-gray-900 truncate block"
                            >
                              {a.filename}
                            </a>
                            <p className="text-gray-400 text-xs">{formatSize(a.size)} · {timeAgo(a.created_at)}</p>
                          </div>
                          <button
                            onClick={() => deleteAttachment.mutate(a.id)}
                            disabled={deleteAttachment.isPending}
                            className="text-gray-300 hover:text-red-400 text-xs transition-colors shrink-0"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No files attached yet.</p>
              )}
            </div>

            {/* Comments */}
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
                Notes & Comments {task.comments?.length > 0 && `(${task.comments.length})`}
              </p>

              {task.comments?.length > 0 ? (
                <div className="space-y-4 mb-4">
                  {task.comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {c.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-gray-800 text-sm font-medium">{c.user_name}</span>
                          <span className="text-gray-400 text-xs">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm mb-4">No notes yet.</p>
              )}

              <form
                onSubmit={e => { e.preventDefault(); if (comment.trim()) postComment.mutate(comment.trim()) }}
                className="space-y-2"
              >
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      if (comment.trim()) postComment.mutate(comment.trim())
                    }
                  }}
                  placeholder="Add a note or update… (⌘↵ to post)"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none scrollbar-thin"
                />
                <button
                  type="submit"
                  disabled={!comment.trim() || postComment.isPending}
                  className="bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                >
                  {postComment.isPending ? 'Posting…' : 'Post'}
                </button>
              </form>
            </div>

            {/* Activity */}
            {task.activity?.length > 0 && (
              <div className="px-6 py-5">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Activity</p>
                <div className="space-y-2.5">
                  {task.activity.map(item => (
                    <div key={item.id} className="flex items-start gap-2.5 text-xs text-gray-400">
                      <span className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                      <span>
                        <span className="text-gray-600 font-medium">{item.user_name}</span>
                        {item.action === 'status_changed' && <> changed status to <StatusBadge status={item.new_value} /></>}
                        {item.action === 'commented' && ' left a note'}
                        {item.action === 'assigned' && ` assigned to ${item.new_value}`}
                        <span className="text-gray-300 ml-1">{timeAgo(item.created_at)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Not found.</div>
        )}
      </div>
    </>
  )
}
