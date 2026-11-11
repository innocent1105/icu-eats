import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/input'
import { Mail, Lock, User as UserIcon, Phone, MapPin, Building2 } from 'lucide-react'

export function RegisterPage() {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [role, setRole] = useState<'customer' | 'restaurant'>('customer')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget as HTMLFormElement)
    const data = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      password: form.get('password') as string,
      role,
      phone: form.get('phone') as string,
      address: form.get('address') as string,
    }
    setError('')
    register(data)
    navigate(data.role === 'restaurant' ? '/restaurant/dashboard' : '/restaurants')
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join ICU Eats as a customer or restaurant partner</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-danger-light p-3 text-danger text-sm border border-danger/20">
              {error}
            </div>
          )}
          <div className="mb-6 flex bg-surface-muted rounded-lg p-1">
            <button
              onClick={() => setRole('customer')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                role === 'customer' ? 'bg-white shadow-sm text-brand' : 'text-text-muted hover:text-text'
              }`}
            >
              <UserIcon size={16} className="mr-2" />
              Customer
            </button>
            <button
              onClick={() => setRole('restaurant')}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                role === 'restaurant' ? 'bg-white shadow-sm text-brand' : 'text-text-muted hover:text-text'
              }`}
            >
              <Building2 size={16} className="mr-2" />
              Restaurant
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <Input id="name" type="text" name="name" required className="pl-10" placeholder="Jane Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <Input id="email" type="email" name="email" required className="pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <Input id="password" type="password" name="password" required className="pl-10" minLength={6} placeholder="••••••••" />
              </div>
            </div>
            {role === 'customer' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <Input id="phone" type="tel" name="phone" className="pl-10" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <Input id="address" type="text" name="address" className="pl-10" placeholder="123 Main St, Apt 4" />
                  </div>
                </div>
              </>
            )}
            {role === 'restaurant' && (
              <div className="space-y-2">
                <Label htmlFor="address">Restaurant Address</Label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <Input id="address" type="text" name="address" className="pl-10" placeholder="Restaurant street address" />
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-brand hover:text-brand-dark font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
