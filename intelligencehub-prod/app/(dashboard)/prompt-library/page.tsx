'use client'
export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { useState } from 'react'

const FILTERS = ['All', 'Regulatory', 'Fraud', 'Credit', 'Customer', 'Operations', 'Code']

const PROMPTS = [
  {
    category: 'Regulatory', model: 'Claude 3.5', title: 'Regulatory Filing Summariser',
    preview: 'Analyse the following regulatory document and extract: 1) Key obligations, 2) Compliance deadlines, 3) Penalties for non-compliance, 4) Required actions.',
    likes: 24, forks: 8, uses: 31, color: '#F59E0B',
  },
  {
    category: 'Fraud', model: 'Claude 3.5', title: 'Fraud Pattern Analyst',
    preview: 'Given the following transaction data, identify unusual patterns that may indicate fraudulent activity. Consider velocity, geography, device fingerprints, and historical behaviour.',
    likes: 47, forks: 19, uses: 56, color: '#F43F5E',
  },
  {
    category: 'Credit', model: 'GPT-4', title: 'Credit Memo Generator',
    preview: 'Generate a structured credit memo based on the applicant data provided. Include: risk rating, key decision factors, mitigants, and recommended credit limit.',
    likes: 33, forks: 12, uses: 41, color: '#8B5CF6',
  },
  {
    category: 'Customer', model: 'Claude 3.5', title: 'Customer Complaint Resolver',
    preview: 'Review the customer complaint below and: 1) Identify root cause, 2) Suggest resolution steps, 3) Draft an empathetic response, 4) Flag if escalation is needed.',
    likes: 61, forks: 24, uses: 89, color: '#06B6D4',
  },
  {
    category: 'Code', model: 'Claude 3.5', title: 'Code Review Assistant',
    preview: 'Review the following code change for: security vulnerabilities, performance issues, code style violations, missing tests, and suggest specific improvements.',
    likes: 78, forks: 31, uses: 102, color: '#3B82F6',
  },
  {
    category: 'Operations', model: 'Claude 3.5', title: 'Incident Root Cause Analyser',
    preview: 'Analyse the incident timeline and logs below. Identify: 1) Root cause, 2) Contributing factors, 3) Timeline of events, 4) Prevention recommendations.',
    likes: 52, forks: 17, uses: 73, color: '#10B981',
  },
  {
    category: 'Regulatory', model: 'GPT-4', title: 'POPIA Compliance Checker',
    preview: 'Review the following process/system description for POPIA compliance gaps. Flag any personal information handling that does not meet POPIA requirements.',
    likes: 39, forks: 14, uses: 48, color: '#F59E0B',
  },
  {
    category: 'Code', model: 'Claude 3.5', title: 'API Contract Generator',
    preview: 'From the following business requirements, generate a complete OpenAPI 3.0 specification including endpoints, request/response schemas, authentication, and error codes.',
    likes: 44, forks: 21, uses: 67, color: '#3B82F6',
  },
  {
    category: 'Operations', model: 'Claude 3.5', title: 'Runbook Auto-Generator',
    preview: 'Given the following system architecture description, generate a comprehensive operational runbook covering startup, shutdown, monitoring, and common failure scenarios.',
    likes: 29, forks: 9, uses: 38, color: '#10B981',
  },
]

export default function PromptLibraryPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = PROMPTS.filter(p =>
    (filter === 'All' || p.category === filter) &&
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <Topbar title="Prompt Library" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        {/* Header */}
        <div className="glass rounded-card p-6 bg-gradient-to-br from-purple-500/5 to-transparent">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">// PROMPT LIBRARY</p>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Prompt Library</h2>
          <p className="text-text-secondary text-sm max-w-2xl">
            Fintech-curated, vetted, and forkable AI prompt templates for every team — from regulatory compliance to code review.
          </p>
        </div>

        {/* Search + filters */}
        <div className="space-y-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search prompts by name or category..."
            className="w-full bg-bg-tertiary border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-blue transition-colors"
          />
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                  filter === f
                    ? 'bg-brand-blue text-white border-brand-blue'
                    : 'bg-white/5 text-text-secondary border-border-subtle hover:border-brand-blue/40 hover:text-text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div key={i} className="glass rounded-card p-5 flex flex-col gap-3 hover:border-brand-blue/20 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded border"
                    style={{ color: p.color, borderColor: `${p.color}30`, background: `${p.color}15` }}>
                    {p.category}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted bg-white/5 px-2 py-0.5 rounded border border-border-subtle">
                    {p.model}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-text-primary group-hover:text-brand-blue transition-colors">{p.title}</h3>

              <p className="text-xs text-text-muted bg-bg-tertiary rounded-xl p-3 font-mono leading-relaxed line-clamp-3 flex-1">
                {p.preview}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>👍 {p.likes}</span>
                  <span>🔀 {p.forks}</span>
                  <span>⬇️ {p.uses}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1 rounded-lg bg-white/5 text-text-secondary border border-border-subtle hover:text-text-primary hover:bg-white/10 transition-colors">
                    View
                  </button>
                  <button className="text-xs px-3 py-1 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/20 transition-colors">
                    Fork
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
