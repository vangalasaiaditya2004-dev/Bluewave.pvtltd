import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './styles.css'

export default function Navbar(){
  const navigate = useNavigate()
  return (
    <header className="navbar">
      <div className="logo">BlueWave Optimizer</div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <button className="btn" onClick={()=>navigate('/dashboard')}>Dashboard</button>
        <Link to="/profile" className="muted">Profile</Link>
      </div>
    </header>
  )
}
