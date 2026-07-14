import { useEffect, useState } from 'react'
import { Building2, MapPin, Users, DollarSign, AlertCircle, Briefcase, CheckCircle2, TrendingUp, Cpu, Zap } from 'lucide-react'
import { fetchCompany, type CompanyProfile } from '@/types/api'
import { cn } from '@/lib/utils'

const FIT_COLOR: Record<string, string> = {
  HIGH: 'text-emerald-600 font-semibold',
  MEDIUM: 'text-amber-600 font-semibold',
  LOW: 'text-slate-400',
}

function StatusBadge({ status }: { status: string }) {
  const isClient = status.toLowerCase().includes('current client')
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
      isClient ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
    )}>
      {isClient ? <CheckCircle2 size={11} /> : <Building2 size={11} />}
      {isClient ? 'Current Client' : 'Prospect'}
    </span>
  )
}

function CompanyCard({ profile }: { profile: CompanyProfile }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">{profile.name}</h3>
        </div>
        <StatusBadge status={profile.status} />
      </div>

      <div className="space-y-1.5 text-xs text-slate-600">
        {profile.industry && (
          <div className="flex items-center gap-2">
            <Briefcase size={12} className="shrink-0 text-slate-400" />
            {profile.industry}
          </div>
        )}
        {(profile.city || profile.state) && (
          <div className="flex items-center gap-2">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            {[profile.city, profile.state].filter(Boolean).join(', ')}
          </div>
        )}
        {profile.employees && (
          <div className="flex items-center gap-2">
            <Users size={12} className="shrink-0 text-slate-400" />
            {profile.employees} employees
          </div>
        )}
        {profile.revenue && (
          <div className="flex items-center gap-2">
            <TrendingUp size={12} className="shrink-0 text-slate-400" />
            Revenue ~{profile.revenue}/yr
          </div>
        )}
        {profile.it_budget && (
          <div className="flex items-center gap-2">
            <DollarSign size={12} className="shrink-0 text-slate-400" />
            IT budget ~{profile.it_budget}/yr
          </div>
        )}
      </div>

      {profile.pain_points.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1">
            <AlertCircle size={11} /> Pain Points
          </p>
          <ul className="space-y-1">
            {profile.pain_points.slice(0, 3).map((pt, i) => (
              <li key={i} className="text-xs text-slate-600 leading-relaxed flex gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.service_fit.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Service Fit</p>
          <div className="space-y-1">
            {profile.service_fit.map((row, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-600 truncate">{row.service}</span>
                <span className={cn('text-xs shrink-0', FIT_COLOR[row.fit] ?? 'text-slate-500')}>
                  {row.fit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {profile.tech_stack.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1">
            <Cpu size={11} /> Tech Stack
          </p>
          <div className="flex flex-wrap gap-1">
            {profile.tech_stack.map((t, i) => (
              <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{t}</span>
            ))}
          </div>
        </div>
      )}

      {profile.current_initiatives.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1">
            <Zap size={11} /> Active Initiatives
          </p>
          <ul className="space-y-1">
            {profile.current_initiatives.map((init, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-1.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />
                {init}
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.current_engagement && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">Active Engagement</p>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{profile.current_engagement}</p>
        </div>
      )}
    </div>
  )
}

export function CompanyPanel({ slugs }: { slugs: string[] }) {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])

  useEffect(() => {
    if (slugs.length === 0) { setProfiles([]); return }
    Promise.all(slugs.map(s => fetchCompany(s).catch(() => null)))
      .then(results => setProfiles(results.filter(Boolean) as CompanyProfile[]))
  }, [slugs.join(',')])

  return (
    <aside className="flex w-96 shrink-0 flex-col border-l border-slate-200 bg-slate-50 overflow-y-auto">
      <div className="border-b border-slate-200 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Companies
        </span>
      </div>
      <div className="flex-1 p-3 space-y-3">
        {profiles.length === 0 ? (
          <p className="px-1 py-6 text-xs text-slate-400 text-center">
            Company profiles will appear here after a query
          </p>
        ) : (
          profiles.map(p => <CompanyCard key={p.slug} profile={p} />)
        )}
      </div>
    </aside>
  )
}
