import Link from 'next/link'
import type { Metadata } from 'next'
import { requireAdminPage } from '@/lib/admin'

// No title: non-admins get a 404 here, and the tab shouldn't say "Admin"
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/apartments', label: 'Apartments' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Pages check too (see requireAdminPage); this keeps the chrome hidden from non-admins
  await requireAdminPage()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
        <nav className="flex gap-1 bg-white rounded-lg shadow-sm p-1">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  )
}
