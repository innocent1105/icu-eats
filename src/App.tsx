import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { Layout } from '@/components/layout/Layout'
import { RestaurantLayout } from '@/components/layout/RestaurantLayout'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RestaurantsPage } from '@/pages/RestaurantsPage'
import { MenuPage } from '@/pages/MenuPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { RestaurantDashboard } from '@/pages/restaurant'
import { RestaurantOrders } from '@/pages/restaurant'
import { KitchenPage } from '@/pages/restaurant'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="restaurants" element={<RestaurantsPage />} />
              <Route path="restaurants/:id" element={<MenuPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>

            <Route element={<RestaurantLayout />}>
              <Route path="restaurant/dashboard" element={<RestaurantDashboard />} />
              <Route path="restaurant/orders" element={<RestaurantOrders />} />
              <Route path="restaurant/kitchen" element={<KitchenPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
