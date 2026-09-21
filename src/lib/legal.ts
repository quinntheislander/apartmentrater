/**
 * Single source of truth for legal/contact configuration.
 *
 * Keeping these in one place prevents drift between the email templates,
 * policy pages, and metadata — mismatches there have their own compliance cost
 * (promising an inbox you don't monitor, emails from a domain users can't trust).
 */

// The domain users see in policies, "from" addresses, and marketing.
// Prefer MAIL_DOMAIN; fall back to parsing NEXTAUTH_URL; last-resort default.
function deriveMailDomain(): string {
  if (process.env.MAIL_DOMAIN) return process.env.MAIL_DOMAIN
  const url = process.env.NEXTAUTH_URL
  if (url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, '')
      if (host && !host.includes('localhost')) return host
    } catch {
      // ignore
    }
  }
  return 'apartmentrater.com'
}

export const MAIL_DOMAIN = deriveMailDomain()

/** Every inbox referenced in policy text — must all be configured for delivery. */
export const CONTACT_EMAILS = {
  hello: `hello@${MAIL_DOMAIN}`,
  legal: `legal@${MAIL_DOMAIN}`,
  privacy: `privacy@${MAIL_DOMAIN}`,
  dmca: `dmca@${MAIL_DOMAIN}`,
  accessibility: `accessibility@${MAIL_DOMAIN}`,
  appeals: `appeals@${MAIL_DOMAIN}`,
  report: `report@${MAIL_DOMAIN}`,
  noreply: `noreply@${MAIL_DOMAIN}`,
  contact: `contact@${MAIL_DOMAIN}`,
} as const

/** Display name used in "From" headers and branding. */
export const BRAND_NAME = 'Apartment Rater'

/** Legal entity name — update once the LLC paperwork is filed. */
export const LEGAL_ENTITY_NAME = process.env.LEGAL_ENTITY_NAME || BRAND_NAME

/** Policy versioning — bump when the content materially changes so the
 *  tosAcceptedAt / privacyAcceptedAt records are meaningful. */
export const TOS_VERSION = '2026-04-18'
export const PRIVACY_VERSION = '2026-09-21' // added Google Analytics (consent-gated), Vercel Web Analytics, and Google Maps Platform photos

/** Minimum age to create an account (COPPA for US, GDPR uses 16 in some EU states). */
export const MIN_AGE = 16
