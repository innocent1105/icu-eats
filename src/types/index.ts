export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'restaurant'
  avatar?: string
  phone?: string
  address?: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  categories: string[]
  isOpen: boolean
  address: string
  ownerId?: string
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
  isVegetarian: boolean
  rating?: number
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  specialInstructions?: string
}

export interface Order {
  id: string
  userId: string
  restaurantId: string
  restaurantName: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'failed'
  createdAt: string
  address: string
  customerName: string
  customerPhone: string
}
