import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  validateJacksonvilleAddress,
  JACKSONVILLE_CITY,
  JACKSONVILLE_STATE
} from '@/lib/geo'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const area = searchParams.get('area')
    const zipCode = searchParams.get('zipCode')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Always filter to Jacksonville, FL (pilot market)
    const where: Record<string, unknown> = {
      city: JACKSONVILLE_CITY,
      state: JACKSONVILLE_STATE
    }

    // Filter by zip code if provided
    if (zipCode) {
      where.zipCode = zipCode
    }

    // Filter by area/neighborhood (stored in address or description)
    if (area && area !== 'All Areas') {
      where.OR = [
        { address: { contains: area } },
        { description: { contains: area } }
      ]
    }

    // Search by name or address
    if (search) {
      // Combine with existing OR conditions if any
      const searchConditions = [
        { name: { contains: search } },
        { address: { contains: search } }
      ]

      if (where.OR) {
        // If we already have OR conditions (from area), wrap in AND
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
    type OrderByType = { createdAt?: 'desc' | 'asc'; averageRating?: { sort: 'desc' | 'asc'; nulls: 'last' }; reviewCount?: 'desc' | 'asc' }
    let orderBy: OrderByType = { createdAt: 'desc' }

    if (sort === 'rating') {
      orderBy = { averageRating: { sort: 'desc', nulls: 'last' } }
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
            select: {
              overallRating: true
            }
          }
        },
        orderBy
      }),
      prisma.apartment.count({ where })
    ])

    const apartmentsWithRatings = apartments.map(apt => {
      const avgRating = apt.reviews.length > 0
        ? apt.reviews.reduce((sum, r) => sum + r.overallRating, 0) / apt.reviews.length
        : null

      return {
        ...apt,
        averageRating: avgRating,
        reviewCount: apt.reviews.length,
        reviews: undefined
      }
    })

    return NextResponse.json({
      apartments: apartmentsWithRatings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching apartments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch apartments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate Jacksonville area (pilot market restriction)
    const geoError = validateJacksonvilleAddress({
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      latitude: data.latitude,
      longitude: data.longitude
    })

    if (geoError) {
      return NextResponse.json(
        { error: geoError },
        { status: 400 }
      )
    }

    // Force Jacksonville, FL for consistency
    const apartment = await prisma.apartment.create({
      data: {
        name: data.name,
        address: data.address,
        city: JACKSONVILLE_CITY,
        state: JACKSONVILLE_STATE,
        zipCode: data.zipCode,
        description: data.description,
        propertyType: data.propertyType || 'apartment',
        unitCount: data.unitCount,
        yearBuilt: data.yearBuilt,
        amenities: data.amenities ? JSON.stringify(data.amenities) : null,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude
      }
    })

    return NextResponse.json(apartment)
  } catch (error) {
    console.error('Error creating apartment:', error)
    return NextResponse.json(
      { error: 'Failed to create apartment' },
      { status: 500 }
    )
  }
}
