import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'
}

const variants = {
  primary:   'bg-brand-blue hover:bg-brand-blueDark text-white',
  secondary: 'bg-bg-tertiary hover:bg-white/10 text-text-primary border border-border-subtle',
  ghost:     'hover:bg-white/5 text-text-secondary hover:text-text-primary',
  danger:    'bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800/40',
}
const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2   text-sm rounded-xl',
  lg: 'px-5 py-2.5 text-sm rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      {...props}
    />
  )
)
Button.displayName = 'Button'
