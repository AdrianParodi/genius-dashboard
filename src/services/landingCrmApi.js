const BASE = 'http://localhost:3000'

export async function getLandings(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${BASE}/api/landings`)
  console.log(res)
  if (!res.ok) throw new Error(`Landing CRM: ${res.status}`)
  return res.json()
}

export async function getLeadsSummary() {
  const res = await fetch(`${BASE}/api/landings/summary`)
  if (!res.ok) throw new Error(`Landing CRM: ${res.status}`)
  return res.json()
}

export async function getLandingLeads(id) {
  const res = await fetch(`${BASE}/api/landings/${id}/leads`);

  if (res.ok) {
    return res.json()
  }

  if(res.status === 404) return undefined

  throw new Error(`Landing CRM: ${res.status}`)
  
}
