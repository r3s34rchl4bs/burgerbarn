import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-3.5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-gray-900 font-semibold text-sm tracking-tight">BurgerBarn</span>
        <span className="text-gray-300">·</span>
        <span className="text-gray-400 text-sm">Strategic Roadmap</span>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'owner' && (
          <Link to="/accounts" className="text-gray-400 hover:text-gray-700 text-sm transition-colors">
            Accounts
          </Link>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <span className="text-gray-700 text-sm hidden sm:block">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-gray-700 text-sm transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
