'use client'

import { useCookieConsent, writeConsent } from '@/lib/cookie-consent'

/** Lets visitors change the choice they made in the cookie banner. */
export default function CookiePreferences() {
  const consent = useCookieConsent()

  const status =
    consent === 'accepted'
      ? 'Analytics cookies are on.'
      : consent === 'rejected'
        ? 'Analytics cookies are off. Only essential cookies are used.'
        : "You haven't made a choice yet. Analytics cookies stay off until you do."

  return (
    <div className="not-prose mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="flex-1 text-sm text-gray-700" aria-live="polite">{status}</p>
      <div className="flex gap-2">
        <button
          onClick={() => writeConsent('accepted')}
          disabled={consent === 'accepted'}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-default"
        >
          Allow analytics
        </button>
        <button
          onClick={() => writeConsent('rejected')}
          disabled={consent === 'rejected'}
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-default"
        >
          Essential only
        </button>
      </div>
    </div>
  )
}
