
import './styles.css'

function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  )
}

export default Card
