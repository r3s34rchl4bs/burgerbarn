const CONFIG = {
  not_started: { label: 'Not started', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
  in_progress:  { label: 'In progress', cls: 'bg-blue-50 text-blue-600 border-blue-100' },
  done:         { label: 'Done',        cls: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  blocked:      { label: 'Blocked',     cls: 'bg-red-50 text-red-600 border-red-100' },
}

export default function StatusBadge({ status }) {
  const { label, cls } = CONFIG[status] ?? CONFIG.not_started
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}
