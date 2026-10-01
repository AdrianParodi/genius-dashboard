import { useEffect, useState } from 'react'
import { getCampaigns } from '../services/budgetManagerApi'

const STATUS_BADGE = {
    activada: 'badge-active',
    pausada: 'badge-paused',
    cerrada: 'badge-closed',
   borrador: 'badge-draft',
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [selectedClient, setSelectedClient] = useState('Todos los clientes')
  const [selectedStatus, setSelectedStatus] = useState('Todos los estados')

  const clients = ['Todos los clientes', ...new Set(campaigns.map(campaigns => campaigns.client).filter(Boolean))]

  const filteredCampaigns = campaigns.filter(campaign => 
  (selectedClient === 'Todos los clientes' || campaign.client === selectedClient) &&
  (selectedStatus === 'Todos los estados' || campaign.status === selectedStatus)
  );

  const getDBValue = (badgeClass) => {
    return badgeClass.replace(/^badge-/, '').toLowerCase();
  };

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
      <div className={"filtros"}>
        <label className="client-filter">
          <span>Filtrar por cliente</span>
          <select value={selectedClient} onChange={event => setSelectedClient(event.target.value)}>
            {clients.map(client => <option key={client} value={client}>{client}</option>)}
          </select>
        </label>
        <label className="client-filter">
          <span>Filtrar por estado</span>
          <select value={selectedStatus} name="status" onChange={event => setSelectedStatus(event.target.value)}>
            <option value={"Todos los estados"}>
               {"Todos los estados"}
            </option>
            {Object.entries(STATUS_BADGE).map(([displayText, badgeClass]) => 
            <option key={displayText} className={badgeClass} value={getDBValue(badgeClass)}>
               {displayText.charAt(0).toUpperCase() + displayText.slice(1)}
            </option>)}
          </select>
        </label>
      </div>

      <div className="item-list">
        {filteredCampaigns.length === 0 && <p className="state-msg">No hay campañas registradas.</p>}
        {filteredCampaigns.map(c => (
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
