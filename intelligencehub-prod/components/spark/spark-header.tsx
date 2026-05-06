'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IdeaForm } from './idea-form'
import { Zap, Users, Globe, Trophy } from 'lucide-react'

interface SparkHeaderProps {
  stats: { totalIdeas: number; totalVotes: number; opcoCount: number }
}

export function SparkHeader({ stats }: SparkHeaderProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      {/* Banner */}
      <div className="relative glass rounded-card p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-brand-blue/5" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan pulse-dot" />
              <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider">Q2 2026 · Continental Challenge · Live</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">
              Spark <span className="text-accent-cyan">$100K</span>
            </h2>
            <p className="text-text-secondary text-sm max-w-md">
              Spot a real problem or a new opportunity. Pitch it here. If the continent backs it and we ship it — you take home $100,000.
            </p>
            {/* Prize breakdown */}
            <div className="flex flex-wrap gap-3 mt-4 text-xs">
              {[['1st', '$50,000'], ['2nd', '$25,000'], ['3rd', '$15,000'], ['4th–10th', '$10,000']].map(([place, amount]) => (
                <div key={place} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-border-subtle">
                  <Trophy size={10} className="text-accent-cyan" />
                  <span className="text-text-muted">{place}</span>
                  <span className="font-medium text-text-primary">{amount}</span>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Zap size={14} />
            Submit an Idea
          </Button>
        </div>

        {/* Live stats */}
        <div className="relative grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border-subtle">
          {[
            { label: 'Ideas submitted',  value: stats.totalIdeas,  icon: Zap    },
            { label: 'Total votes cast', value: stats.totalVotes,  icon: Users  },
            { label: 'OpCos in play',    value: stats.opcoCount,   icon: Globe  },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon size={12} className="text-text-muted" />
                <span className="text-2xl font-bold text-text-primary tabular-nums">{value}</span>
              </div>
              <p className="text-[11px] text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {showForm && <IdeaForm onClose={() => setShowForm(false)} />}
    </>
  )
}
