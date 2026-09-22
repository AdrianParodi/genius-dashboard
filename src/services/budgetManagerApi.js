const BASE = 'http://localhost:8080'

export async function getCampaigns(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${BASE}/api/campaigns`)
  if (!res.ok) throw new Error(`Budget Manager: ${res.status}`)
  return res.json()
}

export async function getBudgetSummary() {
  const res = await fetch(`${BASE}/api/campaigns/summary`)
  if (!res.ok) throw new Error(`Budget Manager: ${res.status}`)
  return res.json()
}

export async function getCampaignBudget(id) {
  const res = await fetch(`${BASE}/api/campaigns/${id}/budget`)
  if (!res.ok) throw new Error(`Budget Manager: ${res.status}`)
  return res.json()
}
