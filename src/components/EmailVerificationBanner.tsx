'use client'

import { useState } from 'react'
import { Mail, X, Loader2 } from 'lucide-react'

interface EmailVerificationBannerProps {
  onDismiss?: () => void
}

export default function EmailVerificationBanner({ onDismiss }: EmailVerificationBannerProps) {
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [dismissed, setDismissed] = useState(false)

  const handleSendVerification = async () => {
    setIsSending(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST'
      })

      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send verification email')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setIsSending(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (dismissed) {
    return null
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Mail className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-amber-700">
            {sent ? (
              <>
                <span className="font-medium">Verification email sent!</span> Check your inbox (and spam folder) for the verification link.
              </>
            ) : (
              <>
                <span className="font-medium">Verify your email address</span> to unlock all features and improve your account security.
              </>
            )}
          </p>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          {!sent && (
            <button
              onClick={handleSendVerification}
              disabled={isSending}
              className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-600 disabled:opacity-50 flex items-center gap-1"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send verification email'
              )}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 text-amber-400 hover:text-amber-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
