import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Package, Clock, Star } from 'lucide-react'
import { menuItems, orders } from '@/data/mock'

export function RestaurantDashboard() {
  const totalOrders = orders.length
  const revenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pending = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing',
  ).length
  const avgRating = 4.7

  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)

  const stat = (label: string, value: string, sub: string, Icon: React.ComponentType<{ size?: number }>) => (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">{label}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
          <p className="text-xs text-text-muted">{sub}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface-muted text-brand">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Restaurant Dashboard</h2>
          <p className="text-text-muted">Manage your restaurant's orders and performance.</p>
        </div>
        <Link to="/restaurant/orders" className="px-4 py-2 rounded-md border border-brand text-brand text-sm font-medium hover:bg-brand hover:text-white transition-colors">
          Manage Orders
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stat('Total Orders', String(totalOrders), 'All time', Package)}
        {stat('Revenue', `$${revenue.toFixed(2)}`, 'This month', DollarSign)}
        {stat('Pending', String(pending), 'In kitchen', Clock)}
        {stat('Rating', String(avgRating), 'Customer avg', Star)}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2 lg:col-span-3">
          <CardHeader className="flex items-center justify-between pb-4">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/restaurant/orders" className="text-sm text-brand hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id} className="border-b border-border hover:bg-surface-muted transition-colors">
                      <td className="py-3 font-medium text-text">{o.id}</td>
                      <td className="py-3 text-text-muted">{o.customerName}</td>
                      <td className="py-3 text-text-muted">{o.items.reduce((n, i) => n + i.quantity, 0)} items</td>
                      <td className="py-3 font-medium text-text">${o.total.toFixed(2)}</td>
                      <td className="py-3">
                        <Badge variant={statusVariant(o.status)}>{o.status.replace('_', ' ')}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex items-center justify-between pb-4">
            <CardTitle>Menu Performance</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-4">
              {menuItems.filter((m) => m.restaurantId === 'r1').map((m) => (
                <div key={m.id} className="flex items-center gap-3 border-b pb-3 last:border-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-border">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-text truncate">{m.name}</span>
                      <Badge variant={m.isAvailable ? 'success' : 'destructive'} className="text-[10px] px-2 py-0.5">
                        {m.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <div className="text-xs text-text-muted">{m.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-text">${m.price.toFixed(2)}</div>
                    <div className="text-xs text-text-muted">★ {m.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function statusVariant(status: string) {
  switch (status) {
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'secondary'
    default:
      return 'default'
  }
}

export function RestaurantOrders() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-text">Order Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">Pending</Button>
          <Button variant="outline" size="sm">Preparing</Button>
          <Button variant="outline" size="sm">Completed</Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-text-muted">
              <th className="pb-3 pr-4 font-medium">Order</th>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Items</th>
              <th className="pb-3 pr-4 font-medium">Total</th>
              <th className="pb-3 pr-4 font-medium">Payment</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border hover:bg-surface-muted transition-colors group">
                <td className="py-3 font-medium text-text">{o.id}</td>
                <td className="py-3 text-text-muted">{o.customerName}</td>
                <td className="py-3 text-text-muted">{o.items.reduce((n, i) => n + i.quantity, 0)} items</td>
                <td className="py-3 font-medium text-text">${o.total.toFixed(2)}</td>
                <td className="py-3">
                  <Badge variant={o.paymentStatus === 'paid' ? 'success' : 'warning'}>{o.paymentStatus}</Badge>
                </td>
                <td className="py-3">
                  <OrderStatusSelect order={o} />
                </td>
                <td className="py-3">
                  <Button variant="outline" size="sm" className="text-[11px] px-2 py-1">
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrderStatusSelect({ order }: { order: (typeof orders)[number] }) {
  const [status, setStatus] = React.useState(order.status)
  const options: { value: string; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
  ]
  return (
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value as any)}
      className="w-full h-9 rounded-md border border-border bg-surface px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function KitchenPage() {
  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing',
  )
  const completedOrders = orders.filter(
    (o) => o.status === 'ready' || o.status === 'out_for_delivery' || o.status === 'delivered',
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Kitchen</h2>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" /> Active
          </span>
          <span className="font-bold text-text">{activeOrders.length}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {activeOrders.length ? (
          activeOrders.map((o) => (
            <KitchenCard key={o.id} order={o} />
          ))
        ) : (
          <div className="col-span-3 text-center py-20 text-text-muted">
            No active orders in the kitchen.
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {completedOrders.length ? (
          completedOrders.map((o) => (
            <KitchenCard key={o.id} order={o} completed />
          ))
        ) : (
          <div className="col-span-3 text-center py-20 text-text-muted">
            No completed orders.
          </div>
        )}
      </div>
    </div>
  )
}

function KitchenCard({ order, completed }: { order: (typeof orders)[number]; completed?: boolean }) {
  return (
    <Card className={`${completed ? 'border-green-200 bg-green-50' : ''} p-6 relative`}>
      {completed && (
        <span className="absolute top-3 right-3 text-xs font-bold text-success uppercase tracking-wider">
          Completed
        </span>
      )}
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-text">{order.id}</span>
        <span className="text-xs font-bold border rounded-full px-2 py-0.5 {completed ? 'text-success border-green-200 bg-green-100' : 'text-brand border-brand/20 bg-brand/10'}">
          {order.status.replace('_', ' ')}
        </span>
      </div>
      <div className="mb-4 text-text-muted">{order.customerName}</div>
      <div className="space-y-2 mb-4">
        {order.items.map((i) => (
          <div key={i.menuItem.id} className="flex justify-between text-sm">
            <span className="text-text">{i.menuItem.name}</span>
            <span className="font-medium">{i.quantity}×</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-text-muted mb-4">
        <span className="font-medium">Time:</span>{' '}
        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      {!completed && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            Start
          </Button>
          <Button className="flex-1" onClick={() => {}}>
            Mark Ready
          </Button>
        </div>
      )}
    </Card>
  )
}
