import { Sidebar } from '@/components/shell/sidebar'

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
    </div>
  )
}
