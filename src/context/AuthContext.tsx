import { createContext, useContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => void
  register: (userData: RegisterData) => void
  logout: () => void
  isLoading: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: 'customer' | 'restaurant'
  phone?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback((email: string, _password: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setUser({ id: 'u1', name: email.split('@')[0], email, role: 'customer', avatar: undefined })
      setIsLoading(false)
    }, 600)
  }, [])

  const register = useCallback((data: RegisterData) => {
    setIsLoading(true)
    setTimeout(() => {
      setUser({ id: 'u1', name: data.name, email: data.email, role: data.role, phone: data.phone, address: data.address })
      setIsLoading(false)
    }, 600)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, register, logout, isLoading }),
    [user, login, register, logout, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
