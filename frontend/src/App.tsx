import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Search, Loader2, FileText, Building2, BookOpen, Briefcase, Clock, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { queryApi, type QueryResponse, type SourceDoc } from '@/types/api'
import { useQueryHistory, type HistoryItem } from '@/hooks/useQueryHistory'
import { CompanyPanel } from '@/components/CompanyPanel'

const DOMAIN_META: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  'company-profile': { label: 'Company', color: 'bg-blue-100 text-blue-800', Icon: Building2 },
  'industry-content': { label: 'Industry', color: 'bg-emerald-100 text-emerald-800', Icon: BookOpen },
  'firm-proposal': { label: 'Proposal', color: 'bg-violet-100 text-violet-800', Icon: Briefcase },
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')      // headings
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // bold / italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '')  // inline code / code blocks
    .replace(/^[-*+]\s+/gm, '')         // unordered list markers
    .replace(/^\d+\.\s+/gm, '')         // ordered list markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → label only
    .replace(/\n{2,}/g, '\n')           // collapse blank lines
    .trim()
}

const EXAMPLE_QUESTIONS = [
  'How much does Apex Manufacturing spend on IT annually?',
  'Have we worked on anything similar to what Apex Manufacturing needs?',
  'Cascade Health is struggling with FHIR compliance — what can we offer?',
  'What service fits a company that is rapidly growing its dev team?',
]

function DomainBadge({ domain }: { domain: string }) {
  const meta = DOMAIN_META[domain] ?? { label: domain, color: 'bg-slate-100 text-slate-700', Icon: FileText }
  const { label, color, Icon } = meta
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', color)}>
      <Icon size={11} />
      {label}
    </span>
  )
}

function SourceCard({ source }: { source: SourceDoc }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-xs font-mono text-slate-500">{source.filename}</span>
        <DomainBadge domain={source.domain} />
      </div>
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">{stripMarkdown(source.content)}</p>
    </div>
  )
}

function AnswerPanel({ response }: { response: QueryResponse }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Answer</h2>
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h3 className="text-base font-semibold text-slate-900 mt-4 mb-1">{children}</h3>,
            h2: ({ children }) => <h4 className="text-sm font-semibold text-slate-800 mt-3 mb-1">{children}</h4>,
            h3: ({ children }) => <h5 className="text-sm font-medium text-slate-700 mt-2 mb-1">{children}</h5>,
            p: ({ children }) => <p className="text-sm text-slate-800 leading-relaxed mb-3">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 text-sm text-slate-800 mb-3 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 text-sm text-slate-800 mb-3 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
          }}
        >
          {response.answer}
        </ReactMarkdown>
      </div>
      {response.sources.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Sources ({response.sources.length})
          </h2>
          <div className="flex flex-col gap-3">
            {response.sources.map((src, i) => (
              <SourceCard key={i} source={src} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function HistorySidebar({
  history,
  activeId,
  onSelect,
  onRemove,
  onClear,
}: {
  history: HistoryItem[]
  activeId: string | null
  onSelect: (item: HistoryItem) => void
  onRemove: (id: string) => void
  onClear: () => void
}) {
  return (
    <aside className="flex w-96 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Clock size={12} />
          History
        </span>
        {history.length > 0 && (
          <button
            onClick={onClear}
            title="Clear history"
            className="text-slate-400 hover:text-red-500 transition"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <p className="px-4 py-6 text-xs text-slate-400 text-center">No history yet</p>
        ) : (
          history.map(item => (
            <div
              key={item.id}
              className={cn(
                'group flex items-start border-b border-slate-100 hover:bg-slate-50 transition',
                activeId === item.id && 'bg-slate-100'
              )}
            >
              <button
                onClick={() => onSelect(item)}
                className="flex-1 px-4 py-3 text-left"
              >
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">{item.question}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
              <button
                onClick={() => onRemove(item.id)}
                title="Remove"
                className="shrink-0 px-2 py-3 text-transparent group-hover:text-slate-400 hover:!text-red-500 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

export default function App() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [companySlugs, setCompanySlugs] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { history, addItem, removeItem, clearHistory } = useQueryHistory()

  async function handleSubmit(q?: string) {
    const query = (q ?? question).trim()
    if (!query || loading) return
    if (q) setQuestion(q)
    setLoading(true)
    setError(null)
    setResponse(null)
    setActiveId(null)
    try {
      const data = await queryApi(query)
      setResponse(data)
      const item = addItem(query, data)
      setActiveId(item.id)
      const slugs = [...new Set(
        data.sources
          .filter(s => s.domain === 'company-profile')
          .map(s => s.filename.replace(/\.md$/, ''))
      )]
      setCompanySlugs(slugs)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleSelectHistory(item: HistoryItem) {
    setQuestion(item.question)
    setResponse(item.response)
    setError(null)
    setActiveId(item.id)
    const slugs = [...new Set(
      item.response.sources
        .filter(s => s.domain === 'company-profile')
        .map(s => s.filename.replace(/\.md$/, ''))
    )]
    setCompanySlugs(slugs)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <Search size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-none">IntelRag</h1>
            <p className="text-xs text-slate-500 mt-0.5">Consulting Intelligence Platform</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <HistorySidebar
          history={history}
          activeId={activeId}
          onSelect={handleSelectHistory}
          onRemove={removeItem}
          onClear={clearHistory}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-700">Ask the Intelligence Platform</h2>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about our prospects, past engagements, or industry trends..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none transition"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ctrl+Enter to submit</span>
              <button
                onClick={() => handleSubmit()}
                disabled={!question.trim() || loading}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                {loading ? 'Thinking…' : 'Ask'}
              </button>
            </div>
          </div>

          {!response && !loading && !error && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Try an example</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {EXAMPLE_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSubmit(q)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">
                Querying <span className="font-mono text-slate-600">qwen2.5:32b</span>…
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {response && <AnswerPanel response={response} />}
        </main>

        <CompanyPanel slugs={companySlugs} />
      </div>
    </div>
  )
}
