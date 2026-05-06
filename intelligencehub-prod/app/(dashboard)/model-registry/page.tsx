'use client'
export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { useState } from 'react'

const MODELS = [
  { name: 'Fraud Neural Net',         type: 'Classification', owner: 'NM', ownerName: 'Nomsa M.',     status: 'production', version: 'v3.1', drift: 'Stable',         audit: '14 Mar 2026' },
  { name: 'Credit Score Predictor',   type: 'Regression',     owner: 'AK', ownerName: 'Ayasha K.',   status: 'production', version: 'v2.0', drift: 'Drift Detected', audit: '01 Feb 2026' },
  { name: 'Sanctions Name Matcher',   type: 'NLP',            owner: 'RP', ownerName: 'Ravi P.',     status: 'staging',    version: 'v1.2', drift: 'Stable',         audit: '20 Apr 2026' },
  { name: 'Customer Churn Predictor', type: 'Classification', owner: 'TN', ownerName: 'Thabo N.',    status: 'production', version: 'v1.5', drift: 'Stable',         audit: '28 Mar 2026' },
  { name: 'Document Classifier',      type: 'NLP',            owner: 'ZM', ownerName: 'Zanele M.',   status: 'staging',    version: 'v0.9', drift: 'Under Review',   audit: '05 May 2026' },
  { name: 'AML Transaction Monitor',  type: 'Anomaly',        owner: 'CM', ownerName: 'Chidi M.',    status: 'production', version: 'v2.3', drift: 'Stable',         audit: '10 Apr 2026' },
  { name: 'Agent Scheduling AI',      type: 'Optimization',   owner: 'PD', ownerName: 'Priya D.',    status: 'deprecated', version: 'v1.0', drift: 'Deprecated',     audit: '01 Jan 2026' },
  { name: 'Conversational NLU',       type: 'NLP',            owner: 'KO', ownerName: 'Kwame O.',    status: 'staging',    version: 'v2.1', drift: 'Stable',         audit: '02 May 2026' },
]

const TABS = ['All Models', 'Production', 'Staging', 'Deprecated']

const STATUS_COLORS: Record<string, { dot: string; text: string; bg: string }> = {
  production: { dot: '#10B981', text: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  staging:    { dot: '#3B82F6', text: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  deprecated: { dot: '#6B7280', text: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}

const TYPE_COLORS: Record<string, string> = {
  Classification: '#3B82F6',
  Regression:     '#8B5CF6',
  NLP:            '#06B6D4',
  Anomaly:        '#F59E0B',
  Optimization:   '#10B981',
}

const DRIFT_COLORS: Record<string, string> = {
  'Stable':         'text-green-400',
  'Drift Detected': 'text-amber-400',
  'Under Review':   'text-blue-400',
  'Deprecated':     'text-text-muted',
}

export default function ModelRegistryPage() {
  const [tab, setTab] = useState('All Models')

  const filtered = tab === 'All Models' ? MODELS : MODELS.filter(m => m.status === tab.toLowerCase())

  return (
    <>
      <Topbar title="Model Registry" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        {/* Header */}
        <div className="glass rounded-card p-6 bg-gradient-to-br from-amber-500/5 to-transparent">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">// MODEL REGISTRY</p>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Model Registry</h2>
          <p className="text-text-secondary text-sm max-w-2xl">
            Every AI model deployed in the division — tracked, monitored, and audited for performance, drift, and compliance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'In Production', value: MODELS.filter(m => m.status === 'production').length, color: 'text-green-400' },
            { label: 'In Staging',    value: MODELS.filter(m => m.status === 'staging').length,    color: 'text-brand-blue' },
            { label: 'Drift Alerts',  value: MODELS.filter(m => m.drift === 'Drift Detected').length, color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-card p-4 text-center">
              <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                tab === t
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white/5 text-text-secondary border-border-subtle hover:border-brand-blue/40 hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass rounded-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  {['Model Name', 'Type', 'Owner', 'Status', 'Version', 'Drift', 'Last Audit', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const sc = STATUS_COLORS[m.status]
                  const tc = TYPE_COLORS[m.type] || '#94A3B8'
                  return (
                    <tr key={i} className="border-b border-border-subtle hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">{m.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                          style={{ color: tc, background: `${tc}18`, border: `1px solid ${tc}30` }}>
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-[10px] font-bold text-brand-blue">
                            {m.owner}
                          </div>
                          <span className="text-text-secondary text-xs">{m.ownerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                          <span className="text-xs capitalize" style={{ color: sc.text }}>{m.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-secondary">{m.version}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${DRIFT_COLORS[m.drift] || 'text-text-muted'}`}>
                          {m.drift}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">{m.audit}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs px-3 py-1 rounded-lg bg-brand-blue/10 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/20 transition-colors">
                          View Card
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
