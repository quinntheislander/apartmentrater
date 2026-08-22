'use client'

import { useState } from 'react'
import { Flag, X, CheckCircle } from 'lucide-react'

interface ReportReviewDialogProps {
  reviewId: string
  onClose: () => void
}

const REASONS: { value: string; label: string; description: string }[] = [
  { value: 'false', label: 'False or misleading', description: 'The review contains information the reporter believes is not true.' },
  { value: 'harassment', label: 'Harassment or hate speech', description: 'Personal attacks, threats, slurs, or discriminatory content.' },
  { value: 'privacy', label: 'Privacy violation', description: 'Names, contact info, or photos of individuals without consent.' },
  { value: 'spam', label: 'Spam or advertising', description: 'Promotional content, solicitation, or off-topic material.' },
  { value: 'other', label: 'Other violation', description: 'Describe the issue in the notes field.' },
]

export default function ReportReviewDialog({ reviewId, onClose }: ReportReviewDialogProps) {
  const [reason, setReason] = useState<string>('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason) {
      setError('Please choose a reason.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, details: details.trim() || undefined })
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'Failed to submit report')
        return
      }
      setDone(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-dialog-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Flag className="h-5 w-5 text-red-600" />
            <h2 id="report-dialog-title" className="text-lg font-semibold">Report Review</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="font-medium text-gray-900">Report received</p>
            <p className="text-sm text-gray-600 mt-2">
              Thanks. Our team reviews every report and removes content that violates our guidelines.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Why are you reporting this review?</p>
              {REASONS.map(r => (
                <label
                  key={r.value}
                  className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{r.label}</div>
                    <div className="text-xs text-gray-500">{r.description}</div>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional details (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={2000}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Anything else our moderators should know?"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !reason}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-red-300"
              >
                {loading ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
