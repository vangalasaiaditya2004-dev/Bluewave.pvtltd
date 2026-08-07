import React from 'react'
import './styles.css'

export default function Table({columns,data}){
  return (
    <table className="table">
      <thead>
        <tr>{columns.map(c=> <th key={c.key}>{c.title}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row,ri)=> (
          <tr key={ri}>{columns.map(c=> <td key={c.key}>{row[c.key]}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}
