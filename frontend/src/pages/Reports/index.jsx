import { useEffect, useState } from 'react'
import Table from '../../components/Table'
import api from '../../services/api'

function Reports() {
  const [stats, setStats] = useState({ total_items: 0, total_inventory_value: 0, low_stock_items: [] })
  const [financialReports, setFinancialReports] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadReports() {
      try {
        const dashboardData = await api.fetchDashboard()
        const reports = await api.fetchFinancialReports()
        setStats(dashboardData)
        setFinancialReports(reports)
      } catch (error) {
        setMessage(error.message || 'Unable to load reports')
      }
    }

    loadReports()
  }, [])

  return (
    <div className="container">
      <h2>Reports</h2>
      <p className="muted">Inventory and financial summaries are displayed from the backend.</p>
      {message ? <p className="muted">{message}</p> : null}
      <div className="row" style={{ marginBottom: 16 }}>
        <div className="card" style={{ flex: 1 }}>
          <h3>Total Inventory</h3>
          <strong>{stats.total_items}</strong>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Low Stock Alerts</h3>
          <strong>{stats.low_stock_items.length}</strong>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Inventory Value</h3>
          <strong>${Number(stats.total_inventory_value || 0).toLocaleString()}</strong>
        </div>
      </div>
      <div className="card">
        <h3>Financial Reports</h3>
        <Table columns={[{ key: 'title', title: 'Title' }, { key: 'report_date', title: 'Date' }, { key: 'inventory_value', title: 'Inventory Value' }, { key: 'total_procurement_cost', title: 'Procurement Cost' }]} data={financialReports} />
      </div>
    </div>
  )
}

export default Reports
