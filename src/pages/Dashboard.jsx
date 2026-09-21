import { useEffect, useState } from 'react'
import { getBudgetSummary } from '../services/budgetManagerApi'
import { getLeadsSummary } from '../services/landingCrmApi'

export default function Dashboard() {
  const [budgetSummary, setBudgetSummary] = useState(null)
  const [leadsSummary, setLeadsSummary]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([getBudgetSummary(), getLeadsSummary()])
      .then(([budgetResult, leadsResult]) => {
        if (budgetResult.status === 'fulfilled') {
          setBudgetSummary(budgetResult.value)
        }
        if (leadsResult.status === 'fulfilled') {
          setLeadsSummary(leadsResult.value)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="state-msg">Cargando...</p>

  const totalLeads = leadsSummary.reduce((sum, l) => sum + (l.leadCount ?? 0), 0)

  return (
    <main className="page">
      <h1>Dashboard</h1>

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
          <div className="kpi-value">{totalLeads}</div>
        </div>
      </div>

      {/* TODO GD-F05: agregar selector de cliente para filtrar la vista */}
    </main>
  )
}
