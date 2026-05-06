import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IntelligenceHub | AI & Automation Command Centre',
  description: 'The AI & Automation Division command centre — strategy, governance, Spark, and SDLC 2.0.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
