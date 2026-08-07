import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [roleId, setRoleId] = useState('1')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirm) {
      setErrorMessage('Passwords do not match')
      return
    }

    try {
      await api.signup({ fullName, email, password, role_id: Number(roleId) })
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Signup failed')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="brand-pill">🌊 BlueWave Aquaculture</div>
        <h1>Create your operations team account.</h1>
        <p>Bring procurement, inventory planning, and supplier coordination into one structured platform.</p>
        <ul className="feature-list">
          <li>Role-based access</li>
          <li>Approval-ready workflows</li>
          <li>Clear reporting at a glance</li>
        </ul>
      </div>

      <div className="auth-card">
        <h2>Create account</h2>
        <p className="muted">Set up your workspace and start planning with confidence.</p>
        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="Full Name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <input className="input" placeholder="Confirm Password" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
          <select value={roleId} onChange={(event) => setRoleId(event.target.value)}>
            <option value="1">Procurement Manager</option>
            <option value="2">Inventory Planner</option>
            <option value="3">Warehouse User</option>
            <option value="4">Supplier</option>
            <option value="5">Finance Reviewer</option>
          </select>
          {errorMessage ? <p className="muted">{errorMessage}</p> : null}
          <button className="btn" type="submit">Create Account</button>
        </form>
        <p className="muted" style={{ marginTop: 12 }}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
