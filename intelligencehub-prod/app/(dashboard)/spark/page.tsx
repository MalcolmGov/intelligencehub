export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { IdeaCard } from '@/components/spark/idea-card'
import { SparkHeader } from '@/components/spark/spark-header'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

interface SparkPageProps {
  searchParams: { opco?: string; status?: string; sort?: string; page?: string }
}

async function getIdeas(userId: string, sp: SparkPageProps['searchParams']) {
  const page  = parseInt(sp.page || '1')
  const limit = 20
  const where: any = {}
  if (sp.opco && sp.opco !== 'all')     where.opco   = sp.opco
  if (sp.status && sp.status !== 'all') where.status = sp.status

  const orderBy: any =
    sp.sort === 'recent'   ? { createdAt: 'desc' } :
    sp.sort === 'comments' ? { comments:  { _count: 'desc' } } :
                             { votes:     { _count: 'desc' } }

  const [ideas, total] = await Promise.all([
    db.sparkIdea.findMany({
      where, orderBy,
      skip: (page - 1) * limit, take: limit,
      include: {
        author: { select: { id: true, name: true, opco: true } },
        _count: { select: { votes: true, comments: true } },
        votes:  { where: { userId }, select: { id: true } },
      },
    }),
    db.sparkIdea.count({ where }),
  ])

  return {
    ideas: ideas.map(i => ({
      ...i,
      voteCount:    i._count.votes,
      commentCount: i._count.comments,
      hasVoted:     i.votes.length > 0,
      votes:        undefined,
      _count:       undefined,
    })),
    total,
  }
}

async function getStats() {
  const [totalIdeas, totalVotes, opcoCount] = await Promise.all([
    db.sparkIdea.count(),
    db.sparkVote.count(),
    db.sparkIdea.groupBy({ by: ['opco'], _count: true }),
  ])
  return { totalIdeas, totalVotes, opcoCount: opcoCount.length }
}

export default async function SparkPage({ searchParams }: SparkPageProps) {
  const session = await auth()
  const userId  = session?.user.id || ''

  const [{ ideas, total }, stats] = await Promise.all([
    getIdeas(userId, searchParams),
    getStats(),
  ])

  return (
    <>
      <Topbar title="Spark Innovation Challenge" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        <SparkHeader stats={stats} />

        {/* Ideas grid */}
        {ideas.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg font-medium mb-2">No ideas yet</p>
            <p className="text-sm">Be the first to submit an idea and kick off the challenge.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ideas.map(idea => (
                <IdeaCard key={idea.id} idea={idea as any} />
              ))}
            </div>
            {total > 20 && (
              <p className="text-center text-xs text-text-muted">
                Showing {ideas.length} of {total} ideas
              </p>
            )}
          </>
        )}
      </main>
    </>
  )
}
