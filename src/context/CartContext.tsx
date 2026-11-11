import { createContext, useContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { MenuItem, CartItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  addItem: (menuItem: MenuItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  setInstructions: (menuItemId: string, instructions: string) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  isEmpty: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id)
      if (existing) {
        return prev.map((i) => (i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { menuItem, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId))
  }, [])

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId))
      return
    }
    setItems((prev) => prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i)))
  }, [])

  const setInstructions = useCallback((menuItemId: string, instructions: string) => {
    setItems((prev) => prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, specialInstructions: instructions } : i)))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0), [items])
  const isEmpty = items.length === 0

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, setInstructions, clearCart, itemCount, subtotal, isEmpty }),
    [items, addItem, removeItem, updateQuantity, setInstructions, clearCart, itemCount, subtotal, isEmpty],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
