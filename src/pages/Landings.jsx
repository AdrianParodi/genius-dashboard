import { useEffect, useState } from 'react'
import { getLandingLeads, getLandings } from '../services/landingCrmApi'

const STATUS_BADGE = {
  activa:   'badge-active',
  inactiva: 'badge-closed',
  borrador: 'badge-draft',
}

export default function Landings() {
  const [landings, setLandings] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {

    const loadData = async () => {
    try {
      // 1. Obtener landings
      const response = await getLandings()
      
      // 2. Preparar el objeto indexado de leads para búsquedas rápidas
      const leadsMap = {}
      
      // 3. Iterar sobre las landings y obtener los leads en paralelo
      for (const landing of response) {
    
        const responseLeads = await getLandingLeads(landing.id)
        leadsMap[landing.id] = responseLeads 
       
      }
      
      setLandings(response)
      setLeads(leadsMap)
      setLoading(false)
    } catch (error) {
      setError(err)
      setLoading(false)
    }}

    loadData()

  }, [])

  if (loading) return <p className="state-msg">Cargando landings...</p>
  if (error)   return <p className="state-msg error">Error: {error.message}</p>

  return (
    <main className="page">
      <h1>Landings</h1>

      {/* TODO GD-F03: agregar columna de conteo de leads por landing */}
      {/* TODO GD-F05: selector de cliente */}

      <div className="item-list">
        {landings.length === 0 && <p className="state-msg">No hay landings registradas.</p>}
        {landings.map(l => (
          <div key={l.id} className="item-card">
            <div>
              <div className="item-name">{l.name ?? l.title}</div>
              <div className="item-meta">{l.client} · Template: {l.template}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${STATUS_BADGE[l.status] ?? 'badge-draft'}`}>
                {l.status}
              </span>
              <p>
                {leads[l.id].length}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
