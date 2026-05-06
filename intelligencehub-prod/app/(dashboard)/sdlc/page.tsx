export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'

const PHASES = [
  { num: 1, name: 'Plan & Requirements', traditional: 'Define objectives, gather requirements, prioritise backlog.',    ai: 'Summarise source material; extract requirements from docs & emails; identify gaps; prioritise with data insights.', color: '#3B82F6', tools: ['Copilot', 'Azure AI'] },
  { num: 2, name: 'Design',              traditional: 'Solution architecture, data models, API specs, UI/UX.',          ai: 'Generate architecture options; draft data models, API contracts & wireframes; flag pattern deviations.',            color: '#60A5FA', tools: ['GitHub Copilot', 'Figma AI'] },
  { num: 3, name: 'Development',         traditional: 'Write code, integrate components, follow standards, unit test.',  ai: 'Inline completion; generate functions, classes & APIs; refactor; explain code; convert requirements to code.',     color: '#2563EB', tools: ['GitHub Copilot', 'Claude'] },
  { num: 4, name: 'Testing',             traditional: 'Test functionality, performance, security, usability.',           ai: 'Generate test cases from stories; create test data & mocks; draft automation; summarise results.',               color: '#3B82F6', tools: ['Copilot', 'Azure DevOps AI'] },
  { num: 5, name: 'Deployment',          traditional: 'Release to staging / production, manage configs, migrations.',   ai: 'Generate deploy scripts; validate IaC; predict deployment risk; auto-draft release notes & rollback plans.',     color: '#60A5FA', tools: ['Azure Pipelines', 'Copilot'] },
  { num: 6, name: 'Operations',          traditional: 'Monitor systems, logs, performance, incidents, alerts.',          ai: 'Anomaly detection & alert correlation; root-cause hypotheses; log summarisation; auto-generate runbooks.',        color: '#2563EB', tools: ['AIOps', 'Azure Monitor AI'] },
  { num: 7, name: 'Maintenance',         traditional: 'Fix defects, improve features, refactor, continuously evolve.',  ai: 'Synthesise feedback themes; suggest features & refactors; impact analysis on proposed changes.',                  color: '#3B82F6', tools: ['Copilot', 'Claude'] },
]

const OUTCOMES = [
  { label: '2–3×',      sub: 'Faster Delivery',       color: 'text-brand-blue'  },
  { label: '20–40%',    sub: 'Lower Cost',             color: 'text-accent-cyan' },
  { label: '↓ Defects', sub: 'Higher Quality',         color: 'text-green-400'   },
  { label: '↑ DevEx',   sub: 'Developer Satisfaction', color: 'text-purple-400'  },
  { label: '↓ TTM',     sub: 'Faster Innovation',      color: 'text-amber-400'   },
  { label: '↑ Insight', sub: 'Better Decisions',       color: 'text-brand-blue'  },
]

const GOV_PILLARS = [
  { icon: '🔐', label: 'Zero Trust',        desc: 'Identity-first security across every AI touchpoint and pipeline.' },
  { icon: '📋', label: 'Compliance',         desc: 'POPIA, GDPR, and financial services regulations built into the workflow.' },
  { icon: '🧪', label: 'Model Governance',   desc: 'Every AI model tracked, audited, and monitored for drift and bias.' },
  { icon: '📊', label: 'Audit Trails',       desc: 'Full lineage from prompt to output — every AI decision is explainable.' },
]

const FOUNDRY_CAPABILITIES = [
  { icon: '🤖', label: 'Azure OpenAI Service',   desc: 'GPT-4o and o1 models for code generation, documentation, and analysis.' },
  { icon: '💻', label: 'GitHub Copilot Enterprise', desc: 'AI pair programmer embedded in every developer IDE across the team.' },
  { icon: '🔍', label: 'Azure AI Search',        desc: 'Semantic search over codebase, docs, runbooks, and knowledge base.' },
  { icon: '⚡', label: 'Azure AI Foundry',       desc: 'Unified platform for building, deploying, and monitoring AI applications.' },
]

export default function SdlcPage() {
  return (
    <>
      <Topbar title="SDLC 2.0" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        {/* Hero */}
        <div className="glass rounded-card p-6 bg-gradient-to-br from-brand-blue/5 to-transparent">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">// SDLC 2.0</p>
          <h2 className="text-2xl font-bold text-text-primary mb-2">AI in Every Phase</h2>
          <p className="text-text-secondary text-sm max-w-2xl">
            Embedding AI (via Microsoft Azure AI Foundry) across the seven phases of how we build software —
            accelerating delivery, improving quality, reducing cost, and strengthening security & governance.
          </p>
        </div>

        {/* Outcomes */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {OUTCOMES.map(o => (
            <div key={o.label} className="glass rounded-card text-center py-4 px-2">
              <p className={`text-xl font-bold mb-1 ${o.color}`}>{o.label}</p>
              <p className="text-[11px] text-text-muted">{o.sub}</p>
            </div>
          ))}
        </div>

        {/* Microsoft AI Foundry strip */}
        <div className="glass rounded-card p-5 border border-brand-blue/10 bg-gradient-to-r from-brand-blue/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-widest">■ Microsoft Azure AI Foundry</span>
            <div className="flex-1 h-px bg-gradient-to-r from-brand-blue/30 to-transparent" />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {FOUNDRY_CAPABILITIES.map(cap => (
              <div key={cap.label} className="flex items-start gap-3">
                <span className="text-xl shrink-0">{cap.icon}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary mb-0.5">{cap.label}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phases */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">■ Seven Phases</span>
            <div className="flex-1 h-px bg-gradient-to-r from-border-subtle to-transparent" />
          </div>
          <div className="space-y-3">
            {PHASES.map(phase => (
              <div key={phase.num} className="glass rounded-card p-5 hover:border-brand-blue/20 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 text-white"
                    style={{ background: phase.color }}>
                    {phase.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-text-primary group-hover:text-brand-blue transition-colors">{phase.name}</h3>
                      <div className="flex gap-1">
                        {phase.tools.map(t => (
                          <span key={t} className="text-[9px] font-mono text-brand-blue/70 bg-brand-blue/5 border border-brand-blue/15 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Traditional</p>
                        <p className="text-sm text-text-secondary">{phase.traditional}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-mono text-brand-blue uppercase tracking-wider mb-1">AI-Augmented</p>
                        <p className="text-sm text-text-secondary">{phase.ai}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance & Compliance */}
        <div className="glass rounded-card p-5 border border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">■ Governance & Compliance</span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent" />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {GOV_PILLARS.map(pillar => (
              <div key={pillar.label} className="flex items-start gap-3">
                <span className="text-xl shrink-0">{pillar.icon}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary mb-0.5">{pillar.label}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </>
  )
}
