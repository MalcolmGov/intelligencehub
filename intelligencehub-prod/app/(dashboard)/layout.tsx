import { Sidebar } from '@/components/shell/sidebar'
import dynamic from 'next/dynamic'

// ZaraVoice uses browser APIs — SSR must be off
const ZaraVoice = dynamic(
  () => import('@/components/zara/zara-voice').then(m => m.ZaraVoice),
  { ssr: false }
)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ marginLeft: '60px' }}
      >
        {children}
      </div>
      <ZaraVoice />
    </div>
  )
}
