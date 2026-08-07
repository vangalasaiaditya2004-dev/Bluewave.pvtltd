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
      // The backend expects a numeric role_id, so we convert the selected value before sending.
      await api.signup({ fullName, email, password, role_id: Number(roleId) })
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Signup failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 560, marginTop: 40 }}>
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Full Name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <input placeholder="Confirm Password" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} />
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
