import { Outlet } from 'react-router-dom'
import { RestaurantNavbar } from './Navbar'
import { Footer } from './Footer'

export function RestaurantLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <RestaurantNavbar />
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
