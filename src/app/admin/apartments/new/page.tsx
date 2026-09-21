import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import ApartmentForm from '@/components/admin/ApartmentForm'

export default async function AdminNewApartmentPage() {
  await requireAdminPage()

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <Link href="/admin/apartments" className="text-sm text-blue-600 hover:underline">← Apartments</Link>
      <h2 className="text-xl font-semibold text-gray-900 mt-2 mb-4">Add an apartment</h2>
      <ApartmentForm />
    </div>
  )
}
