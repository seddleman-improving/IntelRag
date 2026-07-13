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
