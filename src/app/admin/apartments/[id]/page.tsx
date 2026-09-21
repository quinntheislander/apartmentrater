import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { prisma } from '@/lib/db'
import { requireAdminPage } from '@/lib/admin'
import ApartmentForm from '@/components/admin/ApartmentForm'
import ConfirmDeleteButton from '@/components/admin/ConfirmDeleteButton'

export default async function AdminEditApartmentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage()
  const { id } = await params

  const apartment = await prisma.apartment.findUnique({
    where: { id },
    include: { _count: { select: { reviews: true, favorites: true } } },
  })
  if (!apartment) notFound()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Link href="/admin/apartments" className="text-sm text-blue-600 hover:underline">← Apartments</Link>
        <div className="flex items-center gap-3 mt-2">
          <h2 className="text-xl font-semibold text-gray-900">{apartment.name}</h2>
          <Link
            href={`/apartments/${apartment.id}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            target="_blank"
          >
            View page <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {apartment._count.reviews} reviews · {apartment._count.favorites} favorites
        </p>
        <div className="mt-6">
          <ApartmentForm
            apartmentId={apartment.id}
            initial={{
              name: apartment.name,
              address: apartment.address,
              city: apartment.city,
              zipCode: apartment.zipCode,
              propertyType: apartment.propertyType,
              unitCount: apartment.unitCount?.toString() ?? '',
              yearBuilt: apartment.yearBuilt?.toString() ?? '',
              description: apartment.description ?? '',
              amenities: amenityList(apartment.amenities).join(', '),
              imageUrl: apartment.imageUrl ?? '',
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
        <h3 className="font-semibold text-gray-900 mb-3">Delete apartment</h3>
        <ConfirmDeleteButton
          endpoint={`/api/admin/apartments/${apartment.id}`}
          confirmText={apartment.name}
          label="Delete apartment"
          warning={`This permanently deletes the apartment along with its ${apartment._count.reviews} reviews and ${apartment._count.favorites} favorites. It can't be undone.`}
          redirectTo="/admin/apartments"
        />
      </div>
    </div>
  )
}

function amenityList(amenities: string | null): string[] {
  if (!amenities) return []
  try {
    const parsed = JSON.parse(amenities)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}
