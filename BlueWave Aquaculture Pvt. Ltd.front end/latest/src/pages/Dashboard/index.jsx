import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import Table from '../../components/Table'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import api from '../../services/api'

const forecastData = [
  { name: 'Jan', demand: 400 },
  { name: 'Feb', demand: 480 },
  { name: 'Mar', demand: 500 },
  { name: 'Apr', demand: 570 },
  { name: 'May', demand: 650 },
]

const purchaseData = [
  { name: 'Jan', purchase: 200 },
  { name: 'Feb', purchase: 260 },
  { name: 'Mar', purchase: 300 },
  { name: 'Apr', purchase: 320 },
  { name: 'May', purchase: 400 },
]

const recent = [
  { date: '2026-07-30', activity: 'Created PO #1234', user: 'Procurement Manager' },
  { date: '2026-07-29', activity: 'Inventory adjusted - shrimp', user: 'Warehouse User' },
]

export default function Dashboard() {
  const [stats, setStats] = useState({ total_items: 0, low_stock_items: [], total_inventory_value: 0 })
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Call the backend report endpoint and display the real inventory data.
        const dashboardData = await api.fetchDashboard()
        setStats(dashboardData)
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load dashboard data')
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <h1>Welcome, BlueWave</h1>
          <p className="muted">AI-powered Demand, Inventory & Procurement Optimizer</p>
        </div>
        <div style={{ width: 220 }}>
          <div className="card">Notifications<br /><small className="muted">2 new</small></div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <div className="col stats">
          <div className="stat card">Total Inventory<br /><strong>{stats.total_items}</strong></div>
          <div className="stat card">Low Stock Alerts<br /><strong>{stats.low_stock_items.length}</strong></div>
          <div className="stat card">Inventory Value<br /><strong>${Number(stats.total_inventory_value || 0).toLocaleString()}</strong></div>
        </div>
      </div>

      {errorMessage ? <p className="muted">{errorMessage}</p> : null}

      <div className="row" style={{ gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 2 }} className="card">
          <h3>Demand Forecast</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={forecastData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="demand" stroke="#0F4C81" /></LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }} className="card">
          <h3>Purchase Chart</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={purchaseData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="purchase" fill="#00B4D8" /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row">
        <div style={{ flex: 1 }} className="card">
          <h3>Recent Activity</h3>
          <Table columns={[{ key: 'date', title: 'Date' }, { key: 'activity', title: 'Activity' }, { key: 'user', title: 'User' }]} data={recent} />
        </div>
        <div style={{ flex: 1 }} className="card">
          <h3>Inventory Summary</h3>
          <p className="muted">Low stock items and alerts come from the backend.</p>
          <Card>
            <ul>
              {stats.low_stock_items.slice(0, 5).map((item) => (
                <li key={item.id}>{item.name} — {item.quantity} {item.unit}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
