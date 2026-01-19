import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const apartment = await prisma.apartment.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!apartment) {
      return NextResponse.json(
        { error: 'Apartment not found' },
        { status: 404 }
      )
    }

    const reviewCount = apartment.reviews.length
    const avgRating = reviewCount > 0
      ? apartment.reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
      : null

    // Opinion-First rating categories (subjective impressions)
    const categoryAverages = reviewCount > 0 ? {
      noiseLevel: apartment.reviews.reduce((sum, r) => sum + r.noiseLevel, 0) / reviewCount,
      naturalLight: apartment.reviews.reduce((sum, r) => sum + r.naturalLight, 0) / reviewCount,
      generalVibe: apartment.reviews.reduce((sum, r) => sum + r.generalVibe, 0) / reviewCount
    } : null

    const recommendPercent = reviewCount > 0
      ? (apartment.reviews.filter(r => r.wouldRecommend).length / reviewCount) * 100
      : null

    return NextResponse.json({
      ...apartment,
      averageRating: avgRating,
      reviewCount,
      categoryAverages,
      recommendPercent
    })
  } catch (error) {
    console.error('Error fetching apartment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch apartment' },
      { status: 500 }
    )
  }
}
