import { useEffect, useState } from 'react'
import Table from '../../components/Table'
import api from '../../services/api'

const emptyForm = {
  name: '',
  quantity: '',
  unit: 'kg',
  reorder_level: '',
  cost_per_unit: '',
  category_id: '1',
}

export default function Inventory() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadInventory() {
    try {
      setLoading(true)
      const data = await api.fetchInventory()
      setItems(data)
    } catch (error) {
      setMessage(error.message || 'Unable to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await api.createInventoryItem({
        ...form,
        quantity: Number(form.quantity),
        reorder_level: Number(form.reorder_level),
        cost_per_unit: Number(form.cost_per_unit),
        category_id: Number(form.category_id),
      })
      setForm(emptyForm)
      setMessage('Inventory item added successfully')
      await loadInventory()
    } catch (error) {
      setMessage(error.message || 'Unable to add inventory item')
    }
  }

  return (
    <div className="container">
      <h2>Inventory</h2>
      <p className="muted">Track stock values and replenishment needs from the backend.</p>
      {message ? <p className="muted">{message}</p> : null}

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Add Inventory Item</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Item name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input placeholder="Quantity" type="number" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} required />
          <input placeholder="Unit" value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} required />
          <input placeholder="Reorder level" type="number" value={form.reorder_level} onChange={(event) => setForm({ ...form, reorder_level: event.target.value })} required />
          <input placeholder="Cost per unit" type="number" value={form.cost_per_unit} onChange={(event) => setForm({ ...form, cost_per_unit: event.target.value })} required />
          <input placeholder="Category ID" type="number" value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })} required />
          <button className="btn" type="submit">Save Item</button>
        </form>
      </div>

      <div className="card">
        {loading ? <p className="muted">Loading inventory...</p> : (
          <Table columns={[{ key: 'name', title: 'Item' }, { key: 'quantity', title: 'Stock' }, { key: 'unit', title: 'Unit' }, { key: 'reorder_level', title: 'Reorder Level' }]} data={items} />
        )}
      </div>
    </div>
  )
}
