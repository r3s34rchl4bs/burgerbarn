import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api.js'
import Header       from '../components/Header.jsx'
import PhaseSection from '../components/PhaseSection.jsx'
import TaskPanel    from '../components/TaskPanel.jsx'

export default function BoardPage() {
  const qc = useQueryClient()
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const { data: phases = [], isLoading } = useQuery({
    queryKey: ['phases'],
    queryFn:  () => api.get('/api/phases'),
    refetchInterval: 30_000,
  })

  function handleTaskUpdated() {
    qc.invalidateQueries({ queryKey: ['phases'] })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />

      <main className="flex-1 overflow-hidden relative">
        {/* Board */}
        <div
          className={`h-full overflow-y-auto px-4 md:px-8 py-6 transition-all duration-300 scrollbar-thin ${
            selectedTaskId ? 'mr-[460px]' : ''
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Strategic Roadmap</h2>
              <p className="text-slate-400 text-sm mt-0.5">6-Phase Launch Plan · Click any task to view details and leave comments</p>
            </div>

            {isLoading ? (
              <div className="text-slate-500 text-sm py-12 text-center">Loading roadmap…</div>
            ) : (
              <div className="space-y-4">
                {phases.map(phase => (
                  <PhaseSection
                    key={phase.id}
                    phase={phase}
                    selectedTaskId={selectedTaskId}
                    onSelectTask={setSelectedTaskId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Slide-out task panel */}
        {selectedTaskId && (
          <TaskPanel
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onUpdated={handleTaskUpdated}
          />
        )}
      </main>
    </div>
  )
}
