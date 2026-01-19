'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PenSquare } from 'lucide-react'
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

  const handleEdit = (reviewId: string) => {
    router.push(`/apartments/${apartmentId}/review?edit=${reviewId}`)
  }

  const handleDelete = () => {
    router.refresh()
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-6">
        Reviews ({reviewCount})
      </h2>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
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
