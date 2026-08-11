import { useState } from 'react'

const initialApprovals = [
  { id: 1, title: 'Reorder recommendation - Shrimp Feed', owner: 'Inventory Planner', priority: 'High', status: 'Pending' },
  { id: 2, title: 'Transfer request - Ice to Hatchery', owner: 'Warehouse User', priority: 'Medium', status: 'Pending' },
]

function Approvals() {
  const [approvals, setApprovals] = useState(initialApprovals)
  const [reason, setReason] = useState('')

  function handleDecision(id, decision) {
    setApprovals((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: decision === 'approve' ? 'Approved' : 'Rejected', decisionReason: reason || 'No reason provided' }
          : item
      )
    )
    setReason('')
  }

  return (
    <div className="container">
      <h2>Planner Approvals</h2>
      <p className="muted">Review AI recommendations, approve or reject them, and record the reason.</p>
      <div className="row">
        <div className="card" style={{ flex: 1.2 }}>
          <h3>Pending Review</h3>
          {approvals.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: 8 }}>
              <strong>{item.title}</strong>
              <p className="muted">Owner: {item.owner} • Priority: {item.priority}</p>
              <p className="muted">Status: {item.status}</p>
              {item.decisionReason ? <p className="muted">Reason: {item.decisionReason}</p> : null}
            </div>
          ))}
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Decision</h3>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Enter override or approval reason"
            style={{ width: '100%', minHeight: 100, marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="button" disabled={!approvals.length} onClick={() => approvals[0] && handleDecision(approvals[0].id, 'approve')}>Approve</button>
            <button className="btn" type="button" disabled={!approvals.length} onClick={() => approvals[0] && handleDecision(approvals[0].id, 'reject')} style={{ background: '#b53f3f' }}>Reject</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Approvals
