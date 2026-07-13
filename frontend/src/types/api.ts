export interface ServiceFitRow {
  service: string
  fit: string
  rationale: string
}

export interface CompanyProfile {
  slug: string
  name: string
  industry: string
  headquarters: string
  employees: string
  status: string
  it_budget: string
  pain_points: string[]
  service_fit: ServiceFitRow[]
  current_engagement: string
}

export async function fetchCompany(slug: string): Promise<CompanyProfile> {
  const res = await fetch(`/api/v1/companies/${slug}`)
  if (!res.ok) throw new Error(`Company not found: ${slug}`)
  return res.json()
}

export interface SourceDoc {
  content: string
  domain: string
  filename: string
}

export interface QueryResponse {
  answer: string
  sources: SourceDoc[]
}

export async function queryApi(question: string): Promise<QueryResponse> {
  const res = await fetch('/api/v1/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Request failed: ${res.status}`)
  }
  return res.json()
}
