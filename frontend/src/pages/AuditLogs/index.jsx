import { useState } from 'react'

const initialLogs = [
  { id: 1, user: 'Asha Kumar', action: 'Approved reorder', entity: 'Inventory', date: '2026-08-07', outcome: 'Success' },
  { id: 2, user: 'Nilan Perera', action: 'Reviewed forecast', entity: 'Demand Forecast', date: '2026-08-07', outcome: 'Success' },
  { id: 3, user: 'System', action: 'Generated report', entity: 'Reports', date: '2026-08-06', outcome: 'Success' },
]

function AuditLogs() {
  const [query, setQuery] = useState('')

  const filteredLogs = initialLogs.filter((item) =>
    [item.user, item.action, item.entity, item.outcome].join(' ').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="container">
      <h2>Audit Logs</h2>
      <p className="muted">Review authentication, review, override, and configuration actions for the platform.</p>
      <div className="card">
        <input placeholder="Search logs" value={query} onChange={(event) => setQuery(event.target.value)} style={{ marginBottom: 12 }} />
        {filteredLogs.map((item) => (
          <div key={item.id} className="card" style={{ marginBottom: 8 }}>
            <strong>{item.action}</strong>
            <p className="muted">User: {item.user} • Entity: {item.entity} • Date: {item.date}</p>
            <p className="muted">Outcome: {item.outcome}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AuditLogs
