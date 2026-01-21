'use client'

import { useState } from 'react'
import { ThumbsUp, CheckCircle, Home, Pencil, Trash2, Clock } from 'lucide-react'
import StarRating from './StarRating'

interface ReviewCardProps {
  review: {
    id: string
    title: string
    experienceSummary: string
    overallRating: number
    // Opinion-based ratings
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
    user: {
      id?: string
      name?: string | null
      image?: string | null
    }
  }
  currentUserId?: string
  userHasVoted?: boolean
  onEdit?: (reviewId: string) => void
  onDelete?: (reviewId: string) => void
  onHelpfulChange?: () => void
}

export default function ReviewCard({
  review,
  currentUserId,
  userHasVoted = false,
  onEdit,
  onDelete,
  onHelpfulChange
}: ReviewCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)
  const [hasVoted, setHasVoted] = useState(userHasVoted)
  const [isVoting, setIsVoting] = useState(false)

  const isOwner = !!(currentUserId && review.user.id === currentUserId)

  // Determine if this is a current tenant based on lease end date
  const isCurrentTenant = review.leaseEndDate
    ? new Date(review.leaseEndDate) >= new Date()
    : false

  // Opinion-based rating categories (subjective impressions)
  const categories = [
    { label: 'Noise Level', value: review.noiseLevel, lowLabel: 'Loud', highLabel: 'Quiet' },
    { label: 'Natural Light', value: review.naturalLight, lowLabel: 'Dark', highLabel: 'Bright' },
    { label: 'General Vibe', value: review.generalVibe, lowLabel: 'Negative', highLabel: 'Positive' }
  ]

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete review')
      }

      onDelete?.(review.id)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete review')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleHelpful = async () => {
    if (!currentUserId) {
      alert('You must be logged in to mark reviews as helpful')
      return
    }

    if (isOwner) {
      alert('You cannot mark your own review as helpful')
      return
    }

    setIsVoting(true)
    try {
      const method = hasVoted ? 'DELETE' : 'POST'
      const response = await fetch(`/api/reviews/${review.id}/helpful`, { method })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update helpful vote')
      }

      setHasVoted(!hasVoted)
      setHelpfulCount(prev => hasVoted ? prev - 1 : prev + 1)
      onHelpfulChange?.()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update vote')
    } finally {
      setIsVoting(false)
    }
  }

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article
      className="bg-white rounded-lg shadow p-6"
      itemScope
      itemType="https://schema.org/Review"
      aria-label={`Review of ${review.unitNumber ? `Unit ${review.unitNumber}` : 'apartment'}: ${review.title}`}
    >
      <meta itemProp="datePublished" content={new Date(review.createdAt).toISOString()} />
      <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
        <meta itemProp="ratingValue" content={String(review.overallRating)} />
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
      </div>
      <div itemProp="author" itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content="Resident" />
      </div>

      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Unit number prominently displayed */}
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center" aria-hidden="true">
            <Home className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {review.unitNumber ? (
                <span className="font-semibold text-gray-900 text-lg">Unit {review.unitNumber}</span>
              ) : (
                <span className="font-medium text-gray-600">Unit not specified</span>
              )}
              {review.isUnitVerified && (
                <span className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded">
                  <CheckCircle className="h-3 w-3" aria-hidden="true" />
                  <span>Verified</span>
                </span>
              )}
              {isCurrentTenant && (
                <span className="flex items-center gap-1 text-purple-600 text-xs bg-purple-50 px-2 py-0.5 rounded">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>Current Tenant</span>
                </span>
              )}
              {review.isVerified && !isCurrentTenant && (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="h-3 w-3" aria-hidden="true" />
                  <span>Verified Tenant</span>
                </span>
              )}
            </div>
            <time className="text-sm text-gray-500" dateTime={new Date(review.createdAt).toISOString()}>
              {formattedDate}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit?.(review.id)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                aria-label="Edit review"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                aria-label="Delete review"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2" aria-label={`Rating: ${review.overallRating} out of 5 stars`}>
            <StarRating rating={review.overallRating} size="sm" />
            <span className="font-semibold text-gray-900">
              {review.overallRating.toFixed(1)}
            </span>
          </div>
        </div>
      </header>

      <h4 className="font-semibold text-lg mt-4" itemProp="name">{review.title}</h4>

      {/* Opinion disclaimer badge */}
      <div className="mt-3 mb-2">
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded inline-flex items-center gap-1">
          <span className="font-medium">Personal Opinion</span>
          {review.certifiedPersonalExperience && (
            <CheckCircle className="h-3 w-3" aria-hidden="true" />
          )}
        </span>
      </div>

      <p className="text-gray-600 mt-2" itemProp="reviewBody">{review.experienceSummary}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4" role="list" aria-label="Category ratings">
        {categories.map(cat => (
          <div key={cat.label} className="text-center p-2 bg-gray-50 rounded" role="listitem">
            <div className="text-xs text-gray-500">{cat.label}</div>
            <div className="font-semibold text-gray-900" aria-label={`${cat.label}: ${cat.value} out of 5`}>{cat.value}/5</div>
          </div>
        ))}
      </div>

      <footer className="flex items-center justify-between mt-4 pt-4 border-t">
        <span className={`text-sm font-medium ${review.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
          <span aria-hidden="true">{review.wouldRecommend ? '👍' : '👎'}</span>
          {' '}{review.wouldRecommend ? 'Would recommend' : 'Would not recommend'}
        </span>
        <button
          onClick={handleHelpful}
          disabled={isVoting || isOwner}
          className={`flex items-center gap-1 text-sm transition-colors disabled:cursor-not-allowed ${
            hasVoted
              ? 'text-blue-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          } ${isOwner ? 'opacity-50' : ''}`}
          aria-label={isOwner ? 'You cannot vote on your own review' : hasVoted ? 'Remove helpful vote' : 'Mark as helpful'}
          aria-pressed={hasVoted}
        >
          <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} aria-hidden="true" />
          Helpful {helpfulCount > 0 && `(${helpfulCount})`}
        </button>
      </footer>
    </article>
  )
}
