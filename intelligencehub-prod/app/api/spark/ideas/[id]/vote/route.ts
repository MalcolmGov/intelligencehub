import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// POST /api/spark/ideas/[id]/vote — toggle vote
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: ideaId } = params
  const userId = session.user.id

  const existing = await db.sparkVote.findUnique({
    where: { ideaId_userId: { ideaId, userId } },
  })

  if (existing) {
    await db.sparkVote.delete({ where: { id: existing.id } })
    const count = await db.sparkVote.count({ where: { ideaId } })
    return NextResponse.json({ hasVoted: false, voteCount: count })
  } else {
    await db.sparkVote.create({ data: { ideaId, userId } })
    const count = await db.sparkVote.count({ where: { ideaId } })
    return NextResponse.json({ hasVoted: true, voteCount: count })
  }
}
