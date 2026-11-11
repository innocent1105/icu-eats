import React from 'react'
import { useCart } from '@/context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { CartItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Plus, Minus, CreditCard, MapPin } from 'lucide-react'

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, setInstructions, subtotal, isEmpty } = useCart()
  const navigate = useNavigate()

  if (isEmpty) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="mx-auto mb-6 rounded-full bg-surface-muted p-4 text-text-muted">
          <CreditCard size={48} />
        </div>
        <h2 className="text-2xl font-bold text-text">Your cart is empty</h2>
        <p className="text-text-muted">Add some delicious food to get started.</p>
        <Link to="/restaurants" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-brand text-brand text-sm font-medium hover:bg-brand hover:text-white transition-colors">
          Browse Restaurants
        </Link>
      </div>
    )
  }

  const deliveryFee = 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  return (
    <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-4">
      <div className="lg:col-span-3 space-y-4">
        <h2 className="text-2xl font-bold text-text">Your Cart</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <CartRow key={item.menuItem.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem} setInstructions={setInstructions} />
          ))}
        </div>
        <div className="pt-4 border-t border-border">
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-danger hover:text-danger/90"
          >
            <Trash2 size={16} /> Clear Cart
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Delivery</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-text pt-2 border-t border-border">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
              <MapPin size={14} />
              <span>Est. delivery: 30-40 min</span>
            </div>
            <Button className="w-full py-3 text-lg" onClick={() => navigate('/checkout')}>
              Checkout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

interface CartRowProps {
  item: CartItem
  updateQuantity: (menuItemId: string, quantity: number) => void
  removeItem: (menuItemId: string) => void
  setInstructions: (menuItemId: string, instructions: string) => void
}

function CartRow({ item, updateQuantity, removeItem, setInstructions }: CartRowProps) {
  const { menuItem, quantity, specialInstructions } = item
  const [editing, setEditing] = React.useState(false)

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border">
          <img src={menuItem.image} alt={menuItem.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex justify-between">
            <h3 className="font-medium text-text truncate">{menuItem.name}</h3>
            <span className="font-semibold">${(menuItem.price * quantity).toFixed(2)}</span>
          </div>
          <p className="text-xs text-text-muted line-clamp-1">{menuItem.description}</p>
          {specialInstructions && (
            <p className="text-xs text-brand italic">Note: {specialInstructions}</p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(menuItem.id, quantity - 1)}
            className="w-8 h-8 rounded-md border border-border bg-surface flex items-center justify-center text-text hover:bg-surface-muted"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => updateQuantity(menuItem.id, quantity + 1)}
            className="w-8 h-8 rounded-md border border-brand bg-brand text-white flex items-center justify-center text-xs font-bold hover:bg-brand-dark"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          onClick={() => removeItem(menuItem.id)}
          className="text-xs text-text-muted hover:text-danger"
        >
          Remove
        </button>
      </div>
      {editing ? (
        <div className="mt-3 pt-3 border-t border-border">
          <label className="block text-xs font-medium text-text mb-1">Special instructions</label>
          <textarea
            defaultValue={specialInstructions ?? ''}
            className="w-full h-16 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            onBlur={(e) => {
              setInstructions(menuItem.id, e.currentTarget.value)
              setEditing(false)
            }}
          />
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-brand hover:text-brand-dark underline decoration-brand/30 hover:decoration-brand"
        >
          Add a note
        </button>
      )}
    </Card>
  )
}
