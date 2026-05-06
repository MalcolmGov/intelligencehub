import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { askClaude, type Message } from '@/lib/ai'
import { z } from 'zod'

const schema = z.object({
  question: z.string().min(1).max(1000),
  history:  z.array(z.object({
    role:    z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(20).optional().default([]),
  context: z.string().max(2000).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { question, history, context } = parsed.data

  try {
    const text = await askClaude(question, history as Message[], context)
    return NextResponse.json({ text })
  } catch (err: any) {
    console.error('[/api/chat]', err)
    return NextResponse.json({ error: err.message || 'AI error' }, { status: 500 })
  }
}
