import { useEffect, useState } from 'react'
import { getCampaigns } from '../services/budgetManagerApi'

const STATUS_BADGE = {
  activa:   'badge-active',
  pausada:  'badge-paused',
  cerrada:  'badge-closed',
  borrador: 'badge-draft',
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    getCampaigns()
      .then(setCampaigns)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="state-msg">Cargando campañas...</p>
  if (error)   return <p className="state-msg error">Error: {error.message}</p>

  return (
    <main className="page">
      <h1>Campañas</h1>

      {/* TODO GD-F02: agregar filtro por estado y por cliente */}
      {/* TODO GD-F05: selector de cliente */}

      <div className="item-list">
        {campaigns.length === 0 && <p className="state-msg">No hay campañas registradas.</p>}
        {campaigns.map(c => (
          <div key={c.id} className="item-card">
            <div>
              <div className="item-name">{c.name}</div>
              <div className="item-meta">{c.client} · {c.type}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${STATUS_BADGE[c.status] ?? 'badge-draft'}`}>
                {c.status}
              </span>
              <div className="item-meta" style={{ marginTop: 6 }}>
                ${(c.budget ?? 0).toLocaleString()} presupuesto
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
