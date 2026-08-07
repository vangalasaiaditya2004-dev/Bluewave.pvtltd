import { useState } from 'react'

const initialUsers = [
  { id: 1, name: 'Asha Kumar', email: 'asha@bluewave.com', role: 'Procurement Manager', status: 'Active' },
  { id: 2, name: 'Nilan Perera', email: 'nilan@bluewave.com', role: 'Inventory Planner', status: 'Active' },
]

export default function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [form, setForm] = useState({ name: '', email: '', role: 'Warehouse User' })

  function handleSubmit(event) {
    event.preventDefault()
    setUsers((current) => [
      ...current,
      { id: Date.now(), name: form.name, email: form.email, role: form.role, status: 'Active' },
    ])
    setForm({ name: '', email: '', role: 'Warehouse User' })
  }

  return (
    <div className="container">
      <h2>User and Role Management</h2>
      <p className="muted">Manage the roles and access for each team member.</p>
      <div className="row">
        <div className="card" style={{ flex: 1.2, marginBottom: 12 }}>
          <h3>Team Members</h3>
          {users.map((user) => (
            <div key={user.id} className="card" style={{ marginBottom: 8 }}>
              <strong>{user.name}</strong>
              <p className="muted">{user.email}</p>
              <p className="muted">Role: {user.role} • Status: {user.status}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ flex: 1 }}>
          <h3>Add User</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
            <input placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option>Procurement Manager</option>
              <option>Inventory Planner</option>
              <option>Warehouse User</option>
              <option>Supplier</option>
              <option>Finance Reviewer</option>
            </select>
            <button className="btn" type="submit">Add User</button>
          </form>
        </div>
      </div>
    </div>
  )
}
