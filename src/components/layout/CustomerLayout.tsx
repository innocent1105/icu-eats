import { Outlet } from 'react-router-dom'
import { CustomerNavbar } from './Navbar'
import { Footer } from './Footer'

export function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerNavbar />
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
