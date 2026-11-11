import React from 'react'
import { useCart } from '@/context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CreditCard, MapPin, CheckCircle2 } from 'lucide-react'

export function CheckoutPage() {
  const { subtotal, isEmpty, clearCart } = useCart()
  const navigate = useNavigate()

  const deliveryFee = 2.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  const [step, setStep] = React.useState<'details' | 'payment' | 'confirmation'>('details')

  const [form, setForm] = React.useState({
    name: '',
    phone: '',
    address: '',
  })

  if (isEmpty) {
    navigate('/cart')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    clearCart()
    setStep('confirmation')
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-success-light flex items-center justify-center text-success">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-text">Order Placed!</h2>
        <p className="text-text-muted mb-6">Your food is on the way. Track it in My Orders.</p>
        <div className="text-sm text-text-muted mb-8">
          <p>Estimated delivery: 35-45 min</p>
          <p>Total paid: ${total.toFixed(2)}</p>
        </div>
        <Button className="w-full" onClick={() => navigate('/orders')}>
          View My Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {step === 'details' && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-bold text-text mb-4">Delivery Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">Full Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">Phone</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">Delivery Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <Button className="w-full py-3" type="submit">
                  Continue to Payment
                </Button>
              </form>
            </div>
          </Card>
        )}
        {step === 'payment' && (
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-bold text-text mb-4">Payment</h2>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">Card Number</label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value="4242 4242 4242 4242"
                      readOnly
                      className="w-full h-10 pl-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">Expiry</label>
                    <input
                      type="text"
                      value="12/30"
                      readOnly
                      className="w-full h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text">CVC</label>
                    <input
                      type="text"
                      value="123"
                      readOnly
                      className="w-full h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                  </div>
                </div>
                <Button className="w-full py-3" type="submit">
                  Place Order
                </Button>
              </form>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-text">Order Summary</h2>
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
            <div className="pt-2 flex items-start gap-3">
              <MapPin size={14} className="mt-1 flex-shrink-0 text-text-muted" />
              <div className="text-sm text-text-muted">
                {form.address || 'Delivery address will be confirmed on next step'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
