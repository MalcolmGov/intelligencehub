'use client'

import { useState, useTransition } from 'react'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoteButtonProps {
  ideaId:    string
  hasVoted:  boolean
  voteCount: number
}

export function VoteButton({ ideaId, hasVoted: initial, voteCount: initialCount }: VoteButtonProps) {
  const [hasVoted,  setHasVoted]  = useState(initial)
  const [voteCount, setVoteCount] = useState(initialCount)
  const [pending,   startTransition] = useTransition()

  const toggle = () => {
    startTransition(async () => {
      const res  = await fetch(`/api/spark/ideas/${ideaId}/vote`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setHasVoted(data.hasVoted)
        setVoteCount(data.voteCount)
      }
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
        hasVoted
          ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/20'
          : 'bg-white/5 text-text-secondary border border-border-subtle hover:text-text-primary hover:bg-white/10',
        pending && 'opacity-60 cursor-not-allowed'
      )}
    >
      <Zap size={12} className={hasVoted ? 'fill-current' : ''} />
      {voteCount}
    </button>
  )
}
