'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('No verification token provided')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      if (res.ok) {
        setStatus('success')
        // Redirect to sign in after 3 seconds
        setTimeout(() => router.push('/auth/signin'), 3000)
      } else {
        const data = await res.json()
        setStatus('error')
        setError(data.error || 'Verification failed')
      }
    } catch {
      setStatus('error')
      setError('An error occurred during verification')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-md">
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
            <p className="text-gray-500">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
            <p className="text-gray-500 mb-6">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <Link
              href="/auth/signin"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Sign In
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Try Again
              </Link>
              <p className="text-sm text-gray-400">
                The verification link may have expired. Please sign up again to receive a new link.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
