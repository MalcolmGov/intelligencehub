export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { db } from '@/lib/db'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Zap, GitBranch, Activity, ArrowUpRight, Brain, Cpu, Globe2 } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [totalIdeas, totalVotes, totalProjects, pilotProjects] = await Promise.all([
    db.sparkIdea.count(),
    db.sparkVote.count(),
    db.project.count(),
    db.project.count({ where: { stage: 'PILOT' } }),
  ])
  return { totalIdeas, totalVotes, totalProjects, pilotProjects }
}

async function getRecentIdeas() {
  return db.sparkIdea.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      author: { select: { name: true, opco: true } },
      _count:  { select: { votes: true } },
    },
  })
}

async function getTopProjects() {
  return db.project.findMany({
    orderBy: { health: 'desc' },
    take: 4,
  })
}

const STAGE_COLORS: Record<string, 'green' | 'blue' | 'purple' | 'amber'> = {
  PRODUCTION: 'green',
  PILOT:      'blue',
  VALIDATION: 'purple',
  PAUSED:     'amber',
}

const HEALTH_COLOR = (h: number) =>
  h >= 80 ? '#4ade80' : h >= 60 ? '#3B82F6' : h >= 40 ? '#F59E0B' : '#f87171'

export default async function DashboardPage() {
  const [stats, recentIdeas, topProjects] = await Promise.all([
    getStats(), getRecentIdeas(), getTopProjects(),
  ])

  const KPI = [
    {
      label: 'Spark Ideas',
      value: stats.totalIdeas,
      icon: Zap,
      iconColor: 'text-accent-cyan',
      cardClass: 'kpi-card-cyan',
      sub: 'Community submissions',
    },
    {
      label: 'Total Votes',
      value: stats.totalVotes,
      icon: TrendingUp,
      iconColor: 'text-brand-blue',
      cardClass: 'kpi-card-blue',
      sub: 'Across all ideas',
    },
    {
      label: 'Live Projects',
      value: stats.totalProjects,
      icon: GitBranch,
      iconColor: 'text-accent-green',
      cardClass: 'kpi-card-green',
      sub: 'In active development',
    },
    {
      label: 'In Pilot',
      value: stats.pilotProjects,
      icon: Activity,
      iconColor: 'text-accent-amber',
      cardClass: 'kpi-card-amber',
      sub: 'Pilot stage projects',
    },
  ]

  return (
    <>
      <Topbar title="Command Dashboard" />
      <main className="flex-1 p-6 space-y-6 fade-up">

        {/* Hero */}
        <div className="glass rounded-card p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(57,210,255,0.06) 0%, rgba(59,130,246,0.04) 50%, transparent 100%)', borderColor: 'rgba(57,210,255,0.12)' }}>
          {/* Decorative orb */}
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #39D2FF, transparent 70%)' }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan pulse-dot" />
              <p className="text-xs text-text-muted font-mono uppercase tracking-wider">AI & Automation Division · Live</p>
            </div>
            <h2 className="text-2xl font-semibold text-text-primary mb-1">Intelligence Command Centre</h2>
            <p className="text-text-secondary text-sm max-w-lg">
              Real-time visibility across strategy, innovation, and engineering — driving transformation across{' '}
              <span className="text-accent-cyan font-medium">pan-African</span> markets.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Brain size={12} className="text-accent-cyan" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Cpu size={12} className="text-brand-blue" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Globe2 size={12} className="text-accent-green" />
                <span>Pan-African Reach</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI.map(({ label, value, icon: Icon, iconColor, cardClass, sub }) => (
            <div
              key={label}
              className={`glass rounded-card p-4 flex items-center gap-4 border transition-transform hover:-translate-y-0.5 ${cardClass}`}
            >
              <div className={`p-2.5 rounded-xl bg-white/5 ${iconColor} shrink-0`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-text-primary tabular-nums leading-none">{value}</p>
                <p className="text-xs font-medium text-text-primary mt-0.5 truncate">{label}</p>
                <p className="text-[10px] text-text-muted truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Spark Ideas */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Spark Ideas</CardTitle>
              <Link href="/spark" className="text-xs text-brand-blue hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={11} />
              </Link>
            </CardHeader>
            <div className="space-y-1">
              {recentIdeas.length === 0 && (
                <p className="text-text-muted text-sm text-center py-6">No ideas submitted yet — be the first!</p>
              )}
              {recentIdeas.map(idea => (
                <Link
                  key={idea.id}
                  href={`/spark?idea=${idea.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group block"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand-blue transition-colors">
                      {idea.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {idea.author.name} · {idea.author.opco}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-lg">
                    <Zap size={10} className="text-accent-cyan" />
                    {idea._count.votes}
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Project health */}
          <Card>
            <CardHeader>
              <CardTitle>Project Health</CardTitle>
              <Link href="/projects" className="text-xs text-brand-blue hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={11} />
              </Link>
            </CardHeader>
            <div className="space-y-4">
              {topProjects.length === 0 && (
                <p className="text-text-muted text-sm text-center py-6">No projects tracked yet.</p>
              )}
              {topProjects.map(project => (
                <div key={project.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text-primary">{project.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={STAGE_COLORS[project.stage] ?? 'slate'}>
                        {project.stage}
                      </Badge>
                      <span className="text-xs font-mono tabular-nums" style={{ color: HEALTH_COLOR(project.health) }}>
                        {project.health}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${project.health}%`,
                        background: `linear-gradient(90deg, ${HEALTH_COLOR(project.health)}, ${HEALTH_COLOR(project.health)}88)`,
                        boxShadow: `0 0 6px ${HEALTH_COLOR(project.health)}66`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </>
  )
}
