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

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />

      <main className="flex-1 overflow-hidden relative">
        <div className={`h-full overflow-y-auto px-4 md:px-10 py-8 transition-all duration-200 scrollbar-thin ${
          selectedTaskId ? 'md:mr-[420px]' : ''
        }`}>
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-zinc-100 font-semibold text-lg">6-Phase Launch Plan</h1>
              <p className="text-zinc-500 text-sm mt-1">Click any task to view details and update its status.</p>
            </div>

            {isLoading ? (
              <div className="text-zinc-700 text-sm py-16 text-center">Loading…</div>
            ) : (
              <div className="space-y-2">
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

        {selectedTaskId && (
          <TaskPanel
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onUpdated={() => qc.invalidateQueries({ queryKey: ['phases'] })}
          />
        )}
      </main>
    </div>
  )
}
