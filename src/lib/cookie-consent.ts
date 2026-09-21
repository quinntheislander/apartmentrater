import { useSyncExternalStore } from 'react'

const CONSENT_COOKIE = 'cookie-consent'
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const CONSENT_EVENT = 'cookie-consent-change'

export type ConsentValue = 'accepted' | 'rejected' | null

function readConsent(): ConsentValue {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find(c => c.startsWith(`${CONSENT_COOKIE}=`))
  if (!match) return null
  const value = match.split('=')[1]
  return value === 'accepted' || value === 'rejected' ? value : null
}

export function writeConsent(value: 'accepted' | 'rejected') {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb)
  return () => window.removeEventListener(CONSENT_EVENT, cb)
}

/** The visitor's cookie choice. Always null during SSR and hydration. */
export function useCookieConsent(): ConsentValue {
  return useSyncExternalStore<ConsentValue>(
    subscribe,
    readConsent,
    () => null // server snapshot
  )
}
