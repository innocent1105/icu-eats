import { useCart } from '@/context/CartContext'
import { MenuItem } from '@/types'

export function useMenuItem(menuItem: MenuItem) {
  const { items, addItem, removeItem, updateQuantity, setInstructions } = useCart()
  const cartItem = items.find((i) => i.menuItem.id === menuItem.id)
  const inCart = !!cartItem
  const quantity = cartItem?.quantity ?? 0

  return {
    inCart,
    quantity,
    addToCart: () => addItem(menuItem),
    removeFromCart: () => removeItem(menuItem.id),
    increment: () => updateQuantity(menuItem.id, quantity + 1),
    decrement: () => updateQuantity(menuItem.id, quantity - 1),
    setInstructions: (instructions: string) => setInstructions(menuItem.id, instructions),
    instructions: cartItem?.specialInstructions,
  }
}
