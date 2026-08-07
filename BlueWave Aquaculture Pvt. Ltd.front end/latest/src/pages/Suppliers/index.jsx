import { useEffect, useState } from 'react'
import Table from '../../components/Table'
import api from '../../services/api'

const emptyForm = {
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  address: '',
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')

  async function loadSuppliers() {
    try {
      const data = await api.fetchSuppliers()
      setSuppliers(data)
    } catch (error) {
      setMessage(error.message || 'Unable to load suppliers')
    }
  }

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await api.createSupplier(form)
      setForm(emptyForm)
      setMessage('Supplier added successfully')
      await loadSuppliers()
    } catch (error) {
      setMessage(error.message || 'Unable to add supplier')
    }
  }

  return (
    <div className="container">
      <h2>Suppliers</h2>
      <p className="muted">Manage supplier contact details and procurement relationships.</p>
      {message ? <p className="muted">{message}</p> : null}

      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Add Supplier</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
          <input placeholder="Supplier name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <input placeholder="Contact person" value={form.contact_person} onChange={(event) => setForm({ ...form, contact_person: event.target.value })} />
          <input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input placeholder="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
          <button className="btn" type="submit">Save Supplier</button>
        </form>
      </div>

      <div className="card">
        <Table columns={[{ key: 'name', title: 'Supplier' }, { key: 'contact_person', title: 'Contact' }, { key: 'email', title: 'Email' }, { key: 'phone', title: 'Phone' }]} data={suppliers} />
      </div>
    </div>
  )
}
