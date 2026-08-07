import { useMemo } from 'react'
import api from '../../services/api'

export default function Profile() {
  const user = useMemo(() => api.getUser(), [])

  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <p><strong>Name:</strong> {user?.name || 'BlueWave User'}</p>
        <p><strong>Email:</strong> {user?.email || 'user@example.com'}</p>
        <p><strong>Role:</strong> {user?.role || 'Procurement Manager'}</p>
        <p className="muted">This profile view is connected to the session user data stored after login.</p>
      </div>
    </div>
  )
}
