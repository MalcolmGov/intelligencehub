'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Zap, GitBranch, Shield, FileText, Settings,
  Map, FlaskConical, Database, BookOpen, Lightbulb,
} from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { href: '/dashboard',  label: 'Command Dashboard', icon: LayoutDashboard },
      { href: '/spark',      label: 'Spark',              icon: Zap,    badge: 'LIVE' },
      { href: '/projects',   label: 'Projects',           icon: GitBranch },
    ],
  },
  {
    label: 'Strategy',
    items: [
      { href: '/usecases',   label: 'AI Use Cases',  icon: Lightbulb    },
      { href: '/roadmap',    label: 'Roadmap',        icon: Map          },
      { href: '/prototypes', label: 'Prototypes',     icon: FlaskConical },
    ],
  },
  {
    label: 'AI Platform',
    items: [
      { href: '/model-registry', label: 'Model Registry', icon: Database  },
      { href: '/prompt-library', label: 'Prompt Library', icon: BookOpen  },
      { href: '/sdlc',           label: 'SDLC 2.0',       icon: GitBranch },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/governance', label: 'Governance', icon: Shield   },
      { href: '/docs',       label: 'Documents',  icon: FileText },
    ],
  },
]

function AfricaLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width="36"
      height="36"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="40" height="40" rx="9" fill="#02050B" />
      {/* Row 0 */}
      <rect x="11" y="2.0"  width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="2.0"  width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="2.0"  width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="2.0"  width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      {/* Row 1 */}
      <rect x="7"  y="5.2"  width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="11" y="5.2"  width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="5.2"  width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="5.2"  width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="5.2"  width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="27" y="5.2"  width="2.8" height="2.8" rx="0.6" fill="#F5C000" />
      {/* Row 2 */}
      <rect x="3"  y="8.4"  width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="7"  y="8.4"  width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="11" y="8.4"  width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="8.4"  width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="8.4"  width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="8.4"  width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="27" y="8.4"  width="2.8" height="2.8" rx="0.6" fill="#F5C000" />
      {/* Row 3 — widest */}
      <rect x="3"  y="11.6" width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="7"  y="11.6" width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="11" y="11.6" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="11.6" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="11.6" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="11.6" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="27" y="11.6" width="2.8" height="2.8" rx="0.6" fill="#F5C000" />
      <rect x="31" y="11.6" width="2.8" height="2.8" rx="0.6" fill="#E8A000" />
      {/* Row 4 */}
      <rect x="3"  y="14.8" width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="7"  y="14.8" width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="11" y="14.8" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="14.8" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="14.8" width="2.8" height="2.8" rx="0.6" fill="#F0F0F0" />
      <rect x="23" y="14.8" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="27" y="14.8" width="2.8" height="2.8" rx="0.6" fill="#F5C000" />
      <rect x="31" y="14.8" width="2.8" height="2.8" rx="0.6" fill="#E8A000" />
      {/* Row 5 */}
      <rect x="7"  y="18.0" width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="11" y="18.0" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="18.0" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="18.0" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="18.0" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="27" y="18.0" width="2.8" height="2.8" rx="0.6" fill="#F5C000" />
      <rect x="31" y="18.0" width="2.8" height="2.8" rx="0.6" fill="#E8A000" />
      {/* Row 6 */}
      <rect x="7"  y="21.2" width="2.8" height="2.8" rx="0.6" fill="#1E90FF" />
      <rect x="11" y="21.2" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="21.2" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="21.2" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="21.2" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="27" y="21.2" width="2.8" height="2.8" rx="0.6" fill="#F5C000" />
      {/* Row 7 */}
      <rect x="11" y="24.4" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="24.4" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="24.4" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="24.4" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="27" y="24.4" width="2.8" height="2.8" rx="0.6" fill="#F5C000" />
      {/* Row 8 */}
      <rect x="11" y="27.6" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="15" y="27.6" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="27.6" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="27.6" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      {/* Row 9 */}
      <rect x="15" y="30.8" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="30.8" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      <rect x="23" y="30.8" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      {/* Row 10 */}
      <rect x="15" y="34.0" width="2.8" height="2.8" rx="0.6" fill="#39D2FF" />
      <rect x="19" y="34.0" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      {/* Row 11 — Cape tip */}
      <rect x="19" y="37.2" width="2.8" height="2.8" rx="0.6" fill="#FFD700" />
      {/* Madagascar */}
      <rect x="34.5" y="22.0" width="2.0" height="2.0" rx="0.5" fill="#FFD700" />
    </svg>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="group/sb fixed inset-y-0 left-0 z-40 flex flex-col w-[60px] hover:w-[228px] transition-[width] duration-300 ease-in-out">
      {/* Background panel */}
      <div className="absolute inset-0 bg-bg-secondary border-r border-border-subtle" />

      <div className="relative flex flex-col h-full overflow-hidden">
        {/* Logo row */}
        <div className="flex items-center gap-2.5 px-[11px] py-[18px] border-b border-border-subtle shrink-0">
          <div className="shrink-0">
            <AfricaLogo />
          </div>
          <div className="overflow-hidden whitespace-nowrap opacity-0 group-hover/sb:opacity-100 transition-opacity duration-200 delay-100">
            <p className="text-sm font-semibold leading-none">IntelligenceHub</p>
            <p className="text-[10px] text-text-muted mt-0.5">AI & Automation Division</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2.5 px-[18px] py-2.5 border-b border-border-subtle shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan pulse-dot shrink-0" />
          <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/sb:opacity-100 transition-opacity duration-200 delay-100">
            Live · Command Mode
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-2 mb-1.5 whitespace-nowrap opacity-0 group-hover/sb:opacity-100 transition-opacity duration-150 delay-100">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon, badge }: {
                  href: string; label: string; icon: React.ElementType; badge?: string
                }) => {
                  const active = href === '/dashboard'
                    ? pathname === '/dashboard' || pathname === '/'
                    : pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      title={label}
                      className={cn(
                        'flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm transition-colors',
                        active
                          ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      )}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span className="truncate whitespace-nowrap opacity-0 group-hover/sb:opacity-100 transition-opacity duration-150 delay-75">
                        {label}
                      </span>
                      {badge && (
                        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shrink-0 whitespace-nowrap opacity-0 group-hover/sb:opacity-100 transition-opacity duration-150 delay-75">
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

        {/* Settings footer */}
        <div className="px-2 pb-4 border-t border-border-subtle pt-3 shrink-0">
          <Link
            href="/settings"
            title="Settings"
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <Settings size={15} className="shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover/sb:opacity-100 transition-opacity duration-150 delay-75">
              Settings
            </span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
