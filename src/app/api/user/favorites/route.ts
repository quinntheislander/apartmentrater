import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        apartment: {
          include: {
            reviews: {
              select: { overallRating: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const favoritesWithRatings = favorites.map(fav => ({
      ...fav,
      apartment: {
        ...fav.apartment,
        averageRating: fav.apartment.reviews.length > 0
          ? fav.apartment.reviews.reduce((sum, r) => sum + r.overallRating, 0) / fav.apartment.reviews.length
          : null,
        reviewCount: fav.apartment.reviews.length
      }
    }))

    return NextResponse.json(favoritesWithRatings)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { apartmentId } = await request.json()

    if (!apartmentId) {
      return NextResponse.json(
        { error: 'Apartment ID is required' },
        { status: 400 }
      )
    }

    const apartment = await prisma.apartment.findUnique({
      where: { id: apartmentId }
    })

    if (!apartment) {
      return NextResponse.json(
        { error: 'Apartment not found' },
        { status: 404 }
      )
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_apartmentId: {
          userId: session.user.id,
          apartmentId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Already favorited' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        apartmentId
      }
    })

    return NextResponse.json(favorite)
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}
