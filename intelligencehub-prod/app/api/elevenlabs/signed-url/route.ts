import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey   = process.env.ELEVENLABS_API_KEY
  const agentId  = process.env.ELEVENLABS_AGENT_ID

  if (!apiKey || !agentId) {
    return NextResponse.json(
      { error: 'ElevenLabs not configured. Set ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID.' },
      { status: 503 }
    )
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: { 'xi-api-key': apiKey },
        // Don't cache — signed URLs expire
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      const body = await res.text()
      console.error('[Zara] signed-url error:', res.status, body)
      return NextResponse.json(
        { error: `ElevenLabs API error: ${res.status}` },
        { status: res.status }
      )
    }

    const { signed_url } = await res.json()
    return NextResponse.json({ signedUrl: signed_url })
  } catch (err) {
    console.error('[Zara] signed-url fetch failed:', err)
    return NextResponse.json({ error: 'Failed to get signed URL' }, { status: 500 })
  }
}
