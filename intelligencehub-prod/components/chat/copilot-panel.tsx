'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X, Send, Mic, MicOff, Sparkles } from 'lucide-react'

interface Message {
  role:    'user' | 'assistant'
  content: string
}

const SUGGESTED = [
  'What is our AI strategy?',
  'Summarise the SDLC 2.0 framework',
  'How does Spark work?',
  'What are the governance controls?',
]

export function CopilotPanel({ userName }: { userName?: string }) {
  const [open,      setOpen]     = useState(false)
  const [messages,  setMessages] = useState<Message[]>([])
  const [input,     setInput]    = useState('')
  const [thinking,  setThinking] = useState(false)
  const [voiceMode, setVoiceMode]= useState(false)
  const [, startTransition]       = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const send = async (text?: string) => {
    const q = (text || input).trim()
    if (!q || thinking) return
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: q }]
    setMessages(newMessages)
    setThinking(true)

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'content-type': 'application/json' },
        body:    JSON.stringify({ question: q, history: newMessages.slice(-8) }),
      })
      const data = await res.json()
      const reply = res.ok ? data.text : 'Something went wrong. Please try again.'
      const updated = [...newMessages, { role: 'assistant' as const, content: reply }]
      setMessages(updated)

      // Voice response
      if (voiceMode && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(reply)
        u.rate = 0.93; u.pitch = 0.97
        const voices = window.speechSynthesis.getVoices()
        const preferred = voices.find(v => /Google UK English Female/i.test(v.name))
          || voices.find(v => /Samantha|Karen|Moira/i.test(v.name))
          || voices.find(v => /en[-_]/i.test(v.lang) && v.localService)
        if (preferred) u.voice = preferred
        window.speechSynthesis.speak(u)
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setThinking(false)
    }
  }

  const toggleVoice = () => {
    if (!voiceMode) {
      // Unlock audio context synchronously on click
      const u = new SpeechSynthesisUtterance('​')
      u.volume = 0
      window.speechSynthesis.speak(u)
      // Greet
      setTimeout(() => {
        const greeting = `Hi ${userName || 'there'}, how can I assist you today?`
        setMessages(m => [...m, { role: 'assistant', content: greeting }])
        const gu = new SpeechSynthesisUtterance(greeting)
        gu.rate = 0.93; gu.pitch = 0.97
        window.speechSynthesis.speak(gu)
      }, 50)
    } else {
      window.speechSynthesis.cancel()
    }
    setVoiceMode(v => !v)
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-brand-blue shadow-lg',
          'flex items-center justify-center text-white transition-all hover:scale-105 hover:shadow-brand-blue/30',
          open && 'opacity-0 pointer-events-none'
        )}
        aria-label="Open ZARA assistant"
      >
        <Sparkles size={20} />
      </button>

      {/* Panel */}
      <div className={cn(
        'fixed bottom-6 right-6 z-50 flex flex-col w-[380px] max-h-[600px] rounded-2xl shadow-2xl glass',
        'transition-all duration-300',
        open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle shrink-0">
          <div className="w-8 h-8 rounded-xl bg-brand-blue/20 flex items-center justify-center">
            <Sparkles size={14} className="text-brand-blue" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">ZARA AI</p>
            <p className="text-[10px] text-text-muted">Executive Intelligence Assistant</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleVoice}
              title={voiceMode ? 'Stop voice mode' : 'Start voice conversation'}
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded-lg transition-colors',
                voiceMode
                  ? 'bg-brand-blue/20 text-brand-blue'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/5'
              )}
            >
              {voiceMode ? <Mic size={13} /> : <MicOff size={13} />}
            </button>
            <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-text-secondary text-sm">
                Hi {userName ? userName.split(' ')[0] : 'there'} — I'm <strong className="text-text-primary">ZARA</strong>. Ask me anything about our AI strategy, governance, Spark ideas, or active projects.
              </p>
              <div className="space-y-2">
                {SUGGESTED.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-text-secondary border border-border-subtle hover:border-brand-blue/30 hover:text-text-primary hover:bg-white/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'bg-brand-blue text-white rounded-br-sm'
                  : 'bg-bg-tertiary text-text-primary rounded-bl-sm'
              )}>
                {m.content}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex justify-start">
              <div className="bg-bg-tertiary rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-border-subtle shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask ZARA anything…"
              rows={1}
              className="flex-1 bg-bg-tertiary border border-border-subtle rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-brand-blue transition-colors max-h-24"
            />
            <Button onClick={() => send()} disabled={!input.trim() || thinking} size="sm" className="shrink-0 h-9">
              <Send size={13} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
