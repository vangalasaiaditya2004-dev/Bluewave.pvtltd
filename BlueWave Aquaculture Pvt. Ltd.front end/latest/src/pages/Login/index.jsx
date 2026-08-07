import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    try {
      // Send the login request to the backend and save the returned token.
      await api.login({ email, password })
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Login failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 40 }}>
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {errorMessage ? <p className="muted">{errorMessage}</p> : null}
          <button className="btn" type="submit">Login</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  )
}
