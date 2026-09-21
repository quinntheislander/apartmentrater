import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/db'
import { requireAdminPage } from '@/lib/admin'
import AdminSearch from '@/components/admin/AdminSearch'
import AdminPagination from '@/components/admin/AdminPagination'

const PAGE_SIZE = 25

export default async function AdminApartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  await requireAdminPage()
  const { q = '', page = '1' } = await searchParams
  const pageNum = Math.max(1, parseInt(page) || 1)
  const term = q.trim()

  const where: Prisma.ApartmentWhereInput = term
    ? {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { address: { contains: term, mode: 'insensitive' } },
          { zipCode: { startsWith: term } },
        ],
      }
    : {}

  const [apartments, total] = await Promise.all([
    prisma.apartment.findMany({
      where,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        zipCode: true,
        imageUrl: true,
        googlePlaceId: true,
        _count: { select: { reviews: true } },
      },
    }),
    prisma.apartment.count({ where }),
  ])

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <div className="flex-1 max-w-xl">
          <AdminSearch q={term} placeholder="Search by name, address, or ZIP" />
        </div>
        <Link
          href="/admin/apartments/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add apartment
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Address</th>
              <th className="py-2 pr-4 font-medium">Reviews</th>
              <th className="py-2 font-medium">Photo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {apartments.map(apt => (
              <tr key={apt.id} className="hover:bg-gray-50">
                <td className="py-2 pr-4">
                  <Link href={`/admin/apartments/${apt.id}`} className="text-blue-600 hover:underline">
                    {apt.name}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-gray-700">
                  {apt.address}, {apt.city} {apt.zipCode}
                </td>
                <td className="py-2 pr-4 text-gray-700">{apt._count.reviews}</td>
                <td className="py-2 text-gray-500">{photoSource(apt)}</td>
              </tr>
            ))}
            {apartments.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">No apartments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        basePath="/admin/apartments"
        q={term}
        page={pageNum}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        total={total}
      />
    </div>
  )
}

function photoSource(apt: { imageUrl: string | null; googlePlaceId: string | null }) {
  if (apt.imageUrl) return 'Own photo'
  if (apt.googlePlaceId) return 'Google listing'
  if (apt.googlePlaceId === '') return 'Street View / none'
  return 'Not checked yet'
}
