import React from 'react'
import Table from '../../components/Table'

const data = [
  {item:'Shrimp',stock:500,unit:'kg'},
  {item:'Fish Feed',stock:1200,unit:'kg'}
]

export default function Inventory(){
  return (
    <div className="container">
      <h2>Inventory</h2>
      <div className="card">
        <Table columns={[{key:'item',title:'Item'},{key:'stock',title:'Stock'},{key:'unit',title:'Unit'}]} data={data} />
      </div>
    </div>
  )
}
