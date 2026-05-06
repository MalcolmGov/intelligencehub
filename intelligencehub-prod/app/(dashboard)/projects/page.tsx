export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'

const STAGE_BADGE: Record<string, 'green' | 'blue' | 'purple' | 'amber'> = {
  PRODUCTION: 'green', PILOT: 'blue', VALIDATION: 'purple', PAUSED: 'amber',
}

export default async function ProjectsPage() {
  const projects = await db.project.findMany({ orderBy: { health: 'desc' } })

  return (
    <>
      <Topbar title="AI Projects" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        <div className="glass rounded-card p-5">
          <h2 className="text-lg font-semibold mb-1">Initiative Tracker</h2>
          <p className="text-text-secondary text-sm">Tracking AI & automation initiatives through pilot, validation, and production.</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-sm">No projects tracked yet. Add projects via the admin panel or database seed.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map(p => (
              <Card key={p.id} className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text-primary text-sm">{p.name}</p>
                    {p.opco && <p className="text-xs text-text-muted mt-0.5">{p.opco}</p>}
                  </div>
                  <Badge variant={STAGE_BADGE[p.stage] ?? 'slate'}>{p.stage}</Badge>
                </div>
                <p className="text-sm text-text-secondary line-clamp-2">{p.description}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Health</span>
                    <span className="font-mono text-text-secondary">{p.health}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-brand-blue" style={{ width: `${p.health}%` }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
