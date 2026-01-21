'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PenSquare, Search, X } from 'lucide-react'
import ReviewCard from './ReviewCard'

interface Review {
  id: string
  title: string
  experienceSummary: string
  overallRating: number
  // Opinion-based ratings (1-5)
  noiseLevel: number
  naturalLight: number
  generalVibe: number
  // Unit info
  unitNumber?: string | null
  isUnitVerified?: boolean
  // Lease dates for current tenant indicator
  leaseStartDate?: Date | string | null
  leaseEndDate?: Date | string | null
  // Meta
  wouldRecommend: boolean
  anonymous: boolean
  isVerified: boolean
  helpful: number
  certifiedPersonalExperience?: boolean
  createdAt: Date | string
  userHasVoted: boolean
  user: {
    id?: string
    name?: string | null
    image?: string | null
  }
}

interface ApartmentReviewsSectionProps {
  reviews: Review[]
  apartmentId: string
  currentUserId?: string
  reviewCount: number
}

export default function ApartmentReviewsSection({
  reviews,
  apartmentId,
  currentUserId,
  reviewCount
}: ApartmentReviewsSectionProps) {
  const router = useRouter()
  const [unitSearch, setUnitSearch] = useState('')

  const handleEdit = (reviewId: string) => {
    router.push(`/apartments/${apartmentId}/review?edit=${reviewId}`)
  }

  const handleDelete = () => {
    router.refresh()
  }

  // Get unique unit numbers from reviews for quick filter buttons
  const uniqueUnits = useMemo(() => {
    const units = reviews
      .map(r => r.unitNumber)
      .filter((unit): unit is string => !!unit)
    return [...new Set(units)].sort()
  }, [reviews])

  // Filter reviews by unit number search
  const filteredReviews = useMemo(() => {
    if (!unitSearch.trim()) return reviews
    const searchLower = unitSearch.toLowerCase().trim()
    return reviews.filter(review =>
      review.unitNumber?.toLowerCase().includes(searchLower)
    )
  }, [reviews, unitSearch])

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">
          Reviews ({reviewCount})
        </h2>

        {/* Unit number search */}
        {reviews.length > 0 && uniqueUnits.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by unit #"
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="pl-9 pr-8 py-2 border rounded-lg text-sm w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {unitSearch && (
                <button
                  onClick={() => setUnitSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick unit filter buttons */}
      {uniqueUnits.length > 1 && uniqueUnits.length <= 10 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setUnitSearch('')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              !unitSearch
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Units
          </button>
          {uniqueUnits.map(unit => (
            <button
              key={unit}
              onClick={() => setUnitSearch(unit)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                unitSearch === unit
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unit {unit}
            </button>
          ))}
        </div>
      )}

      {/* Filtered results notice */}
      {unitSearch && (
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
          {filteredReviews.length > 0 ? ` for unit "${unitSearch}"` : ''}
          {filteredReviews.length === 0 && (
            <button
              onClick={() => setUnitSearch('')}
              className="ml-2 text-blue-600 hover:underline"
            >
              Clear filter
            </button>
          )}
        </p>
      )}

      {filteredReviews.length > 0 ? (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              userHasVoted={review.userHasVoted}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No reviews found for this unit</p>
          <p className="text-gray-400 mt-2">Try searching for a different unit number</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 mt-2">Be the first to review this apartment!</p>
          <Link
            href={`/apartments/${apartmentId}/review`}
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            <PenSquare className="h-5 w-5" />
            Write a Review
          </Link>
        </div>
      )}
    </div>
  )
}
