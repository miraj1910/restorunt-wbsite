'use client'

import { useState } from 'react'
import { AuthProvider } from '@/lib/admin/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/reservations': 'Reservations',
  '/admin/menu': 'Menu',
  '/admin/orders': 'Orders',
  '/admin/revenue': 'Revenue',
  '/admin/employees': 'Employees',
  '/admin/inventory': 'Inventory',
  '/admin/customers': 'Customers',
  '/admin/reviews': 'Reviews',
  '/admin/hall': 'Hall Management',
  '/admin/settings': 'Settings',
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Admin'

  return (
    <div className="min-h-screen bg-ink">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <main className="pt-20 px-4 md:px-6 pb-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
