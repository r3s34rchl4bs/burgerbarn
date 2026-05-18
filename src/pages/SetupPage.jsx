import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function SetupPage() {
  const navigate        = useNavigate()
  const { setUser }     = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/setup').then(({ needsSetup }) => {
      if (!needsSetup) navigate('/login', { replace: true })
      else setLoading(false)
    }).catch(() => navigate('/login', { replace: true }))
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const user = await api.post('/api/setup', form)
      setUser(user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍔</span>
          <h1 className="mt-3 text-2xl font-bold text-white">Welcome to BurgerBarn</h1>
          <p className="mt-1 text-slate-400 text-sm">Create your owner account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl p-6 space-y-4 border border-slate-800">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Your name</label>
            <input
              type="text" required autoFocus
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              placeholder="e.g. Maria"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password" required minLength={8}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg py-2.5 transition-colors"
          >
            Create account &amp; continue
          </button>
        </form>
      </div>
    </div>
  )
}
