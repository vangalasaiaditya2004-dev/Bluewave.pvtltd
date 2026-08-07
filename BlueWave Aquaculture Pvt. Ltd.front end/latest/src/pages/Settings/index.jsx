import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({ alerts: true, autoApprove: false, emailDigest: true })

  return (
    <div className="container">
      <h2>Settings</h2>
      <p className="muted">Configure preference-based workflow rules and alerts.</p>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <label>
          <input type="checkbox" checked={settings.alerts} onChange={() => setSettings({ ...settings, alerts: !settings.alerts })} />
          {' '}Enable low-stock alerts
        </label>
        <label>
          <input type="checkbox" checked={settings.autoApprove} onChange={() => setSettings({ ...settings, autoApprove: !settings.autoApprove })} />
          {' '}Allow auto-approval for low-risk purchases
        </label>
        <label>
          <input type="checkbox" checked={settings.emailDigest} onChange={() => setSettings({ ...settings, emailDigest: !settings.emailDigest })} />
          {' '}Receive weekly email digest
        </label>
      </div>
    </div>
  )
}
