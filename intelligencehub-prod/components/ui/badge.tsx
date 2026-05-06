import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'amber' | 'purple' | 'slate' | 'rose'
  className?: string
}
const variants = {
  blue:   'bg-blue-900/40 text-blue-300 border border-blue-800/40',
  green:  'bg-green-900/40 text-green-300 border border-green-800/40',
  amber:  'bg-amber-900/40 text-amber-300 border border-amber-800/40',
  purple: 'bg-purple-900/40 text-purple-300 border border-purple-800/40',
  slate:  'bg-slate-800 text-slate-300 border border-slate-700',
  rose:   'bg-rose-900/40 text-rose-300 border border-rose-800/40',
}
export function Badge({ children, variant = 'slate', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
