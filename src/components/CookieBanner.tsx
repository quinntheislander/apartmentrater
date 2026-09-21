'use client'

import Link from 'next/link'
import { Cookie, X } from 'lucide-react'
import { useCookieConsent, writeConsent } from '@/lib/cookie-consent'

export default function CookieBanner() {
  const consent = useCookieConsent() // null on the server, so the banner never SSRs

  if (consent !== null) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-4xl bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <Cookie className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900">We use cookies</h2>
            <p className="text-sm text-gray-600 mt-1">
              Essential cookies keep you signed in and secure. Optional analytics cookies help us understand how the site is used. You can change your choice any time from our{' '}
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => writeConsent('accepted')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 text-sm"
              >
                Accept all
              </button>
              <button
                onClick={() => writeConsent('rejected')}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 text-sm"
              >
                Essential only
              </button>
            </div>
          </div>
          <button
            onClick={() => writeConsent('rejected')}
            aria-label="Dismiss (essential only)"
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
