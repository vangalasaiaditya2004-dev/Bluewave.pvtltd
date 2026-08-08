import { useEffect, useState } from 'react'
import api from '../../services/api'

function Purchase() {
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await api.fetchInventory()
        setItems(data)
      } catch (error) {
        setMessage(error.message || 'Unable to load purchase recommendations')
      }
    }

    loadItems()
  }, [])

  const recommendations = items.filter((item) => Number(item.quantity) <= Number(item.reorder_level))

  return (
    <div className="container">
      <h2>Purchase Planning</h2>
      <p className="muted">Replenishment recommendations are generated from low-stock inventory alerts.</p>
      {message ? <p className="muted">{message}</p> : null}
      <div className="row">
        {recommendations.length === 0 ? (
          <div className="card">No urgent purchase recommendations right now.</div>
        ) : recommendations.map((item) => (
          <div key={item.id} className="card" style={{ flex: 1, minWidth: 220 }}>
            <h3>{item.name}</h3>
            <p className="muted">Current stock: {item.quantity} {item.unit}</p>
            <p className="muted">Reorder level: {item.reorder_level} {item.unit}</p>
            <p><strong>Suggested action:</strong> place a purchase order soon.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Purchase
