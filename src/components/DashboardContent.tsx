'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PenSquare, Star, Building2, Calendar, Heart, Pencil, Trash2 } from 'lucide-react'
import StarRating from './StarRating'
import ApartmentCard from './ApartmentCard'
import EmailVerificationBanner from './EmailVerificationBanner'

interface Review {
  id: string
  title: string
  experienceSummary: string
  overallRating: number
  wouldRecommend: boolean
  anonymous: boolean
  createdAt: Date | string
  apartmentId: string
  apartment: {
    id: string
    name: string
    address: string
    city: string
    state: string
  }
}

interface Apartment {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  imageUrl?: string | null
  averageRating: number | null
  reviewCount: number
}

interface DashboardContentProps {
  user: {
    id: string
    name?: string | null
    email: string
    emailVerified: Date | null
  }
  reviews: Review[]
  favorites: Apartment[]
}

type Tab = 'reviews' | 'favorites'

export default function DashboardContent({ user, reviews, favorites }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('reviews')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    setIsDeleting(reviewId)
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete review')
      }
    } catch {
      alert('An error occurred')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!user.emailVerified && <EmailVerificationBanner />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.name || user.email}</p>
        </div>
        <Link
          href="/apartments"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <PenSquare className="h-5 w-5" />
          Write a Review
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{reviews.length}</div>
              <div className="text-gray-500">Reviews Written</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {new Set(reviews.map(r => r.apartmentId)).size}
              </div>
              <div className="text-gray-500">Places Reviewed</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{favorites.length}</div>
              <div className="text-gray-500">Favorites</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'favorites'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorites ({favorites.length})
            </button>
          </nav>
        </div>

        {activeTab === 'reviews' && (
          <>
            {reviews.length > 0 ? (
              <div className="divide-y">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/apartments/${review.apartment.id}`}
                          className="font-semibold text-lg hover:text-blue-600"
                        >
                          {review.apartment.name}
                        </Link>
                        <p className="text-gray-500 text-sm">
                          {review.apartment.address}, {review.apartment.city}, {review.apartment.state}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.overallRating} size="sm" />
                          <span className="font-semibold">{review.overallRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => router.push(`/apartments/${review.apartment.id}/review?edit=${review.id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit review"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={isDeleting === review.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Delete review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium mt-4">{review.title}</h4>
                    <p className="text-gray-600 mt-1 line-clamp-2">{review.experienceSummary}</p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={review.wouldRecommend ? 'text-green-600' : 'text-red-600'}>
                        {review.wouldRecommend ? 'Would recommend' : 'Would not recommend'}
                      </span>
                      {review.anonymous && <span className="text-gray-400">Posted anonymously</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">You haven&apos;t written any reviews yet</p>
                <p className="text-gray-400 mt-2">Share your apartment experience to help others!</p>
                <Link
                  href="/apartments"
                  className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  <PenSquare className="h-5 w-5" />
                  Find an Apartment to Review
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            {favorites.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((apartment) => (
                    <ApartmentCard key={apartment.id} apartment={apartment} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No favorites yet</p>
                <p className="text-gray-400 mt-2">Save apartments you like to find them later!</p>
                <Link
                  href="/apartments"
                  className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  Browse Apartments
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
