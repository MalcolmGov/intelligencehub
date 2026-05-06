export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { db } from '@/lib/db'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ExternalLink } from 'lucide-react'

export default async function GovernancePage() {
  const docs = await db.document.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <>
      <Topbar title="Governance & Documents" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        <div className="glass rounded-card p-5">
          <h2 className="text-lg font-semibold mb-1">AI Governance Framework</h2>
          <p className="text-text-secondary text-sm">
            Policies, standards, and controls governing AI usage across the group.
          </p>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-20 text-text-muted text-sm">
            No documents uploaded yet. Seed the database or upload via the admin panel.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {docs.map(doc => (
              <Card key={doc.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-brand-blue shrink-0" />
                    <CardTitle className="text-sm">{doc.title}</CardTitle>
                  </div>
                  {doc.url && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="text-text-muted hover:text-brand-blue transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </CardHeader>
                {doc.tldr && <p className="text-sm text-text-secondary">{doc.tldr}</p>}
                {doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {doc.tags.split(',').filter(Boolean).map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-text-muted border border-border-subtle">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
