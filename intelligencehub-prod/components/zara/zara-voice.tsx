'use client'

import { ConversationProvider, useConversation } from '@elevenlabs/react'
import { useCallback, useState, useEffect, useRef } from 'react'
import { Mic, MicOff, X, Volume2, VolumeX, Loader2, MessageSquare, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message { role: 'user' | 'agent'; text: string; id: number }

/* ── Inner component (must be inside ConversationProvider) ─────── */
function ZaraInner() {
  const [silent,   setSilent]   = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [showLog,  setShowLog]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [interrupted, setInterrupted] = useState(false)
  const [connecting, setConnecting]   = useState(false)
  const msgId  = useRef(0)
  const logRef = useRef<HTMLDivElement>(null)

  const conversation = useConversation({
    onConnect:      ()           => { setConnecting(false); setError(null) },
    onDisconnect:   ()           => { setConnecting(false) },
    onError:        (msg)        => { setError(msg); setConnecting(false) },
    onModeChange:   ()           => setInterrupted(false),
    onInterruption: ()           => setInterrupted(true),
    onMessage: ({ message, role }) =>
      setMessages(prev => [...prev, { role, text: message, id: ++msgId.current }]),
  })

  const { status, mode, isMuted, setMuted, setVolume, endSession } = conversation

  const isActive = status === 'connected' || status === 'connecting' || connecting

  // Auto-scroll transcript
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  // Sync output volume
  useEffect(() => {
    if (status === 'connected') setVolume({ volume: silent ? 0 : 1 })
  }, [silent, status, setVolume])

  const start = useCallback(async () => {
    setError(null)
    setConnecting(true)
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const res  = await fetch('/api/elevenlabs/signed-url')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      // startSession is void — connection happens async, onConnect fires when ready
      conversation.startSession({ signedUrl: data.signedUrl })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setConnecting(false)
    }
  }, [conversation])

  const stop = useCallback(() => {
    endSession()
    setConnecting(false)
    setSilent(false)
    setMessages([])
    setShowLog(false)
  }, [endSession])

  const isBusy    = connecting || status === 'connecting'
  const isSpeaking = isActive && mode === 'speaking'
  const isListening = isActive && mode === 'listening'

  return (
    <>
      {/* ── Transcript panel ──────────────────────────────────── */}
      {isActive && (
        <div className={cn(
          'fixed bottom-[100px] right-6 w-80 z-50 rounded-2xl border shadow-2xl',
          'bg-bg-secondary/95 backdrop-blur-xl border-border-subtle',
          'transition-all duration-300',
          showLog ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}
          style={{ boxShadow: '0 0 40px rgba(57,210,255,0.12)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan pulse-dot" />
              <span className="text-xs font-semibold text-text-primary">Zara AI</span>
              <span className={cn(
                'text-[10px] font-mono px-1.5 py-0.5 rounded-md border',
                isSpeaking
                  ? 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20'
                  : isMuted
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-white/5 text-text-muted border-white/5'
              )}>
                {isSpeaking ? 'speaking' : isMuted ? 'muted' : 'listening'}
              </span>
            </div>
            <button onClick={() => setShowLog(false)}
              className="text-text-muted hover:text-text-primary transition-colors p-1">
              <ChevronDown size={14} />
            </button>
          </div>

          <div ref={logRef} className="h-52 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-text-muted text-center pt-8 opacity-60">
                Conversation will appear here…
              </p>
            )}
            {messages.map(m => (
              <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                  m.role === 'user'
                    ? 'bg-brand-blue/20 text-text-primary border border-brand-blue/20'
                    : 'bg-white/5 text-text-secondary border border-white/5'
                )}>
                  {m.role === 'agent' && (
                    <span className="block text-[9px] text-accent-cyan mb-1 font-semibold tracking-wider uppercase">
                      Zara
                    </span>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Control pill (shown when active, transcript hidden) ── */}
      {isActive && !showLog && (
        <div className="fixed bottom-[100px] right-6 z-50 flex items-center gap-2">
          {error && (
            <div className="bg-red-900/80 border border-red-500/40 text-red-300 text-xs rounded-xl px-3 py-2 max-w-[200px] backdrop-blur-md">
              {error}
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border backdrop-blur-xl"
            style={{
              background: 'rgba(10,15,30,0.9)',
              borderColor: isSpeaking ? 'rgba(57,210,255,0.4)' : 'rgba(148,163,184,0.12)',
              boxShadow:   isSpeaking ? '0 0 20px rgba(57,210,255,0.15)' : 'none',
            }}
          >
            <button onClick={() => setShowLog(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-cyan hover:bg-white/5 transition-colors"
              title="Show transcript">
              <MessageSquare size={13} />
            </button>
            <button onClick={() => setMuted(!isMuted)}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                isMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
              title={isMuted ? 'Unmute mic' : 'Mute mic'}>
              {isMuted ? <MicOff size={13} /> : <Mic size={13} />}
            </button>
            <button onClick={() => setSilent(v => !v)}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                silent
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
              title={silent ? 'Unmute Zara' : 'Mute Zara'}>
              {silent ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
            <button onClick={stop}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="End conversation">
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ── Zara FAB ────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {error && !isActive && (
          <div className="bg-red-900/80 border border-red-500/40 text-red-300 text-xs rounded-xl px-3 py-2 max-w-[220px] backdrop-blur-md">
            {error}
          </div>
        )}

        {interrupted && isActive && (
          <span className="text-[10px] text-accent-cyan font-mono fade-up">interrupted ✦</span>
        )}

        <button
          onClick={isActive ? stop : start}
          disabled={isBusy}
          title={isActive ? 'End conversation' : 'Talk to Zara AI'}
          className="relative flex items-center justify-center w-16 h-16 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          style={{
            background: isSpeaking
              ? 'radial-gradient(circle at 35% 35%, #1e88e5, #0d47a1)'
              : 'radial-gradient(circle at 35% 35%, #ffffff, #dbeeff)',
            boxShadow: isSpeaking
              ? '0 0 0 2px rgba(57,210,255,0.9), 0 0 28px rgba(57,210,255,0.55), 0 0 56px rgba(57,210,255,0.25)'
              : isListening
                ? '0 0 0 2px rgba(59,130,246,0.6), 0 0 18px rgba(59,130,246,0.25)'
                : '0 0 0 2px rgba(57,210,255,0.45), 0 0 16px rgba(57,210,255,0.15)',
          }}
        >
          {/* Speaking rings */}
          {isSpeaking && (
            <>
              <span className="absolute inset-[-6px] rounded-full border-2 border-accent-cyan/50 animate-ping"
                style={{ animationDuration: '1.1s' }} />
              <span className="absolute inset-[-14px] rounded-full border border-accent-cyan/20 animate-ping"
                style={{ animationDuration: '1.7s' }} />
            </>
          )}

          {/* Listening pulse */}
          {isListening && !isMuted && (
            <span className="absolute inset-[-5px] rounded-full border-2 border-brand-blue/40 animate-pulse" />
          )}

          {/* Connecting overlay */}
          {isBusy && (
            <span className="absolute inset-0 rounded-full flex items-center justify-center bg-bg-secondary/70 z-10">
              <Loader2 size={22} className="text-accent-cyan animate-spin" />
            </span>
          )}

          <ZaraAvatarSVG speaking={isSpeaking} />
        </button>
      </div>
    </>
  )
}

/* ── Public export — wraps inner with ConversationProvider ─────── */
export function ZaraVoice() {
  return (
    <ConversationProvider>
      <ZaraInner />
    </ConversationProvider>
  )
}

/* ── SVG avatar ─────────────────────────────────────────────────── */
function ZaraAvatarSVG({ speaking }: { speaking: boolean }) {
  return (
    <svg viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"
      width="52" height="52" aria-hidden="true"
      style={{ borderRadius: '50%', overflow: 'hidden', display: 'block' }}
    >
      <defs>
        <radialGradient id="zv-bg" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={speaking ? '#1e88e5' : '#ffffff'} />
          <stop offset="100%" stopColor={speaking ? '#0d47a1' : '#dbeeff'} />
        </radialGradient>
        <radialGradient id="zv-face" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stopColor="#b8e8f8" />
          <stop offset="60%"  stopColor="#7db8d8" />
          <stop offset="100%" stopColor="#3a7090" />
        </radialGradient>
        <linearGradient id="zv-hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00f0ff" />
          <stop offset="50%"  stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#0066cc" />
        </linearGradient>
        <linearGradient id="zv-scan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(0,240,255,0)" />
          <stop offset="50%"  stopColor="rgba(0,240,255,0.7)" />
          <stop offset="100%" stopColor="rgba(0,240,255,0)" />
        </linearGradient>
        <filter id="zv-glow">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="zv-clip"><circle cx="27" cy="27" r="27" /></clipPath>
      </defs>

      <circle cx="27" cy="27" r="27" fill="url(#zv-bg)" />

      {/* Hex-grid overlay */}
      <g clipPath="url(#zv-clip)" opacity="0.2" stroke="#0088cc" strokeWidth="0.4" fill="none">
        <polygon points="27,4 31,11 27,18 23,11" />
        <polygon points="13,12 17,19 13,26 9,19" />
        <polygon points="41,12 45,19 41,26 37,19" />
        <polygon points="20,28 24,35 20,42 16,35" />
        <polygon points="34,28 38,35 34,42 30,35" />
      </g>

      {/* Neck + shoulders */}
      <rect x="23" y="40" width="8" height="7" rx="2" fill="#5a9ab8" opacity="0.7" />
      <ellipse cx="27" cy="51" rx="15" ry="6" fill="#1a5aaa" opacity="0.95" />
      <path d="M15,51 Q20,46 27,45 Q34,46 39,51"
        fill="#2a6abe" stroke="#00f0ff" strokeWidth="0.5" opacity="0.8" />

      {/* Face */}
      <ellipse cx="27" cy="27" rx="11" ry="13" fill="url(#zv-face)" filter="url(#zv-glow)" />

      {/* Hair */}
      <path d="M16,22 Q14,10 27,8 Q40,10 38,22" fill="url(#zv-hair)" opacity="0.95" />
      <path d="M16,22 Q12,28 13,36 Q15,38 16,36 Q16,30 18,26" fill="url(#zv-hair)" opacity="0.85" />
      <path d="M38,22 Q42,28 41,36 Q39,38 38,36 Q38,30 36,26" fill="url(#zv-hair)" opacity="0.85" />

      {/* Eyes */}
      <ellipse cx="22.5" cy="27" rx="2" ry="2.2" fill="#00f0ff" opacity="0.9" />
      <circle  cx="22.5" cy="27" r="0.9" fill="#fff" opacity="0.8" />
      <ellipse cx="31.5" cy="27" rx="2" ry="2.2" fill="#00f0ff" opacity="0.9" />
      <circle  cx="31.5" cy="27" r="0.9" fill="#fff" opacity="0.8" />

      {/* Mouth — waveform when speaking, smile when idle */}
      {speaking ? (
        <path d="M22,33 Q23.5,31 25,33 Q26.5,35 28,33 Q29.5,31 31,33"
          stroke="#00f0ff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9" />
      ) : (
        <path d="M23,33 Q27,36.5 31,33"
          stroke="#00f0ff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
      )}

      {/* Scan line */}
      <rect x="0" y="27" width="54" height="1"
        fill="url(#zv-scan)" clipPath="url(#zv-clip)" opacity="0.4" />

      {/* Rim */}
      <circle cx="27" cy="27" r="26.5"
        fill="none" stroke="url(#zv-hair)" strokeWidth="0.8" opacity="0.4" />
    </svg>
  )
}
