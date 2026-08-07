import { useEffect, useState } from 'react'
import Table from '../../components/Table'
import api from '../../services/api'

export default function Forecast() {
  const [forecasts, setForecasts] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function loadForecasts() {
      try {
        const data = await api.fetchDemandForecasts()
        setForecasts(data)
      } catch (error) {
        setMessage(error.message || 'Unable to load forecasts')
      }
    }

    loadForecasts()
  }, [])

  return (
    <div className="container">
      <h2>Demand Forecast</h2>
      <p className="muted">Simple demand predictions from the backend report API.</p>
      {message ? <p className="muted">{message}</p> : null}
      <div className="card">
        <Table columns={[{ key: 'forecast_date', title: 'Date' }, { key: 'inventory_name', title: 'Item' }, { key: 'predicted_demand', title: 'Predicted Demand' }, { key: 'confidence_score', title: 'Confidence' }]} data={forecasts} />
      </div>
    </div>
  )
}
