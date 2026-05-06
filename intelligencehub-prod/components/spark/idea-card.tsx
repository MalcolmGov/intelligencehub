import { Badge } from '@/components/ui/badge'
import { VoteButton } from './vote-button'
import { MessageSquare, Clock } from 'lucide-react'
import { STATUS_LABELS, STATUS_COLORS, timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface IdeaCardProps {
  idea: {
    id:           string
    title:        string
    description:  string
    impact?:      string | null
    opco:         string
    category:     string
    status:       string
    tags:         string[]
    createdAt:    Date | string
    voteCount:    number
    commentCount: number
    hasVoted:     boolean
    author:       { name: string | null; opco: string | null }
  }
}

const TYPE_BADGE: Record<string, 'blue' | 'amber' | 'green'> = {
  OPPORTUNITY: 'blue',
  PROBLEM:     'amber',
  IMPROVEMENT: 'green',
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <div className="glass rounded-card p-5 hover:border-brand-blue/20 transition-all group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-brand-blue transition-colors">
            {idea.title}
          </h3>
          <p className="text-xs text-text-muted mt-1">
            {idea.author.name} · {idea.opco}
          </p>
        </div>
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium shrink-0', STATUS_COLORS[idea.status])}>
          {STATUS_LABELS[idea.status] ?? idea.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary line-clamp-2 mb-3 leading-relaxed">
        {idea.description}
      </p>

      {/* Impact */}
      {idea.impact && (
        <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-xl bg-accent-green/5 border border-accent-green/10">
          <span className="text-accent-green text-[10px] font-medium uppercase tracking-wider">Impact</span>
          <span className="text-xs text-text-secondary">{idea.impact}</span>
        </div>
      )}

      {/* Tags */}
      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {idea.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-text-muted border border-border-subtle">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <Clock size={11} />
          {timeAgo(idea.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <MessageSquare size={11} />
            {idea.commentCount}
          </div>
          <VoteButton ideaId={idea.id} hasVoted={idea.hasVoted} voteCount={idea.voteCount} />
        </div>
      </div>
    </div>
  )
}
