import { useEffect, useState } from 'react'
import { getBudgetSummary, getCampaigns } from '../services/budgetManagerApi'
import { getLeadsSummary } from '../services/landingCrmApi'
import ColumnBasicChart from '../components/DashboardPanel'

const STATUS_BADGE = {
    activada: 'badge-active',
    pausada: 'badge-paused',
    cerrada: 'badge-closed',
   borrador: 'badge-draft',
}

export default function Dashboard() {
  const [budgetSummary, setBudgetSummary] = useState(null)
  const [leadsSummary, setLeadsSummary]   = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [selectedClient, setSelectedClient] = useState('Todos los clientes')
  const [selectedStatus, setSelectedStatus] = useState('Todos los estados')

  const clients = ['Todos los clientes', ...new Set(campaigns.map(campaigns => campaigns.client).filter(Boolean))]

  const filteredCampaigns = campaigns.filter(campaign => 
  (selectedClient === 'Todos los clientes' || campaign.client === selectedClient) 
  &&
  (selectedStatus === 'Todos los estados' || campaign.status === selectedStatus)
  );

  const getDBValue = (badgeClass) => {
    return badgeClass.replace(/^badge-/, '').toLowerCase();
  };

  useEffect(() => {
    Promise.all([getBudgetSummary(), getLeadsSummary()])
      .then(([budget, leads]) => {
        setBudgetSummary(budget)
        setLeadsSummary(leads)
      })
      .catch(setError)
      .finally(() => setLoading(false))

    getCampaigns()
      .then(setCampaigns)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="state-msg">Cargando...</p>
  if (error)   return <p className="state-msg error">Error al conectar con las APIs: {error.message}</p>

  // const totalLeads = leadsSummary.reduce((sum, l) => sum + (l.leadCount ?? 0), 0)


  return (
    <main className="page">
      <h1>Dashboard</h1>
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

      {/* TODO GD-F04: completar tarjetas de indicadores globales */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Campañas activas</div>
          <div className="kpi-value">{budgetSummary?.activeCampaigns ?? '—'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Presupuesto total</div>
          <div className="kpi-value">
            {budgetSummary?.totalBudget != null
              ? `$${budgetSummary.totalBudget.toLocaleString()}`
              : '—'}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total gastado</div>
          <div className="kpi-value">
            {budgetSummary?.totalSpent != null
              ? `$${budgetSummary.totalSpent.toLocaleString()}`
              : '—'}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total leads</div>
          <div className="kpi-value">{leadsSummary.length}</div>
        </div>
      </div>

      {/* TODO GD-F05: agregar selector de cliente para filtrar la vista */}
      <ColumnBasicChart 
        filteredCampaigns={filteredCampaigns}
        cliente={selectedClient}
      />
    </main>
  )
}
