import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      await api.login({ email, password })
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Login failed')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand-pill">🌊 BlueWave Aquaculture</div>
        <h1>Run your farm operations with clarity.</h1>
        <p>Track inventory, suppliers, approvals and forecasts in one polished workspace designed for fast decisions.</p>
        <ul className="feature-list">
          <li>Live inventory visibility</li>
          <li>Smarter procurement planning</li>
          <li>Shared team workflow insights</li>
        </ul>
      </div>

      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue managing your aquaculture supply chain.</p>
        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {errorMessage ? <p className="muted">{errorMessage}</p> : null}
          <button className="btn" type="submit">Login</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>Don't have an account? <Link to="/signup">Create one</Link></p>
      </div>
    </div>
  )
}

export default Login
