const CONFIG = {
  not_started: { label: 'Not started', cls: 'text-zinc-500 border-zinc-700 bg-zinc-900' },
  in_progress:  { label: 'In progress', cls: 'text-sky-400 border-sky-900 bg-sky-950/40' },
  done:         { label: 'Done',        cls: 'text-emerald-400 border-emerald-900 bg-emerald-950/40' },
  blocked:      { label: 'Blocked',     cls: 'text-red-400 border-red-900 bg-red-950/40' },
}

export default function StatusBadge({ status }) {
  const { label, cls } = CONFIG[status] ?? CONFIG.not_started
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${cls}`}>
      {label}
    </span>
  )
}
