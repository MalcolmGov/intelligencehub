'use client'
export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { useState } from 'react'

const DOMAINS = ['All Domains', 'Engineering', 'Security', 'Operations', 'Digital', 'Data', 'QA', 'Infrastructure']

const CASES = [
  { icon: '💻', domain: 'Engineering', color: '#3B82F6', title: 'AI-Powered Code Review', desc: 'Automated code quality analysis, vulnerability detection, and optimisation suggestions integrated into pull request workflows.', stats: [{ val: '40%', lbl: 'faster reviews' }, { val: '60%', lbl: 'fewer bugs' }] },
  { icon: '🛡️', domain: 'Security', color: '#F43F5E', title: 'Real-Time Threat Detection', desc: 'ML-driven anomaly detection across network traffic, API calls, and user behaviour patterns to identify threats before they escalate.', stats: [{ val: '95%', lbl: 'detection rate' }, { val: '80%', lbl: 'faster response' }] },
  { icon: '⚙️', domain: 'Operations', color: '#10B981', title: 'Predictive Incident Prevention', desc: 'AIOps platform that analyses system metrics and logs to predict infrastructure failures 30+ minutes before they occur.', stats: [{ val: '70%', lbl: 'less MTTR' }, { val: '45%', lbl: 'fewer P1s' }] },
  { icon: '💬', domain: 'Digital', color: '#06B6D4', title: 'Multilingual Customer AI', desc: 'Conversational AI supporting 15+ African languages for customer support, handling account queries, disputes, and self-service operations.', stats: [{ val: '50%', lbl: 'call deflection' }, { val: '24/7', lbl: 'availability' }] },
  { icon: '🧪', domain: 'QA', color: '#3B82F6', title: 'Self-Healing Test Suites', desc: 'AI that auto-generates test cases from requirements, detects flaky tests, and predicts defect-prone code areas before release.', stats: [{ val: '3×', lbl: 'test coverage' }, { val: '35%', lbl: 'faster releases' }] },
  { icon: '📊', domain: 'Data', color: '#8B5CF6', title: 'Intelligent Data Pipeline', desc: 'Automated data quality monitoring, schema drift detection, and intelligent ETL orchestration across the data lakehouse.', stats: [{ val: '90%', lbl: 'less data errors' }, { val: '5×', lbl: 'faster ingestion' }] },
  { icon: '☁️', domain: 'Infrastructure', color: '#10B981', title: 'Smart Cloud Cost Optimiser', desc: 'ML-driven resource rightsizing, spot instance management, and workload scheduling to optimise cloud infrastructure costs.', stats: [{ val: '30%', lbl: 'cost reduction' }, { val: '99.9%', lbl: 'SLA maintained' }] },
  { icon: '🔍', domain: 'Security', color: '#F43F5E', title: 'Transaction Risk Scoring', desc: 'Real-time risk scoring for every transaction using ensemble ML models, reducing fraud losses while minimising false positives.', stats: [{ val: '97%', lbl: 'accuracy' }, { val: '<50ms', lbl: 'latency' }] },
  { icon: '🤖', domain: 'Engineering', color: '#3B82F6', title: 'AI Pair Programmer', desc: 'Context-aware code completion, refactoring suggestions, and documentation generation embedded directly in developer IDEs.', stats: [{ val: '35%', lbl: 'productivity gain' }, { val: '2×', lbl: 'PR throughput' }] },
  { icon: '📋', domain: 'Operations', color: '#10B981', title: 'Automated Runbook Generation', desc: 'AI-generated operational runbooks from incident patterns, updated automatically as systems evolve.', stats: [{ val: '80%', lbl: 'less manual work' }, { val: '15min', lbl: 'faster onboarding' }] },
  { icon: '🎯', domain: 'Digital', color: '#06B6D4', title: 'Personalisation Engine', desc: 'ML-powered product recommendations, personalised UX journeys, and dynamic content tailored to each customer segment.', stats: [{ val: '22%', lbl: 'conversion uplift' }, { val: '3×', lbl: 'engagement' }] },
  { icon: '📝', domain: 'QA', color: '#3B82F6', title: 'Requirements Intelligence', desc: 'NLP-driven extraction of test scenarios directly from requirements docs, ensuring complete coverage from day one.', stats: [{ val: '100%', lbl: 'requirements traced' }, { val: '40%', lbl: 'less missed bugs' }] },
]

export default function UseCasesPage() {
  const [active, setActive] = useState('All Domains')

  const filtered = active === 'All Domains' ? CASES : CASES.filter(c => c.domain === active)

  return (
    <>
      <Topbar title="AI Use Cases" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        {/* Header */}
        <div className="glass rounded-card p-6 bg-gradient-to-br from-purple-500/5 to-transparent">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">// USE CASE LIBRARY</p>
          <h2 className="text-2xl font-bold text-text-primary mb-2">AI Use Cases</h2>
          <p className="text-text-secondary text-sm max-w-2xl">
            Searchable catalogue of AI opportunities across all 8 transformation domains — from engineering and security to operations and digital experience.
          </p>
        </div>

        {/* Cognitive Architecture Banner */}
        <div className="glass rounded-card p-6 flex flex-col md:flex-row items-center gap-6 border border-purple-500/10">
          <div className="flex-1">
            <p className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">Intelligence Models</p>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Cognitive Architecture
            </h3>
            <p className="text-sm text-text-secondary">
              Mapping neural pathways across the service ecosystem — credit, fraud, conversational banking, operations — enabling predictive experiences and assistive decisions.
            </p>
          </div>
          <div className="shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center text-4xl">
            🧠
          </div>
        </div>

        {/* Domain filter */}
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map(d => (
            <button
              key={d}
              onClick={() => setActive(d)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                active === d
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white/5 text-text-secondary border-border-subtle hover:border-brand-blue/40 hover:text-text-primary'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(uc => (
            <div key={uc.title} className="glass rounded-card p-5 hover:border-brand-blue/20 transition-all group relative overflow-hidden">
              {/* shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">{uc.icon}</div>
                <div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded border"
                    style={{ color: uc.color, borderColor: `${uc.color}30`, background: `${uc.color}15` }}>
                    {uc.domain}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-text-primary mb-2 group-hover:text-brand-blue transition-colors">{uc.title}</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">{uc.desc}</p>
              <div className="flex gap-3">
                {uc.stats.map(s => (
                  <div key={s.lbl} className="bg-white/5 rounded-xl px-3 py-2 text-center">
                    <p className="text-sm font-bold text-text-primary">{s.val}</p>
                    <p className="text-[10px] text-text-muted">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
