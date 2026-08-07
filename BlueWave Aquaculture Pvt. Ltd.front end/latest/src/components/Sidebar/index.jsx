import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './styles.css'
import { FiHome, FiBox, FiTrendingUp, FiShoppingCart, FiUsers, FiBarChart2, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import api from '../../services/api'

const links = [
  {to:'/dashboard',label:'Dashboard',icon:<FiHome/>},
  {to:'/inventory',label:'Inventory',icon:<FiBox/>},
  {to:'/forecast',label:'Demand Forecast',icon:<FiTrendingUp/>},
  {to:'/purchase',label:'Purchase Planning',icon:<FiShoppingCart/>},
  {to:'/suppliers',label:'Suppliers',icon:<FiUsers/>},
  {to:'/reports',label:'Reports',icon:<FiBarChart2/>},
  {to:'/notifications',label:'Notifications',icon:<FiBell/>},
  {to:'/profile',label:'Profile',icon:<FiUser/>},
  {to:'/settings',label:'Settings',icon:<FiSettings/>},
]

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear the saved auth token so the user is sent back to the login page.
    api.logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 16, fontWeight: 700, color: 'var(--primary)' }}>BlueWave</div>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <span style={{ fontSize: 18 }}>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
        <div style={{ height: 1, background: '#eef2f7', margin: '12px 0' }} />
        <button type="button" className="nav-link" onClick={handleLogout} style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
          <FiLogOut /> <span>Logout</span>
        </button>
      </nav>
    </aside>
  )
}
