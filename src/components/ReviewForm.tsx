'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react'
import StarRating from './StarRating'
import UnitSelector from './UnitSelector'

interface Review {
  id: string
  title: string
  experienceSummary: string
  noiseLevel: number
  naturalLight: number
  generalVibe: number
  wouldRecommend: boolean
  anonymous: boolean
  unitNumber?: string | null
  isUnitVerified?: boolean
  leaseStartDate?: string | null
  leaseEndDate?: string | null
  certifiedPersonalExperience?: boolean
}

interface ApartmentInfo {
  address: string
  city: string
  state: string
  zipCode: string
}

interface ReviewFormProps {
  apartmentId: string
  apartmentInfo: ApartmentInfo
  editReview?: Review | null
}

// Opinion-First subjective rating categories
// These are explicitly framed as personal impressions, not factual claims
const ratingCategories = [
  {
    key: 'noiseLevel',
    label: 'Noise Level',
    description: 'How noisy did it FEEL to you? (1 = Very Loud, 5 = Very Quiet)',
    lowLabel: 'Very Loud',
    highLabel: 'Very Quiet'
  },
  {
    key: 'naturalLight',
    label: 'Natural Light',
    description: 'How would you rate the natural light in your unit?',
    lowLabel: 'Very Dark',
    highLabel: 'Very Bright'
  },
  {
    key: 'generalVibe',
    label: 'General Vibe',
    description: 'What was your overall feeling about living here?',
    lowLabel: 'Negative',
    highLabel: 'Positive'
  }
]

export default function ReviewForm({ apartmentId, apartmentInfo, editReview }: ReviewFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isEditing = !!editReview

  const [ratings, setRatings] = useState<Record<string, number>>({
    noiseLevel: 0,
    naturalLight: 0,
    generalVibe: 0
  })

  const [formData, setFormData] = useState({
    title: '',
    experienceSummary: '',
    wouldRecommend: true,
    anonymous: false,
    unitNumber: '',
    isUnitVerified: false,
    leaseStartDate: '',
    leaseEndDate: '',
    certifiedPersonalExperience: false
  })

  useEffect(() => {
    if (editReview) {
      setRatings({
        noiseLevel: editReview.noiseLevel,
        naturalLight: editReview.naturalLight,
        generalVibe: editReview.generalVibe
      })
      setFormData({
        title: editReview.title,
        experienceSummary: editReview.experienceSummary,
        wouldRecommend: editReview.wouldRecommend,
        anonymous: editReview.anonymous,
        unitNumber: editReview.unitNumber || '',
        isUnitVerified: editReview.isUnitVerified || false,
        leaseStartDate: editReview.leaseStartDate ? editReview.leaseStartDate.split('T')[0] : '',
        leaseEndDate: editReview.leaseEndDate ? editReview.leaseEndDate.split('T')[0] : '',
        certifiedPersonalExperience: editReview.certifiedPersonalExperience || false
      })
    }
  }, [editReview])

  const handleRatingChange = (key: string, value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }))
  }

  const handleUnitChange = (value: string, isVerified: boolean) => {
    setFormData(prev => ({
      ...prev,
      unitNumber: value,
      isUnitVerified: isVerified
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate all ratings are provided
    const allRated = Object.values(ratings).every(r => r > 0)
    if (!allRated) {
      setError('Please rate all categories')
      setLoading(false)
      return
    }

    // Validate required text fields
    if (!formData.title || !formData.experienceSummary) {
      setError('Please fill in the title and your experience summary')
      setLoading(false)
      return
    }

    // Validate lease dates are provided
    if (!formData.leaseStartDate || !formData.leaseEndDate) {
      setError('Please provide your lease start and end dates')
      setLoading(false)
      return
    }

    // Validate lease end is after lease start
    if (new Date(formData.leaseEndDate) < new Date(formData.leaseStartDate)) {
      setError('Lease end date must be after the start date')
      setLoading(false)
      return
    }

    // Validate certification checkbox (required)
    if (!formData.certifiedPersonalExperience) {
      setError('You must certify that this review is based on your personal experience')
      setLoading(false)
      return
    }

    try {
      const url = isEditing
        ? `/api/reviews/${editReview!.id}`
        : `/api/apartments/${apartmentId}/reviews`

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ratings,
          ...formData
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'submit'} review`)
      }

      router.push(`/apartments/${apartmentId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'submit'} review`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Legal Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Important Notice</p>
            <p>
              Reviews on this platform are user-generated opinions. By posting, you agree that your
              review reflects your personal experience and subjective impressions, not objective facts.
              You are solely responsible for the accuracy and legality of your statements.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Opinion-First Ratings Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Share Your Impressions</h3>
        <p className="text-sm text-gray-500 mb-4">
          Rate your personal experience. These are your subjective feelings, not factual assessments.
        </p>
        <div className="grid gap-4">
          {ratingCategories.map(cat => (
            <div key={cat.key} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{cat.label}</div>
                  <div className="text-sm text-gray-500">{cat.description}</div>
                </div>
                <StarRating
                  rating={ratings[cat.key]}
                  interactive
                  onChange={(value) => handleRatingChange(cat.key, value)}
                  size="lg"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{cat.lowLabel}</span>
                <span>{cat.highLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Summary Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Experience</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Summarize your experience in a few words"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Experience Summary *
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Describe your personal experience living in or visiting this unit.
            Focus on your impressions and feelings rather than making factual claims.
          </p>
          <textarea
            value={formData.experienceSummary}
            onChange={(e) => setFormData(prev => ({ ...prev, experienceSummary: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={5}
            placeholder="Share what your experience was like living here. What did you like or dislike? How did it feel to live in this unit?"
            required
          />
        </div>
      </div>

      {/* Unit Selection with Smarty API Integration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Unit Details</h3>

        <UnitSelector
          apartmentId={apartmentId}
          streetAddress={apartmentInfo.address}
          city={apartmentInfo.city}
          state={apartmentInfo.state}
          zipCode={apartmentInfo.zipCode}
          value={formData.unitNumber}
          isVerified={formData.isUnitVerified}
          onChange={handleUnitChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lease Start Date *
            </label>
            <input
              type="date"
              value={formData.leaseStartDate}
              onChange={(e) => setFormData(prev => ({ ...prev, leaseStartDate: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lease End Date *
            </label>
            <input
              type="date"
              value={formData.leaseEndDate}
              onChange={(e) => setFormData(prev => ({ ...prev, leaseEndDate: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use expected end date if lease is ongoing
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Lease dates help verify your tenancy and provide context for your review.
        </p>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.wouldRecommend}
              onChange={(e) => setFormData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm">I would recommend this apartment</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.anonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-sm">Post anonymously</span>
          </label>
        </div>
      </div>

      {/* Mandatory Certification Checkbox */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.certifiedPersonalExperience}
            onChange={(e) => setFormData(prev => ({ ...prev, certifiedPersonalExperience: e.target.checked }))}
            className="h-5 w-5 text-blue-600 rounded mt-0.5 flex-shrink-0"
            required
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Personal Experience Certification *</span>
            </div>
            <p className="text-sm text-blue-800">
              I certify that this review is based on my personal experience living in or visiting
              this specific unit. I understand that my review represents my subjective opinion
              and not a statement of fact.
            </p>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !formData.certifiedPersonalExperience}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            {isEditing ? 'Updating...' : 'Submitting...'}
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5" />
            {isEditing ? 'Update Review' : 'Submit Review'}
          </>
        )}
      </button>

      {/* Footer Legal Text */}
      <p className="text-xs text-gray-500 text-center">
        By submitting this review, you agree to our{' '}
        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        You also agree to indemnify and hold harmless Apartment Rater from any claims
        arising from your review content.
      </p>
    </form>
  )
}
