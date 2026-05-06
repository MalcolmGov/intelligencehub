'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Zap, GitBranch, Shield, FileText, Settings, ChevronRight,
  Map, FlaskConical, Database, BookOpen, Lightbulb,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { href: '/',           label: 'Command Dashboard', icon: LayoutDashboard },
      { href: '/spark',      label: 'Spark',              icon: Zap,    badge: 'LIVE' },
      { href: '/projects',   label: 'Projects',           icon: ChevronRight    },
    ],
  },
  {
    label: 'Strategy',
    items: [
      { href: '/usecases',   label: 'AI Use Cases',       icon: Lightbulb       },
      { href: '/roadmap',    label: 'Roadmap',            icon: Map             },
      { href: '/prototypes', label: 'Prototypes',         icon: FlaskConical    },
    ],
  },
  {
    label: 'AI Platform',
    items: [
      { href: '/model-registry',  label: 'Model Registry',  icon: Database  },
      { href: '/prompt-library',  label: 'Prompt Library',  icon: BookOpen  },
      { href: '/sdlc',            label: 'SDLC 2.0',        icon: GitBranch },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/governance', label: 'Governance',   icon: Shield    },
      { href: '/docs',       label: 'Documents',    icon: FileText  },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-bg-secondary border-r border-border-subtle" />

      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border-subtle">
          <div className="w-7 h-7 rounded-lg bg-gradient-neon flex items-center justify-center text-xs font-bold text-bg-primary shrink-0">
            IH
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none truncate">IntelligenceHub</p>
            <p className="text-[10px] text-text-muted mt-0.5">AI & Automation Division</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan pulse-dot" />
          <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Live · Command Mode</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon, badge }: { href: string; label: string; icon: React.ElementType; badge?: string }) => {
                  const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                        active
                          ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      )}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span className="truncate">{label}</span>
                      {badge && (
                        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                          {badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings */}
        <div className="px-3 pb-4 border-t border-border-subtle pt-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <Settings size={15} />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
