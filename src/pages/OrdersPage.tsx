import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Package } from 'lucide-react'

const orders = [
  {
    id: 'ORD-1001',
    restaurantName: 'Pasta Paradise',
    items: [
      { name: 'Spaghetti Carbonara', qty: 1, price: 16.99 },
      { name: 'Tiramisu', qty: 1, price: 8.99 },
    ],
    subtotal: 25.98,
    deliveryFee: 2.99,
    tax: 2.08,
    total: 31.05,
    status: 'delivered' as const,
    paymentStatus: 'paid' as const,
    createdAt: '2026-11-08T18:30:00Z',
    address: '123 Main St, Apt 4',
    customerName: 'Jane Doe',
    customerPhone: '+1 (555) 000-0000',
  },
  {
    id: 'ORD-1002',
    restaurantName: 'Burger Block',
    items: [{ name: 'Smash Burger', qty: 2, price: 12.99 }, { name: 'Loaded Fries', qty: 1, price: 6.99 }],
    subtotal: 32.97,
    deliveryFee: 1.99,
    tax: 2.64,
    total: 37.6,
    status: 'out_for_delivery' as const,
    paymentStatus: 'paid' as const,
    createdAt: '2026-11-10T12:15:00Z',
    address: '123 Main St, Apt 4',
    customerName: 'Jane Doe',
    customerPhone: '+1 (555) 000-0000',
  },
  {
    id: 'ORD-1003',
    restaurantName: 'Sushi Zen',
    items: [{ name: 'Salmon Nigiri', qty: 2, price: 9.99 }, { name: 'Spicy Tuna Roll', qty: 1, price: 13.99 }],
    subtotal: 33.97,
    deliveryFee: 4.99,
    tax: 2.72,
    total: 41.68,
    status: 'preparing' as const,
    paymentStatus: 'paid' as const,
    createdAt: '2026-11-11T07:45:00Z',
    address: '123 Main St, Apt 4',
    customerName: 'Jane Doe',
    customerPhone: '+1 (555) 000-0000',
  },
]

const statusLabels: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  preparing: { label: 'Preparing', variant: 'default' },
  ready: { label: 'Ready for Pickup', variant: 'default' },
  out_for_delivery: { label: 'Out for Delivery', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'secondary' },
}

export function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-text">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order }: { order: typeof orders[number] }) {
  const status = statusLabels[order.status]
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center text-brand">
              <Package size={20} />
            </div>
            <div>
              <div className="font-bold text-text">{order.id}</div>
              <div className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border">
            <img src="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&q=80" alt={order.restaurantName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-text truncate">{order.restaurantName}</div>
            <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
              <Clock size={12} />
              <span>{order.items.reduce((n, i) => n + i.qty, 0)} items</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-text">${order.total.toFixed(2)}</div>
            <div className="text-xs text-text-muted">{order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {order.items.map((item) => (
            <div key={item.name} className="flex justify-between border-b pb-1">
              <span className="text-text-muted">{item.name} × {item.qty}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
