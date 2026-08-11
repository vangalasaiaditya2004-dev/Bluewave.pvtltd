import { useEffect, useState } from 'react'
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

function Dashboard() {
  const [stats, setStats] = useState({ total_items: 0, low_stock_items: [], total_inventory_value: 0 })
  const [errorMessage, setErrorMessage] = useState('')

  // AI Insights State
  const [aiInsights, setAiInsights] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await api.fetchDashboard()
        setStats(dashboardData)
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load dashboard data')
      }
    }

    loadDashboard()
  }, [])

  const handleGenerateAI = async () => {
    setAiLoading(true)
    setAiError('')
    try {
      const data = await api.fetchAIInsights()
      setAiInsights(data)
    } catch (err) {
      setAiError(err.message || 'Failed to fetch AI insights')
    } finally {
      setAiLoading(false)
    }
  }

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return '#EF4444'
      case 'medium':
        return '#F59E0B'
      case 'low':
      default:
        return '#10B981'
    }
  }

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

      {errorMessage ? <p className="muted" style={{ marginBottom: 16 }}>{errorMessage}</p> : null}

      {/* AI Insights Section */}
      <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              🤖 Real-Time AI Insights
              {aiInsights?.riskLevel && (
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  color: '#fff',
                  backgroundColor: getRiskBadgeColor(aiInsights.riskLevel),
                  fontWeight: 600,
                  textTransform: 'uppercase'
                }}>
                  {aiInsights.riskLevel} Risk
                </span>
              )}
            </h3>
            <p className="muted" style={{ fontSize: '0.9rem', marginTop: 4 }}>
              Generates demand trends, stock risks, and purchasing advice from live SQLite database records.
            </p>
          </div>
          <button 
            className="btn" 
            onClick={handleGenerateAI}
            disabled={aiLoading}
            style={{ opacity: aiLoading ? 0.7 : 1 }}
          >
            {aiLoading ? 'Generating AI Insights...' : 'Generate AI Insights'}
          </button>
        </div>

        {aiError && (
          <p style={{ color: '#EF4444', fontSize: '0.9rem', margin: '8px 0' }}>
            ⚠️ {aiError}
          </p>
        )}

        {aiLoading && (
          <p className="muted" style={{ fontSize: '0.95rem', padding: '12px 0' }}>
            ⏳ Analyzing live inventory and demand forecasts with AI...
          </p>
        )}

        {aiInsights && !aiLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 14 }}>
            <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--primary)' }}>📈 Demand Insight</h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{aiInsights.demandInsight}</p>
            </div>
            <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--primary)' }}>📦 Inventory Risk</h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{aiInsights.inventoryInsight}</p>
            </div>
            <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--primary)' }}>🛒 Procurement Recommendation</h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{aiInsights.procurementRecommendation}</p>
            </div>
            {aiInsights.summary && (
              <div style={{ gridColumn: '1 / -1', background: 'rgba(15,76,129,0.04)', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
                  <strong>Summary:</strong> {aiInsights.summary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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

export default Dashboard
