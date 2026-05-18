import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import Header from '../components/Header.jsx'

export default function AdminPage() {
  const navigate     = useNavigate()
  const qc           = useQueryClient()
  const [form, setForm]   = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn:  () => api.get('/api/admin/users'),
  })

  const addUser = useMutation({
    mutationFn: body => api.post('/api/admin/users', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      setForm({ name: '', email: '', password: '' })
      setError('')
    },
    onError: err => setError(err.message),
  })

  const removeUser = useMutation({
    mutationFn: id => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    addUser.mutate(form)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6"
        >
          ← Back to board
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Partners &amp; Accounts</h2>

        {/* User list */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 divide-y divide-slate-800 mb-8">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-white font-medium">{u.name}</p>
                <p className="text-slate-400 text-sm">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  u.role === 'owner'
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {u.role}
                </span>
                {u.role !== 'owner' && (
                  <button
                    onClick={() => removeUser.mutate(u.id)}
                    className="text-slate-500 hover:text-red-400 text-sm transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add partner */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <h3 className="text-white font-semibold mb-4">Add a partner</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                  placeholder="Partner name"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                  placeholder="partner@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Temporary password</label>
              <input
                type="password" required minLength={8} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                placeholder="Min 8 characters"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit" disabled={addUser.isPending}
              className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
            >
              {addUser.isPending ? 'Adding…' : 'Add partner'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
