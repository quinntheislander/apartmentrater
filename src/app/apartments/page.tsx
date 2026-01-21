import { Suspense } from 'react'
import SearchBar from '@/components/SearchBar'
import ApartmentCard from '@/components/ApartmentCard'
import SortDropdown from '@/components/SortDropdown'
import { prisma } from '@/lib/db'
import { staticMetadata } from '@/lib/metadata'
import { ApartmentListSchema } from '@/components/StructuredData'
import { JACKSONVILLE_CITY, JACKSONVILLE_STATE } from '@/lib/geo'

export const metadata = staticMetadata.apartments

interface SearchParams {
  search?: string
  area?: string
  zipCode?: string
  page?: string
  sort?: string
}

interface ApartmentWithRating {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  imageUrl: string | null
  averageRating: number | null
  reviewCount: number
}

async function getApartments(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1')
  const sort = searchParams.sort || 'newest'
  const limit = 12
  const skip = (page - 1) * limit

  // Always filter to Jacksonville, FL (pilot market)
  // Note: City/state should match exactly as stored in the database
  const where: Record<string, unknown> = {
    city: JACKSONVILLE_CITY,
    state: JACKSONVILLE_STATE
  }

  // Filter by zip code if provided
  if (searchParams.zipCode) {
    where.zipCode = searchParams.zipCode
  }

  // Filter by area/neighborhood
  // SQLite's LIKE (used by contains) is case-insensitive for ASCII by default
  if (searchParams.area && searchParams.area !== 'All Areas') {
    where.OR = [
      { address: { contains: searchParams.area } },
      { description: { contains: searchParams.area } }
    ]
  }

  // Search by name or address
  // SQLite's LIKE (used by contains) is case-insensitive for ASCII by default
  if (searchParams.search) {
    const searchConditions = [
      { name: { contains: searchParams.search } },
      { address: { contains: searchParams.search } }
    ]

    if (where.OR) {
      // Combine with existing OR conditions from area
      where.AND = [
        { OR: where.OR },
        { OR: searchConditions }
      ]
      delete where.OR
    } else {
      where.OR = searchConditions
    }
  }

  // Determine sort order
  // Note: SQLite doesn't support nulls positioning, so we use simple desc/asc
  type OrderByType = { createdAt?: 'desc' | 'asc'; averageRating?: 'desc' | 'asc'; reviewCount?: 'desc' | 'asc' }
  let orderBy: OrderByType = { createdAt: 'desc' }

  if (sort === 'rating') {
    orderBy = { averageRating: 'desc' }
  } else if (sort === 'reviews') {
    orderBy = { reviewCount: 'desc' }
  }

  const [apartments, total] = await Promise.all([
    prisma.apartment.findMany({
      where,
      skip,
      take: limit,
      include: {
        reviews: {
          select: { overallRating: true }
        }
      },
      orderBy
    }),
    prisma.apartment.count({ where })
  ])

  const apartmentsWithRating: ApartmentWithRating[] = apartments.map((apt: typeof apartments[number]) => ({
    id: apt.id,
    name: apt.name,
    address: apt.address,
    city: apt.city,
    state: apt.state,
    zipCode: apt.zipCode,
    propertyType: apt.propertyType,
    imageUrl: apt.imageUrl,
    averageRating: apt.reviews.length > 0
      ? apt.reviews.reduce((sum: number, r: { overallRating: number }) => sum + r.overallRating, 0) / apt.reviews.length
      : null,
    reviewCount: apt.reviews.length
  }))

  return {
    apartments: apartmentsWithRating,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export default async function ApartmentsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  let apartments: ApartmentWithRating[] = []
  let total = 0
  let page = 1
  let totalPages = 1
  let dbError: string | null = null

  try {
    const result = await getApartments(params)
    apartments = result.apartments
    total = result.total
    page = result.page
    totalPages = result.totalPages
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Unknown database error'
    console.error('Database error:', error)
  }

  if (dbError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Find Apartments</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Database Connection Error</h2>
          <p className="text-red-700 text-sm font-mono break-all">{dbError}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ApartmentListSchema apartments={apartments} listName="Apartment Search Results" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Find Apartments</h1>

        <Suspense fallback={<div className="bg-white p-4 rounded-lg shadow-md h-20" />}>
          <SearchBar />
        </Suspense>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              {total} apartments found in Jacksonville, FL
              {params.zipCode && ` (${params.zipCode})`}
              {params.area && params.area !== 'All Areas' && ` - ${params.area}`}
            </p>
            <Suspense fallback={<div className="w-32 h-10" />}>
              <SortDropdown />
            </Suspense>
          </div>

          {apartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apartment: ApartmentWithRating) => (
                <ApartmentCard key={apartment.id} apartment={apartment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No apartments found</p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search criteria or add a new apartment
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="flex justify-center items-center gap-2 mt-8" aria-label="Pagination">
              {/* Previous button */}
              {page > 1 && (
                <a
                  href={`/apartments?page=${page - 1}${params.search ? `&search=${params.search}` : ''}${params.zipCode ? `&zipCode=${params.zipCode}` : ''}${params.area ? `&area=${params.area}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                  className="px-3 py-2 rounded bg-white text-gray-700 hover:bg-gray-100"
                  aria-label="Previous page"
                >
                  &laquo;
                </a>
              )}

              {/* First page */}
              {page > 2 && (
                <>
                  <a
                    href={`/apartments?page=1${params.search ? `&search=${params.search}` : ''}${params.zipCode ? `&zipCode=${params.zipCode}` : ''}${params.area ? `&area=${params.area}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                    className="px-4 py-2 rounded bg-white text-gray-700 hover:bg-gray-100"
                    aria-label="Page 1"
                  >
                    1
                  </a>
                  {page > 3 && <span className="text-gray-400">...</span>}
                </>
              )}

              {/* Pages around current */}
              {[page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages).map((p) => (
                <a
                  key={p}
                  href={`/apartments?page=${p}${params.search ? `&search=${params.search}` : ''}${params.zipCode ? `&zipCode=${params.zipCode}` : ''}${params.area ? `&area=${params.area}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                  className={`px-4 py-2 rounded ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </a>
              ))}

              {/* Last page */}
              {page < totalPages - 1 && (
                <>
                  {page < totalPages - 2 && <span className="text-gray-400">...</span>}
                  <a
                    href={`/apartments?page=${totalPages}${params.search ? `&search=${params.search}` : ''}${params.zipCode ? `&zipCode=${params.zipCode}` : ''}${params.area ? `&area=${params.area}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                    className="px-4 py-2 rounded bg-white text-gray-700 hover:bg-gray-100"
                    aria-label={`Page ${totalPages}`}
                  >
                    {totalPages}
                  </a>
                </>
              )}

              {/* Next button */}
              {page < totalPages && (
                <a
                  href={`/apartments?page=${page + 1}${params.search ? `&search=${params.search}` : ''}${params.zipCode ? `&zipCode=${params.zipCode}` : ''}${params.area ? `&area=${params.area}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                  className="px-3 py-2 rounded bg-white text-gray-700 hover:bg-gray-100"
                  aria-label="Next page"
                >
                  &raquo;
                </a>
              )}

              {/* Page info */}
              <span className="ml-4 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
            </nav>
          )}
        </div>
      </div>
    </>
  )
}
