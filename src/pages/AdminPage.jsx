import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import Header from '../components/Header.jsx'

export default function AdminPage() {
  const navigate = useNavigate()
  const qc       = useQueryClient()
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
    onError: e => setError(e.message),
  })

  const removeUser = useMutation({
    mutationFn: id => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-gray-700 text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← Back to board
        </button>

        <h2 className="text-gray-900 font-semibold text-lg mb-6">Partners & Accounts</h2>

        {/* User list */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mb-6 shadow-sm">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-gray-800 font-medium text-sm">{u.name}</p>
                <p className="text-gray-400 text-xs">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${
                  u.role === 'owner'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {u.role}
                </span>
                {u.role !== 'owner' && (
                  <button
                    onClick={() => removeUser.mutate(u.id)}
                    className="text-gray-400 hover:text-red-500 text-xs transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add partner */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-gray-800 font-medium text-sm mb-4">Add a partner</h3>
          <form
            onSubmit={e => { e.preventDefault(); setError(''); addUser.mutate(form) }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-gray-400"
                  placeholder="Partner name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-gray-400"
                  placeholder="partner@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Temporary password</label>
              <input
                type="text" required minLength={8} value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-gray-400"
                placeholder="Min 8 characters"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit" disabled={addUser.isPending}
              className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              {addUser.isPending ? 'Adding…' : 'Add partner'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
