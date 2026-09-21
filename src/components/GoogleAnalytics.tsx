'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { useCookieConsent } from '@/lib/cookie-consent'

// Public by design: the measurement ID ships in every page that loads gtag.js.
export const GA_MEASUREMENT_ID = 'G-2KNKJXV2M6'

// Keeps localhost and Vercel preview deployments out of the stats.
const PRODUCTION_HOST = /(^|\.)apartmentrater\.io$/

/**
 * Google Analytics 4, loaded only on the production domain, only after the
 * visitor picks "Accept all", and never when the browser sends Do Not Track or
 * Global Privacy Control (the Cookie Policy promises to honor DNT).
 * Client-side route changes are tracked by GA4's enhanced measurement.
 */
export default function GoogleAnalytics() {
  const consent = useCookieConsent()
  const enabled = consent === 'accepted' && trackingAllowed()

  // Withdrawing consent after gtag.js has loaded: stop sending hits and drop
  // the _ga cookies. Re-accepting in the same tab turns hits back on.
  useEffect(() => {
    ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = !enabled
    if (consent === 'rejected') clearGaCookies()
  }, [enabled, consent])

  if (!enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  )
}

function trackingAllowed() {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  return (
    PRODUCTION_HOST.test(location.hostname) &&
    nav.doNotTrack !== '1' &&
    !nav.globalPrivacyControl
  )
}

function clearGaCookies() {
  // gtag sets _ga / _ga_<id> on the registrable domain (.apartmentrater.io)
  const rootDomain = location.hostname.split('.').slice(-2).join('.')
  for (const cookie of document.cookie.split('; ')) {
    const name = cookie.split('=')[0]
    if (name !== '_ga' && !name.startsWith('_ga_')) continue
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${rootDomain}`
    document.cookie = `${name}=; Max-Age=0; path=/`
  }
}
