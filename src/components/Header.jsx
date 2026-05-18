import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍔</span>
        <div>
          <span className="text-white font-bold text-lg leading-none">BurgerBarn</span>
          <span className="text-slate-500 text-xs ml-2">Partners Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'owner' && (
          <Link
            to="/admin"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Partners
          </Link>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-slate-500 text-xs capitalize leading-none mt-0.5">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-400 text-sm transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
