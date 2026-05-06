export const dynamic = 'force-dynamic'

import { Topbar } from '@/components/shell/topbar'
import { ExternalLink } from 'lucide-react'

const PROTOS = [
  {
    title: 'Marketplace — Landing',
    desc: 'Consumer-facing home experience. Entry point to the Marketplace commerce ecosystem.',
    href: '/prototypes/marketplace/index.html',
    tag: 'HTML · Apr 2026',
    status: 'LIVE',
    statusColor: '#10B981',
    emoji: '🛍️',
  },
  {
    title: 'Shopper Experience',
    desc: 'Browse, product detail, compare, cart, checkout, order tracking, rewards. 9-screen consumer flow.',
    href: '/prototypes/marketplace/shop/browse.html',
    tag: '9 screens · shop/',
    status: 'DEMO',
    statusColor: '#06B6D4',
    emoji: '🛒',
  },
  {
    title: 'Seller Center',
    desc: 'Merchant dashboard, storefront, products, inventory, orders, promotions, registration. Full seller console.',
    href: '/prototypes/marketplace/seller/dashboard.html',
    tag: '8 screens · seller/',
    status: 'DEMO',
    statusColor: '#8B5CF6',
    emoji: '🏪',
  },
  {
    title: 'Admin Console',
    desc: 'Platform operations: users, sellers, orders, and reports. Operator console view.',
    href: '/prototypes/marketplace/admin/dashboard.html',
    tag: '5 screens · admin/',
    status: 'INTERNAL',
    statusColor: '#F43F5E',
    emoji: '⚙️',
  },
  {
    title: 'WhatsApp Shopping Flow',
    desc: 'Conversational commerce prototype — WhatsApp-driven product discovery and checkout.',
    href: '/prototypes/marketplace/whatsapp/flow.html',
    tag: 'HTML · whatsapp/',
    status: 'DEMO',
    statusColor: '#10B981',
    emoji: '💬',
  },
  {
    title: 'Auth & Onboarding',
    desc: 'Sign-in, sign-up, and first-run onboarding screens for both shoppers and sellers.',
    href: '/prototypes/marketplace/auth/onboarding.html',
    tag: '3 screens · auth/',
    status: 'DEMO',
    statusColor: '#06B6D4',
    emoji: '🔐',
  },
]

export default function PrototypesPage() {
  return (
    <>
      <Topbar title="Prototypes & Demos" />
      <main className="flex-1 p-6 space-y-6 fade-up">
        {/* Header */}
        <div className="glass rounded-card p-6 bg-gradient-to-br from-cyan-500/5 to-transparent">
          <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">// PROTOTYPES & DEMOS</p>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Live Prototypes</h2>
          <p className="text-text-secondary text-sm max-w-2xl">
            Interactive demos and proof-of-concepts showcasing our AI & Automation capabilities — ready to show to stakeholders.
          </p>
        </div>

        {/* Marketplace banner */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-accent-cyan uppercase tracking-widest">■ Marketplace — End-to-end prototypes</span>
          <div className="flex-1 h-px bg-gradient-to-r from-accent-cyan/30 to-transparent" />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROTOS.map(p => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-card overflow-hidden hover:border-brand-blue/30 transition-all group block"
            >
              {/* Preview area */}
              <div className="h-36 bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
                <span className="text-5xl">{p.emoji}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/80 flex items-center justify-center">
                    <ExternalLink size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-text-primary mb-1.5 group-hover:text-brand-blue transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-text-secondary mb-3 leading-relaxed line-clamp-2">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-mono">{p.tag}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ color: p.statusColor, background: `${p.statusColor}15`, border: `1px solid ${p.statusColor}30` }}>
                    {p.status}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}
