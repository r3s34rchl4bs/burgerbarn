import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api.js'
import Header       from '../components/Header.jsx'
import PhaseSection from '../components/PhaseSection.jsx'
import TaskPanel    from '../components/TaskPanel.jsx'
import Overview     from '../components/Overview.jsx'

const OVERVIEW = 0

export default function BoardPage() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab]           = useState(OVERVIEW)
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const { data: phases = [], isLoading } = useQuery({
    queryKey: ['phases'],
    queryFn:  () => api.get('/api/phases'),
    refetchInterval: 30_000,
  })

  function handleSelectPhase(phaseNumber) {
    setActiveTab(phaseNumber)
    setSelectedTaskId(null)
  }

  function handleSelectTask(id) {
    setSelectedTaskId(prev => prev === id ? null : id)
  }

  const activePhase = activeTab > 0 ? phases[activeTab - 1] : null

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />

      {/* Tab bar */}
      {!isLoading && (
        <div className="bg-white border-b border-gray-200 px-4 md:px-10 overflow-x-auto">
          <div className="flex min-w-max">
            {/* Overview tab */}
            <button
              onClick={() => { setActiveTab(OVERVIEW); setSelectedTaskId(null) }}
              className={`px-5 py-3.5 text-left border-b-2 transition-colors shrink-0 ${
                activeTab === OVERVIEW
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="text-xs font-medium mb-0.5 text-gray-400">Dashboard</div>
              <div className={`text-sm ${activeTab === OVERVIEW ? 'font-medium' : ''}`}>Overview</div>
              <div className="text-xs text-gray-400 mt-1">
                {phases.reduce((s, p) => s + p.progress.done, 0)}/
                {phases.reduce((s, p) => s + p.progress.total, 0)} done
              </div>
            </button>

            {/* Phase tabs */}
            {phases.map((phase, i) => {
              const tab = i + 1
              const pct = phase.progress.total > 0
                ? Math.round((phase.progress.done / phase.progress.total) * 100) : 0
              const hasBlocked = phase.tasks.some(t => t.status === 'blocked')
              return (
                <button
                  key={phase.id}
                  onClick={() => { setActiveTab(tab); setSelectedTaskId(null) }}
                  className={`px-5 py-3.5 text-left border-b-2 transition-colors shrink-0 ${
                    activeTab === tab
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs font-medium mb-0.5 text-gray-400">Phase {phase.number}</div>
                  <div className={`text-sm ${activeTab === tab ? 'font-medium' : ''}`}>{phase.title}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-10 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums">{phase.progress.done}/{phase.progress.total}</span>
                    {hasBlocked && <span className="text-xs text-red-400">·</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative">
        <div className={`h-full overflow-y-auto px-4 md:px-10 py-7 transition-all duration-200 scrollbar-thin ${
          selectedTaskId ? 'md:mr-[420px]' : ''
        }`}>
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="text-gray-400 text-sm py-16 text-center">Loading…</div>
            ) : activeTab === OVERVIEW ? (
              <Overview phases={phases} onSelectPhase={handleSelectPhase} />
            ) : activePhase ? (
              <>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">Phase {activePhase.number}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-400 text-xs">{activePhase.months}</span>
                  </div>
                  <h1 className="text-gray-900 font-semibold text-lg">{activePhase.title}</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Click a task to update status, assign it, or leave a note.
                    Use <span className="text-gray-600 font-medium">Guide</span> for step-by-step instructions.
                  </p>
                </div>
                <PhaseSection
                  phase={activePhase}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={handleSelectTask}
                />
              </>
            ) : null}
          </div>
        </div>

        {selectedTaskId && (
          <TaskPanel
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onUpdated={() => {
              qc.invalidateQueries({ queryKey: ['phases'] })
              qc.invalidateQueries({ queryKey: ['activity'] })
            }}
          />
        )}
      </main>
    </div>
  )
}
