import { auth } from '@/lib/auth'
import { signOutAction } from '@/lib/actions'
import { Bell, LogOut, User } from 'lucide-react'

export async function Topbar({ title }: { title: string }) {
  const session = await auth()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
      <div>
        <h1 className="text-sm font-semibold text-text-primary">{title}</h1>
        <p className="text-[11px] text-text-muted font-mono">
          {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
          <Bell size={15} />
        </button>

        {/* User menu */}
        {session && (
          <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt={session.user.name || ''} className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <User size={13} className="text-brand-blue" />
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-medium leading-none">{session.user.name?.split(' ')[0]}</p>
              {session.user.opco && (
                <p className="text-[10px] text-text-muted mt-0.5">{session.user.opco}</p>
              )}
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-red-400 hover:bg-red-900/20 transition-colors ml-1"
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
