import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import LoginPage   from './pages/LoginPage.jsx'
import SetupPage   from './pages/SetupPage.jsx'
import BoardPage   from './pages/BoardPage.jsx'
import AdminPage   from './pages/AdminPage.jsx'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 10_000 } },
})

function ProtectedRoute({ children, ownerOnly }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (ownerOnly && user.role !== 'owner') return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute><BoardPage /></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute ownerOnly><AdminPage /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
