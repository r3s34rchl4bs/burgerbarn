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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 font-semibold text-xl">BurgerBarn</h1>
          <p className="text-gray-400 text-sm mt-1">Create your owner account to get started</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
              <input
                type="text" required autoFocus
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
                placeholder="e.g. Maria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" required minLength={8}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
                placeholder="At least 8 characters"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
