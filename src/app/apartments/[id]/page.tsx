import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, Home, Star, ThumbsUp, PenSquare } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import StarRating from '@/components/StarRating'
import ReviewCard from '@/components/ReviewCard'
import AmenitiesList from '@/components/AmenitiesList'
import ApartmentReviewsSection from '@/components/ApartmentReviewsSection'
import FavoriteButton from '@/components/FavoriteButton'
import { createApartmentMetadata } from '@/lib/metadata'
import { ApartmentSchema, BreadcrumbSchema } from '@/components/StructuredData'
import type { Metadata } from 'next'

// Generate dynamic metadata for each apartment
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const apartment = await prisma.apartment.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      description: true,
      imageUrl: true,
      averageRating: true,
      reviewCount: true,
    },
  })

  if (!apartment) {
    return {
      title: 'Apartment Not Found',
    }
  }

  return createApartmentMetadata(apartment)
}

async function getApartment(id: string, userId?: string) {
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
          },
          helpfulVotes: userId ? {
            where: { userId },
            select: { id: true }
          } : false
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!apartment) return null

  const reviewCount = apartment.reviews.length
  const avgRating = reviewCount > 0
    ? apartment.reviews.reduce((sum: number, r) => sum + r.overallRating, 0) / reviewCount
    : null

  // Opinion-First rating categories (subjective impressions)
  const categoryAverages = reviewCount > 0 ? {
    noiseLevel: apartment.reviews.reduce((sum: number, r) => sum + r.noiseLevel, 0) / reviewCount,
    naturalLight: apartment.reviews.reduce((sum: number, r) => sum + r.naturalLight, 0) / reviewCount,
    generalVibe: apartment.reviews.reduce((sum: number, r) => sum + r.generalVibe, 0) / reviewCount
  } : null

  const recommendPercent = reviewCount > 0
    ? (apartment.reviews.filter(r => r.wouldRecommend).length / reviewCount) * 100
    : null

  return {
    ...apartment,
    averageRating: avgRating,
    reviewCount,
    categoryAverages,
    recommendPercent
  }
}

export default async function ApartmentPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  const apartment = await getApartment(id, userId)

  if (!apartment) {
    notFound()
  }

  // Opinion-First rating display - these are subjective impressions from reviewers
  const categories = apartment.categoryAverages ? [
    { label: 'Noise Level', value: apartment.categoryAverages.noiseLevel, icon: '🔇', sublabel: 'Quiet vs Loud' },
    { label: 'Natural Light', value: apartment.categoryAverages.naturalLight, icon: '☀️', sublabel: 'Bright vs Dark' },
    { label: 'General Vibe', value: apartment.categoryAverages.generalVibe, icon: '✨', sublabel: 'Overall Feel' }
  ] : []

  const siteUrl = process.env.NEXTAUTH_URL || 'https://apartmentrater.com'

  return (
    <>
      <ApartmentSchema apartment={apartment} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Apartments', url: '/apartments' },
          { name: apartment.name, url: `/apartments/${apartment.id}` },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <article className="bg-white rounded-xl shadow-sm overflow-hidden" itemScope itemType="https://schema.org/ApartmentComplex">
          <meta itemProp="url" content={`${siteUrl}/apartments/${apartment.id}`} />
          <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
            {apartment.imageUrl ? (
            <Image
              src={apartment.imageUrl}
              alt={apartment.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="text-8xl" role="img" aria-label="Apartment building">🏢</span>
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900" itemProp="name">{apartment.name}</h1>
                <FavoriteButton apartmentId={apartment.id} size="lg" />
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-2" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin className="h-5 w-5" aria-hidden="true" />
                <span>
                  <span itemProp="streetAddress">{apartment.address}</span>, <span itemProp="addressLocality">{apartment.city}</span>, <span itemProp="addressRegion">{apartment.state}</span> <span itemProp="postalCode">{apartment.zipCode}</span>
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1 capitalize">
                  <Home className="h-4 w-4" />
                  {apartment.propertyType}
                </span>
                {apartment.yearBuilt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Built {apartment.yearBuilt}
                  </span>
                )}
                {apartment.unitCount && (
                  <span>{apartment.unitCount} units</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {apartment.averageRating ? (
                <div className="flex items-center gap-3">
                  <StarRating rating={apartment.averageRating} size="lg" />
                  <span className="text-3xl font-bold text-gray-900">
                    {apartment.averageRating.toFixed(1)}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400">No ratings yet</span>
              )}
              <span className="text-gray-500">{apartment.reviewCount} reviews</span>
              {apartment.recommendPercent !== null && (
                <span className="flex items-center gap-1 text-green-600">
                  <ThumbsUp className="h-4 w-4" />
                  {apartment.recommendPercent.toFixed(0)}% recommend
                </span>
              )}
            </div>
          </div>

          {apartment.description && (
            <p className="mt-6 text-gray-600">{apartment.description}</p>
          )}

          {apartment.amenities && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Amenities</h3>
              <AmenitiesList amenities={apartment.amenities} />
            </div>
          )}

          <Link
            href={`/apartments/${apartment.id}/review`}
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            <PenSquare className="h-5 w-5" />
            Write a Review
          </Link>
        </div>
      </article>

      {/* Category Ratings - Opinion-First Display */}
      {categories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Impression Breakdown</h2>
            <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
              Based on Tenant Opinions
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            These scores reflect the subjective impressions of reviewers, not objective measurements.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{cat.icon}</span>
                <div className="text-2xl font-bold text-gray-900 mt-2">
                  {cat.value.toFixed(1)}
                </div>
                <div className="text-sm font-medium text-gray-700">{cat.label}</div>
                <div className="text-xs text-gray-400">{cat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <ApartmentReviewsSection
        reviews={apartment.reviews.map(review => ({
          ...review,
          helpful: review.helpful,
          userHasVoted: Array.isArray(review.helpfulVotes) && review.helpfulVotes.length > 0
        }))}
        apartmentId={apartment.id}
        currentUserId={userId}
        reviewCount={apartment.reviewCount}
      />
    </div>
    </>
  )
}
