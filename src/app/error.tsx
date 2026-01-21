'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center bg-white p-8 rounded-xl shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
