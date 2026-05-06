export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { db } from '@/lib/db'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Zap, GitBranch, Users, Activity, ArrowUpRight } from 'lucide-react'
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
  PILOT:       'blue',
  VALIDATION:  'purple',
  PAUSED:      'amber',
}

export default async function DashboardPage() {
  const [stats, recentIdeas, topProjects] = await Promise.all([
    getStats(), getRecentIdeas(), getTopProjects(),
  ])

  const KPI = [
    { label: 'Spark Ideas',    value: stats.totalIdeas,    icon: Zap,        color: 'text-accent-cyan'   },
    { label: 'Total Votes',    value: stats.totalVotes,    icon: TrendingUp,  color: 'text-brand-blue'   },
    { label: 'Live Projects',  value: stats.totalProjects, icon: GitBranch,   color: 'text-accent-green' },
    { label: 'In Pilot',       value: stats.pilotProjects, icon: Activity,    color: 'text-accent-amber' },
  ]

  return (
    <>
      <Topbar title="Command Dashboard" />
      <main className="flex-1 p-6 space-y-6 fade-up">

        {/* Hero */}
        <div className="glass rounded-card p-6 bg-gradient-to-br from-brand-blue/5 to-transparent">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">AI & Automation Division</p>
          <h2 className="text-2xl font-semibold text-text-primary mb-1">Intelligence Command Centre</h2>
          <p className="text-text-secondary text-sm max-w-lg">
            Real-time visibility across strategy, innovation, and engineering — driving transformation across {stats.totalProjects > 0 ? 'all active' : 'pan-African'} markets.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI.map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-white/5 ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary tabular-nums">{value}</p>
                <p className="text-xs text-text-secondary">{label}</p>
              </div>
            </Card>
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
            <div className="space-y-3">
              {recentIdeas.length === 0 && (
                <p className="text-text-muted text-sm text-center py-6">No ideas submitted yet — be the first!</p>
              )}
              {recentIdeas.map(idea => (
                <div key={idea.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand-blue transition-colors">
                      {idea.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {idea.author.name} · {idea.author.opco}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-xs text-text-muted">
                    <Zap size={11} />
                    {idea._count.votes}
                  </div>
                </div>
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
            <div className="space-y-3">
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
                      <span className="text-xs font-mono text-text-secondary">{project.health}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-blue transition-all"
                      style={{ width: `${project.health}%` }}
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
