export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'

const PHASES = [
  {
    phase: 'Phase 1 — Q1 2026',
    title: 'Foundation & Quick Wins',
    status: 'completed',
    desc: 'Establish the AI & Automation function, secure executive sponsorship, and deploy initial high-impact use cases to demonstrate value.',
    milestones: ['Team Assembled', 'AI Strategy Approved', 'First 3 Use Cases Live', 'Governance Framework'],
  },
  {
    phase: 'Phase 2 — Q2–Q3 2026',
    title: 'Scale & Integration',
    status: 'active',
    desc: 'Scale proven AI capabilities, integrate with core engineering and operations workflows, and build the ML platform infrastructure.',
    milestones: ['ML Platform v1', 'CI/CD AI Integration', 'AIOps Deployment', '10+ Use Cases'],
  },
  {
    phase: 'Phase 3 — Q4 2026 – Q1 2027',
    title: 'Advanced AI & Autonomy',
    status: 'upcoming',
    desc: 'Deploy advanced GenAI capabilities, sovereign AI infrastructure, and self-healing operational systems across the enterprise.',
    milestones: ['Sovereign AI Infra', 'Self-Healing Ops', 'GenAI Platform', '20+ Use Cases'],
  },
  {
    phase: 'Phase 4 — 2027+',
    title: 'AI-Native Organisation',
    status: 'upcoming',
    desc: 'Transform the enterprise into an AI-native technology organisation where intelligent automation is embedded in every function and process.',
    milestones: ['AI-First Culture', 'Full Automation', 'AI Centre of Excellence', 'Industry Leadership'],
  },
]

const STATUS_STYLES = {
  completed: { dot: 'bg-accent-green border-accent-green', label: 'Completed', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  active:    { dot: 'bg-brand-blue border-brand-blue shadow-[0_0_12px_rgba(59,130,246,0.6)]', label: 'In Progress', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  upcoming:  { dot: 'bg-bg-tertiary border-border-subtle', label: 'Upcoming', badge: 'bg-white/5 text-text-muted border-border-subtle' },
}

export default function RoadmapPage() {
  return (
    <>
      <Topbar title="Strategic Roadmap" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        {/* Header */}
        <div className="glass rounded-card p-6 bg-gradient-to-br from-brand-blue/5 to-transparent">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">// TRANSFORMATION ROADMAP</p>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Strategic Roadmap</h2>
          <p className="text-text-secondary text-sm max-w-2xl">
            Phased delivery plan for AI & Automation capability build-out across the group — from foundation through to AI-native transformation.
          </p>
        </div>

        {/* Progress summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Phase Active', value: '2 of 4', color: 'text-brand-blue' },
            { label: 'Milestones Done', value: '4', color: 'text-accent-green' },
            { label: 'Target Completion', value: '2027', color: 'text-text-secondary' },
          ].map(s => (
            <div key={s.label} className="glass rounded-card p-4 text-center">
              <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-border-subtle" />

          <div className="space-y-4">
            {PHASES.map((p, i) => {
              const s = STATUS_STYLES[p.status as keyof typeof STATUS_STYLES]
              return (
                <div key={i} className="relative flex gap-6">
                  {/* Dot */}
                  <div className={`relative z-10 mt-5 w-3 h-3 rounded-full border-2 shrink-0 ${s.dot}`} />

                  {/* Card */}
                  <div className={`flex-1 glass rounded-card p-5 transition-all ${p.status === 'active' ? 'border-brand-blue/30 bg-brand-blue/5' : 'hover:border-white/10'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">{p.phase}</p>
                        <h3 className="text-lg font-semibold text-text-primary">{p.title}</h3>
                      </div>
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border shrink-0 ${s.badge}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">{p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.milestones.map(m => (
                        <span key={m} className={`text-xs px-2.5 py-1 rounded-lg border ${
                          p.status === 'completed'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : p.status === 'active'
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                            : 'bg-white/5 text-text-muted border-border-subtle'
                        }`}>
                          {p.status === 'completed' ? '✓ ' : ''}{m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
