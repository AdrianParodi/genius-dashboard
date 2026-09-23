import { useEffect, useState } from 'react'
import { getLandingLeads, getLandings } from '../services/landingCrmApi'

const STATUS_BADGE = {
  activa:   'badge-active',
  inactiva: 'badge-closed',
  borrador: 'badge-draft',
}

export default function Landings() {
  const [landings, setLandings] = useState([])
  const [leads, setLeads] = useState({})
  const [selectedClient, setSelectedClient] = useState('Todos los clientes')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {

    const loadData = async () => {
    try {
      // 1. Obtener landings
      const response = await getLandings()
      
      // Obtener los leads en paralelo y dejarlos indexados por landing.
      const leadEntries = await Promise.all(response.map(async landing => {
        const responseLeads = await getLandingLeads(landing.id)
        return [landing.id, Array.isArray(responseLeads) ? responseLeads : []]
      }))
      const leadsMap = Object.fromEntries(leadEntries)
      
      setLandings(response)
      setLeads(leadsMap)
      setLoading(false)
    } catch (loadError) {
      setError(loadError)
      setLoading(false)
    }}

    loadData()

  }, [])

  if (loading) return <p className="state-msg">Cargando landings...</p>
  if (error)   return <p className="state-msg error">Error: {error.message}</p>

  const clients = ['Todos los clientes', ...new Set(landings.map(landing => landing.client).filter(Boolean))]
  const filteredLandings = selectedClient === 'Todos los clientes'
    ? landings
    : landings.filter(landing => landing.client === selectedClient)

  return (
    <main className="page">
      <div className="page-toolbar">
        <h1>Landings</h1>
        <label className="client-filter">
          <span>Filtrar por cliente</span>
          <select value={selectedClient} onChange={event => setSelectedClient(event.target.value)}>
            {clients.map(client => <option key={client} value={client}>{client}</option>)}
          </select>
        </label>
      </div>

      <div className="landing-list">
        {filteredLandings.length === 0 && <p className="state-msg">No hay landings para el cliente seleccionado.</p>}
        {filteredLandings.map(l => (
          <div key={l.id} className="item-card">
            <div>
              <div className="item-name">{l.name ?? l.title}</div>
              <div className="item-meta">{l.client} · Template: {l.template}</div>
            </div>
            <div className="landing-stats">
              <span className={`badge ${STATUS_BADGE[l.status] ?? 'badge-draft'}`}>
                {l.status}
              </span>
              <div className="lead-count"><strong>{leads[l.id]?.length ?? 0}</strong><span> leads</span></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
