import * as React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
  fallback?: string
}
const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(({ className, src, alt, fallback, ...props }, ref) => (
  <img
    ref={ref}
    src={src}
    alt={alt}
    className={cn(
      'overflow-hidden rounded-full object-cover',
      className,
    )}
    {...props}
    onError={(e) => {
      e.currentTarget.src = fallback || 'https://ui-avatars.com/api/?name=User&background=random'
    }}
  />
))
Avatar.displayName = 'Avatar'

export { Avatar }
