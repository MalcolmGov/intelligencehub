import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createSchema = z.object({
  title:       z.string().min(5).max(120),
  description: z.string().min(20).max(2000),
  impact:      z.string().max(200).optional(),
  opco:        z.string().min(1),
  type:        z.enum(['OPPORTUNITY', 'PROBLEM', 'IMPROVEMENT']).default('OPPORTUNITY'),
  category:    z.string().min(1),
  tags:        z.array(z.string()).max(5).optional().default([]),
})

// GET /api/spark/ideas — list with pagination, filters, sort
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const page     = parseInt(searchParams.get('page')    || '1')
  const limit    = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const opco     = searchParams.get('opco')    || undefined
  const status   = searchParams.get('status')  || undefined
  const category = searchParams.get('category')|| undefined
  const sort     = searchParams.get('sort')    || 'votes'  // votes | recent | comments
  const myIdeas  = searchParams.get('mine') === '1'

  const where: any = {}
  if (opco)     where.opco     = opco
  if (status)   where.status   = status
  if (category) where.category = category
  if (myIdeas)  where.authorId = session.user.id

  const orderBy: any =
    sort === 'recent'   ? { createdAt: 'desc' } :
    sort === 'comments' ? { comments: { _count: 'desc' } } :
    { votes: { _count: 'desc' } }

  const [ideas, total] = await Promise.all([
    db.sparkIdea.findMany({
      where,
      orderBy,
      skip:  (page - 1) * limit,
      take:  limit,
      include: {
        author:   { select: { id: true, name: true, image: true, opco: true } },
        _count:   { select: { votes: true, comments: true } },
        votes:    { where: { userId: session.user.id }, select: { id: true } },
      },
    }),
    db.sparkIdea.count({ where }),
  ])

  const serialized = ideas.map(idea => ({
    ...idea,
    voteCount:    idea._count.votes,
    commentCount: idea._count.comments,
    hasVoted:     idea.votes.length > 0,
    votes:        undefined,
    _count:       undefined,
  }))

  return NextResponse.json({ ideas: serialized, total, page, limit })
}

// POST /api/spark/ideas — submit new idea
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { tags, ...rest } = parsed.data
  const idea = await db.sparkIdea.create({
    data: {
      ...rest,
      tags: tags.join(','),
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true, comments: true } },
    },
  })

  return NextResponse.json(idea, { status: 201 })
}
