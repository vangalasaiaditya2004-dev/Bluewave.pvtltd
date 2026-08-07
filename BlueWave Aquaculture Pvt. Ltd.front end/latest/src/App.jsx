import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Forecast from './pages/Forecast'
import Purchase from './pages/Purchase'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Approvals from './pages/Approvals'
import Users from './pages/Users'
import AuditLogs from './pages/AuditLogs'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './styles/global.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  const location = useLocation()
  const isAuthenticated = Boolean(localStorage.getItem('token'))
  const showShell = ['/dashboard', '/inventory', '/forecast', '/purchase', '/suppliers', '/reports', '/notifications', '/profile', '/settings', '/approvals', '/users', '/audit-logs'].includes(location.pathname)

  return (
    <div>
      {showShell && <Navbar />}
      <div className={showShell ? 'app-layout' : ''}>
        {showShell && <Sidebar />}
        <main className={showShell ? 'main-content' : ''}>
          <Routes>
            <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/forecast" element={<ProtectedRoute><Forecast /></ProtectedRoute>} />
            <Route path="/purchase" element={<ProtectedRoute><Purchase /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App