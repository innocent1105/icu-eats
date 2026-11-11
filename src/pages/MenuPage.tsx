import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { restaurants, menuItems } from '@/data/mock'
import { useMenuItem } from '@/hooks/useMenuItem'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Clock, MapPin, Plus } from 'lucide-react'

export function MenuPage() {
  const { id } = useParams<{ id: string }>()
  const [category, setCategory] = useState<string>('All')

  const restaurant = restaurants.find((r) => r.id === id)
  const items = useMemo(
    () => menuItems.filter((m) => m.restaurantId === id),
    [id],
  )
  const filtered = useMemo(
    () => (category === 'All' ? items : items.filter((i: typeof items[number]) => i.category === category)),
    [items, category],
  )

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((i: typeof items[number]) => i.category)))], [items])

  if (!restaurant) return <div className="text-center py-20 text-text-muted">Restaurant not found.</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-shrink-0 w-48 h-48 rounded-2xl overflow-hidden border border-border">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-text">{restaurant.name}</h1>
            <Badge variant={restaurant.isOpen ? 'success' : 'destructive'} className="px-3 py-1">
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
          <p className="text-text-muted">{restaurant.description}</p>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Star size={16} className="text-warning" />
            <span className="font-medium">{restaurant.rating}</span>
            <span className="mx-1">·</span>
            <Clock size={14} />
            <span>{restaurant.deliveryTime}</span>
            <span className="mx-1">·</span>
            <MapPin size={14} />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex gap-2">
        {categories.map((c: string) => (
              <Badge key={c} variant="outline" className="px-2.5 py-1 cursor-pointer hover:bg-surface-muted" onClick={() => setCategory(c)}>
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
              category === c ? 'bg-brand text-white border-brand' : 'bg-surface text-text border-border hover:bg-surface-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-text-muted">No items in this category.</div>
        )}
      </div>
    </div>
  )
}

function MenuItemCard({ item }: { item: (typeof menuItems)[number] }) {
  const { inCart, quantity, addToCart, increment, decrement } = useMenuItem(item)

  return (
    <Card className="hover:shadow-lg transition-shadow group relative">
      <div className="relative overflow-hidden rounded-lg h-48">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">Unavailable</span>
          </div>
        )}
      </div>
      <CardContent className="pb-6">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <span className="font-semibold">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-text-muted line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
          <Badge variant="outline" className="px-2 py-0.5 text-[10px]">{item.category}</Badge>
          {item.isVegetarian && <span className="flex items-center gap-1">🌱 Vegetarian</span>}
          {item.rating && (
            <span className="flex items-center gap-1">
              <Star size={12} className="text-warning" />
              {item.rating}
            </span>
          )}
        </div>
        {item.isAvailable ? (
          inCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={decrement}
                className="w-8 h-8 rounded-md border border-border bg-surface flex items-center justify-center text-text hover:bg-surface-muted"
              >
                <span className="text-xs font-bold">-</span>
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={increment}
                className="w-8 h-8 rounded-md border border-brand bg-brand text-white flex items-center justify-center text-xs font-bold hover:bg-brand-dark"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <Button
              onClick={addToCart}
              className="w-full py-2 text-sm"
              disabled={!item.isAvailable}
            >
              Add to Cart
            </Button>
          )
        ) : (
          <button className="w-full py-2 rounded-md border border-border bg-surface-muted text-text-muted text-sm cursor-not-allowed">
            Unavailable
          </button>
        )}
      </CardContent>
    </Card>
  )
}
