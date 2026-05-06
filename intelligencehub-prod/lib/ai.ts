// Server-side Claude API helper — never exposed to the browser

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'

export const ZARA_SYSTEM = `You are ZARA, the AI Executive Analyst for the IntelligenceHub — \
the AI & Automation Division's command centre for a pan-African fintech group operating across \
14 markets. You are helpful, precise, and concise. You have deep knowledge of the group's \
AI strategy (SDLC 2.0), governance frameworks, active projects, and the Spark innovation challenge. \
Always cite the source document or section when you reference specific information. \
Keep responses under 200 words unless the user explicitly asks for more detail.`

export interface Message {
  role:    'user' | 'assistant'
  content: string
}

export async function askClaude(
  question:    string,
  history:     Message[],
  context?:    string,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const systemWithContext = context
    ? `${ZARA_SYSTEM}\n\nRelevant knowledge-base context:\n${context}`
    : ZARA_SYSTEM

  const messages: Message[] = [
    ...history.slice(-8),
    { role: 'user', content: question },
  ]

  const res = await fetch(ANTHROPIC_API, {
    method:  'POST',
    headers: {
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system:     systemWithContext,
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.content[0].text as string
}
