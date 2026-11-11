import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { LogOut, User, ShoppingCart, Home, Building2, ChefHat, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const routes = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/restaurants', label: 'Restaurants', icon: Building2 },
  { path: '/cart', label: 'Cart', icon: ShoppingCart },
  { path: '/orders', label: 'My Orders', icon: Package },
]

export function Navbar() {
  const { logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">ie</div>
            <span className="text-xl font-bold text-text tracking-tight">icu<span className="text-brand">eats</span></span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive ? 'bg-brand/10 text-brand border border-brand/20' : 'text-text-muted hover:text-text hover:bg-surface-muted',
                  )
                }
              >
                <Icon size={18} />
                {route.label}
              </NavLink>
            )
          })}
          <NavLink
            to="/cart"
            className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors text-text-muted hover:text-text hover:bg-surface-muted"
          >
            <ShoppingCart size={18} />
            Cart
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-[10px] font-bold">
                {itemCount}
              </span>
            )}
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}

export function CustomerNavbar() {
  const { itemCount } = useCart()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">ie</div>
          <span className="text-xl font-bold text-text tracking-tight">icu<span className="text-brand">eats</span></span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive ? 'bg-brand/10 text-brand border border-brand/20' : 'text-text-muted hover:text-text hover:bg-surface-muted',
                  )
                }
              >
                <Icon size={18} />
                {route.label}
              </NavLink>
            )
          })}
          <NavLink
            to="/cart"
            className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors text-text-muted hover:text-text hover:bg-surface-muted"
          >
            <ShoppingCart size={18} />
            Cart
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-[10px] font-bold">
                {itemCount}
              </span>
            )}
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <User size={20} />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export function RestaurantNavbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const restaurantRoutes = [
    { path: '/restaurant/dashboard', label: 'Dashboard', icon: Home },
    { path: '/restaurant/orders', label: 'Orders', icon: Package },
    { path: '/restaurant/kitchen', label: 'Kitchen', icon: ChefHat },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center text-white font-bold">ie</div>
          <span className="text-xl font-bold text-text tracking-tight">icu<span className="text-brand">eats</span></span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {restaurantRoutes.map((route) => {
            const Icon = route.icon
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive ? 'bg-brand/10 text-brand border border-brand/20' : 'text-text-muted hover:text-text hover:bg-surface-muted',
                  )
                }
              >
                <Icon size={18} />
                {route.label}
              </NavLink>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
