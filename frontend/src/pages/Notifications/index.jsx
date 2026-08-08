const notifications = [
  { id: 1, title: 'Low stock alert', message: 'Shrimp feed is below reorder level.', time: '10 mins ago', severity: 'High' },
  { id: 2, title: 'Supplier update', message: 'Supplier ABC confirmed delivery timing.', time: '1 hour ago', severity: 'Medium' },
  { id: 3, title: 'Forecast review', message: 'Demand forecast needs planner review.', time: 'Today', severity: 'Low' },
]

function Notifications() {
  const unreadCount = notifications.length

  return (
    <div className="container">
      <h2>Notifications</h2>
      <p className="muted">Assignments, approvals, alerts, and system events for the team.</p>
      <div className="card" style={{ marginBottom: 12 }}>
        <strong>{unreadCount} unread notifications</strong>
      </div>
      <div className="row">
        {notifications.map((item) => (
          <div key={item.id} className="card" style={{ flex: 1, minWidth: 220 }}>
            <h3>{item.title}</h3>
            <p className="muted">{item.message}</p>
            <small className="muted">{item.time} • {item.severity}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
