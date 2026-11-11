import { Link, useSearchParams } from 'react-router-dom'
import { restaurants } from '@/data/mock'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Clock, DollarSign, MapPin, Search } from 'lucide-react'

export function RestaurantsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.categories.some((c) => c.toLowerCase().includes(query.toLowerCase())),
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              const sp = new URLSearchParams(searchParams)
              sp.set('q', e.currentTarget.value)
              history.pushState(null, '', `?${sp.toString()}`)
            }}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-surface text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Search restaurants or cuisine..."
          />
        </div>
        <Link to="/" className="px-4 py-2 text-sm font-medium rounded-md border border-border bg-surface text-text hover:bg-surface-muted">
          Back to Home
        </Link>
      </div>

      <p className="text-sm text-text-muted">
        {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} found
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((r) => (
            <Card key={r.id} className="hover:shadow-lg transition-shadow group">
              <div className="relative overflow-hidden rounded-lg h-48">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <Badge variant={r.isOpen ? 'success' : 'destructive'} className="absolute top-3 left-3">
                  {r.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
              <CardContent className="pb-6">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{r.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-warning" />
                    <span className="font-medium">{r.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                  <MapPin size={14} />
                  <span>{r.address}</span>
                  <span className="mx-1">·</span>
                  <Clock size={14} />
                  <span>{r.deliveryTime}</span>
                  <span className="mx-1">·</span>
                  <DollarSign size={14} />
                  <span>${r.deliveryFee.toFixed(2)} delivery</span>
                </div>
                <div className="flex gap-1 mb-4">
                  {r.categories.map((c) => (
                    <Badge key={c} variant="outline" className="text-[10px] px-2 py-1">
                      {c}
                    </Badge>
                  ))}
                </div>
                <Link to={`/restaurants/${r.id}`} className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md border border-brand text-brand text-sm font-medium hover:bg-brand hover:text-white transition-colors">
                  View Menu
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-text-muted">
            No restaurants match your search.
          </div>
        )}
      </div>
    </div>
  )
}
