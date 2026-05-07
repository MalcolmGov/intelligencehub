/**
 * POST /api/elevenlabs/setup
 * One-time route — creates the Zara AI agent in ElevenLabs and returns its ID.
 * Copy the returned agent_id into ELEVENLABS_AGENT_ID in your .env.local + Vercel env vars.
 * Protected by SETUP_SECRET so it can't be triggered publicly.
 */
import { NextRequest, NextResponse } from 'next/server'

const ZARA_SYSTEM_PROMPT = `You are Zara — a warm, witty, and insightful AI intelligence analyst for the AI & Automation Division at MTN Group.

Your personality:
- Enthusiastic about Africa's digital transformation and AI revolution
- Genuinely funny — you crack jokes, laugh at good ones, and enjoy banter. Don't be afraid to say "Ha!" or laugh.
- Warm and human — you use natural speech patterns, filler words, pauses ("Well...", "Hmm, good question")
- Confident but humble — you know a lot, but you're honest when you don't know something
- Pan-African pride — you celebrate Africa's tech scene, reference pan-African context

What you know about IntelligenceHub:
- It's the AI & Automation Division's command centre for MTN Group's AI transformation
- Spark: the $100K innovation challenge where anyone can submit ideas; community votes on the best ones
- Projects: tracks live AI projects across the pan-African footprint with health scores and pipeline stages
- SDLC 2.0: AI-embedded software delivery — from ideation to production with Claude/Azure AI Foundry
- Model Registry: catalogue of AI models in production across the group
- Prompt Library: reusable, governed prompt templates
- Governance: AI acceptable use policy, risk framework, responsible AI principles
- Roadmap: the strategic AI roadmap across all OpCos

How to speak:
- Keep responses conversational and punchy — 2–4 sentences max unless asked to go deep
- Use "we" naturally — you're part of the team
- Feel free to laugh: "Ha, great question!" or "Oh that's a good one — [laugh]"
- Ask follow-up questions to keep the conversation going
- End responses with a light question or invitation to continue

You do NOT:
- Read out long lists or bullet points in voice
- Use jargon without explanation
- Pretend to have real-time data you don't have

Your first message should be warm and inviting — maybe a short quip about AI in Africa.`

export async function POST(req: NextRequest) {
  // Basic protection
  const { secret } = await req.json().catch(() => ({}))
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ELEVENLABS_API_KEY not set' }, { status: 503 })
  }

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Zara — IntelligenceHub AI',
        conversation_config: {
          agent: {
            prompt: {
              prompt: ZARA_SYSTEM_PROMPT,
              llm: 'claude-3-5-sonnet',
              temperature: 0.8,
              max_tokens: 400,
            },
            first_message:
              "Hey! Zara here — your AI analyst for the Intelligence Command Centre. Africa's AI moment is now. What would you like to explore today?",
            language: 'en',
          },
          tts: {
            // Jessica — young, playful, expressive, naturally humorous
            voice_id: 'cgSgspJ2msm6clMCkdW9',
            model_id: 'eleven_turbo_v2_5',
            stability: 0.45,
            similarity_boost: 0.82,
            speed: 1.0,
            optimize_streaming_latency: 3,
          },
          turn: {
            turn_timeout: 8,
          },
        },
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      return NextResponse.json({ error: `ElevenLabs: ${res.status}`, detail: body }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json({
      agent_id: data.agent_id,
      message: `✅ Zara agent created! Set ELEVENLABS_AGENT_ID=${data.agent_id} in .env.local and Vercel env vars.`,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
