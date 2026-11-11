import { Link } from 'react-router-dom'
import { restaurants } from '@/data/mock'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Clock, DollarSign } from 'lucide-react'

export function HomePage() {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl bg-brand/10 p-8 md:p-12 border border-brand/20">
        <h2 className="text-3xl font-bold text-text">Hungry?</h2>
        <p className="mt-2 text-text-muted">Order from the best restaurants in your city. Fast delivery, easy checkout.</p>
        <div className="mt-6 flex items-center gap-3">
          <Link to="/restaurants" className="px-5 py-2.5 text-sm font-medium rounded-md border border-brand text-brand hover:bg-brand hover:text-white transition-colors">
            Browse Restaurants
          </Link>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-text">Popular Near You</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {restaurants.map((r) => (
          <Card key={r.id} className="hover:shadow-lg transition-shadow">
            <div className="relative overflow-hidden rounded-lg h-48">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
              <Badge variant={r.isOpen ? 'success' : 'destructive'} className="absolute top-3 left-3">
                {r.isOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
            <CardContent className="pb-6">
              <CardHeader>
                <CardTitle className="text-lg">{r.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                  <Star size={16} className="text-warning" />
                  <span>{r.rating}</span>
                  <span className="mx-1">·</span>
                  <Clock size={16} />
                  <span>{r.deliveryTime}</span>
                  <span className="mx-1">·</span>
                  <DollarSign size={16} />
                  <span>${r.deliveryFee.toFixed(2)} delivery</span>
                </div>
              </CardHeader>
              <p className="text-sm text-text-muted line-clamp-2">{r.description}</p>
              <div className="mt-4 flex gap-1">
                {r.categories.map((c) => (
                  <Badge key={c} variant="outline" className="text-[10px] px-2 py-1">
                    {c}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
