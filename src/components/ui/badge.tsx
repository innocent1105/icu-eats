import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-brand text-brand-light text-xs uppercase font-medium',
    secondary: 'bg-surface-muted text-text text-xs uppercase font-medium',
    destructive: 'bg-danger-light text-danger text-xs uppercase font-medium',
    outline: 'border border-border text-text text-xs uppercase font-medium',
    success: 'bg-success-light text-success text-xs uppercase font-medium',
    warning: 'bg-warning-light text-warning text-xs uppercase font-medium',
  }
  return (
    <div ref={ref} className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs uppercase font-medium tracking-wider', variants[variant], className)} {...props} />
  )
})
Badge.displayName = 'Badge'

export { Badge }
