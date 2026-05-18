const CONFIG = {
  not_started: { label: 'Not Started', cls: 'bg-slate-700 text-slate-300' },
  in_progress:  { label: 'In Progress', cls: 'bg-blue-900/60 text-blue-300 border border-blue-700/50' },
  done:         { label: 'Done',        cls: 'bg-green-900/60 text-green-300 border border-green-700/50' },
  blocked:      { label: 'Blocked',     cls: 'bg-red-900/60 text-red-300 border border-red-700/50' },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const { label, cls } = CONFIG[status] || CONFIG.not_started
  const textSize = size === 'xs' ? 'text-xs' : 'text-xs'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${textSize} ${cls}`}>
      {label}
    </span>
  )
}
