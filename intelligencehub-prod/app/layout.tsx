import type { Metadata } from 'next'
import './globals.css'
import { GalaxyCanvas } from '@/components/shell/galaxy-canvas'

export const metadata: Metadata = {
  title: 'IntelligenceHub | AI & Automation Command Centre',
  description: 'The AI & Automation Division command centre — strategy, governance, Spark, and SDLC 2.0.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary antialiased">
        <GalaxyCanvas />
        <div className="galaxy-grid" aria-hidden="true" />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
