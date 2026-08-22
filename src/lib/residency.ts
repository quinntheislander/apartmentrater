/**
 * Residency verification — policy constants and pure matching helpers.
 *
 * Lane B ("document lane"): a reviewer uploads a lease, renter's-insurance
 * declarations page, utility bill, or similar. We extract name / address /
 * unit / dates once, compare them to the reviewer and the apartment, and keep
 * ONLY the outcome. The document and the extracted personal details are never
 * persisted — that restraint is the feature under our anonymity posture.
 *
 * Everything in this file is side-effect free and safe to import from client
 * components (badge derivation, copy, limits).
 */

/** A tenancy counts as "recent" if it ended within this many years. */
export const RECENT_TENANCY_WINDOW_YEARS = 3

/**
 * A document dated this recently still earns the "Verified Resident" badge
 * (a utility bill from last quarter, an insurance policy that just renewed).
 * Older than this and the reviewer is shown as a verified *former* tenant.
 */
export const CURRENT_RESIDENT_GRACE_DAYS = 90

/** Vercel serverless request bodies cap at 4.5 MB; leave headroom for multipart framing. */
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024

export const ACCEPTED_DOCUMENT_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const

export type AcceptedDocumentMimeType = (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number]

export function isAcceptedDocumentMimeType(type: string): type is AcceptedDocumentMimeType {
  return (ACCEPTED_DOCUMENT_MIME_TYPES as readonly string[]).includes(type)
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  lease: 'Lease agreement',
  renters_insurance: "Renter's insurance declarations page",
  utility_bill: 'Utility bill (e.g. JEA)',
  move_out_statement: 'Move-out / final account statement',
  rent_ledger: 'Rent ledger or receipt',
  other: 'Other document',
}

/** Rejection codes stored on the verification row, mapped to user-facing copy. */
export const REJECTION_MESSAGES = {
  not_residency_document:
    "We couldn't recognize this as a lease, insurance declarations page, utility bill, or similar residency document.",
  name_mismatch:
    "The name on the document doesn't match the name you entered. Use the exact name that appears on the document.",
  address_mismatch:
    "The street address on the document doesn't match this apartment community.",
  unit_mismatch:
    "The unit on the document doesn't match the unit you selected.",
  unit_missing:
    "We couldn't find a unit number on the document. Try a page that shows your full address including the unit.",
  date_missing:
    "We couldn't find a date or lease period on the document.",
  out_of_window:
    `This document is older than ${RECENT_TENANCY_WINDOW_YEARS} years. Reviews must come from a current tenancy or one that ended within the last ${RECENT_TENANCY_WINDOW_YEARS} years.`,
  tampering_suspected:
    "The document shows signs of editing. If you believe this is a mistake, try uploading the original file from your email or resident portal.",
  low_confidence:
    "The document was too blurry or cropped to read reliably. Try a clearer photo or the original PDF.",
} as const

export type RejectionReason = keyof typeof REJECTION_MESSAGES

// ---------------------------------------------------------------------------
// Time window
// ---------------------------------------------------------------------------

export function recentWindowStart(now: Date = new Date()): Date {
  const start = new Date(now)
  start.setUTCFullYear(start.getUTCFullYear() - RECENT_TENANCY_WINDOW_YEARS)
  return start
}

/** `null` coveredTo means open-ended (an active lease) and is always in-window. */
export function isWithinRecentWindow(coveredTo: Date | null, now: Date = new Date()): boolean {
  if (!coveredTo) return true
  return coveredTo >= recentWindowStart(now)
}

export function isCurrentCoverage(coveredTo: Date | null, now: Date = new Date()): boolean {
  if (!coveredTo) return true
  const graceStart = new Date(now)
  graceStart.setUTCDate(graceStart.getUTCDate() - CURRENT_RESIDENT_GRACE_DAYS)
  return coveredTo >= graceStart
}

// ---------------------------------------------------------------------------
// Normalization + matching
// ---------------------------------------------------------------------------

const UNIT_DESIGNATORS = /\b(apt|apartment|unit|suite|ste|bldg|building|no|number|rm|room)\b\.?/gi

/**
 * "Apt. 4B" / "#4b" / "Unit 4-B" / "Bldg 3 Apt 1204" → "4B" / "4B" / "4B" / "1204".
 * When a designator is present, the unit is whatever follows the last one —
 * that drops building/floor prefixes documents like to include. Stored form
 * for unitNumber.
 */
export function normalizeUnit(unit: string | null | undefined): string {
  if (!unit) return ''
  let s = unit
  const designators = [...s.matchAll(UNIT_DESIGNATORS)]
  if (designators.length > 0) {
    const last = designators[designators.length - 1]
    s = s.slice((last.index ?? 0) + last[0].length)
  }
  return s.replace(/[#.\-\s_/]/g, '').toUpperCase()
}

export function unitsMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  const na = normalizeUnit(a)
  const nb = normalizeUnit(b)
  return na.length > 0 && na === nb
}

const NAME_SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v'])

/** Lowercase, strip diacritics/punctuation, split hyphens, drop generational suffixes. */
export function nameTokens(name: string | null | undefined): string[] {
  if (!name) return []
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(t => t.length > 0 && !NAME_SUFFIXES.has(t))
}

/**
 * Does the name the reviewer typed appear among the names on the document?
 *
 * Match rule: the reviewer's last name must be present on the document, and
 * their first name must be present or represented by its initial. Token order
 * is ignored so "DOE, JANE" and "Jane Doe" both match. Middle names on either
 * side are ignored. Documents often list several tenants; any one may match.
 */
export function namesMatch(provided: string, candidates: string[]): boolean {
  const p = nameTokens(provided)
  if (p.length < 2) return false
  const first = p[0]
  const last = p[p.length - 1]

  return candidates.some(candidate => {
    const c = nameTokens(candidate)
    if (c.length === 0) return false
    const hasLast = c.includes(last)
    const hasFirst =
      c.includes(first) ||
      c.some(token => token.length === 1 && token === first[0]) ||
      (first.length === 1 && c.some(token => token[0] === first))
    return hasLast && hasFirst
  })
}

const STREET_SUFFIXES: Record<string, string> = {
  street: 'st', str: 'st',
  avenue: 'ave', av: 'ave',
  boulevard: 'blvd',
  drive: 'dr',
  road: 'rd',
  lane: 'ln',
  court: 'ct',
  circle: 'cir',
  place: 'pl',
  parkway: 'pkwy',
  highway: 'hwy',
  terrace: 'ter',
  trail: 'trl',
  north: 'n', south: 's', east: 'e', west: 'w',
}

function streetTokens(address: string | null | undefined): string[] {
  if (!address) return []
  return address
    .toLowerCase()
    .split(',')[0]
    .replace(UNIT_DESIGNATORS, ' ')
    .replace(/#.*$/, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(t => STREET_SUFFIXES[t] ?? t)
}

/**
 * Same building? Requires the house number to match and the first
 * street-name word to match, after suffix normalization. Deliberately loose
 * on everything else — documents abbreviate and truncate unpredictably.
 */
export function streetsMatch(docStreet: string | null | undefined, apartmentAddress: string): boolean {
  const d = streetTokens(docStreet)
  const a = streetTokens(apartmentAddress)
  if (d.length < 2 || a.length < 2) return false
  if (d[0] !== a[0]) return false
  const isNameToken = (t: string) => !/^\d+$/.test(t) && !DIRECTIONALS.has(t)
  const dName = d.slice(1).find(isNameToken)
  const aName = a.slice(1).find(isNameToken)
  return !!dName && dName === aName
}

const DIRECTIONALS = new Set(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'])

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

/** Accepts YYYY-MM-DD, YYYY-MM, or YYYY. Returns a UTC date or null. */
export function parseLooseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/.exec(value.trim())
  if (!m) return null
  const year = Number(m[1])
  const month = m[2] ? Number(m[2]) : 1
  const day = m[3] ? Number(m[3]) : 1
  if (year < 1990 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null
  const d = new Date(Date.UTC(year, month - 1, day))
  return isNaN(d.getTime()) ? null : d
}

export interface Coverage {
  from: Date | null
  to: Date | null
}

/**
 * Turn whatever dates the document offered into a coverage window.
 * A lease gives a period; a bill or statement gives a single date, which
 * we treat as both ends.
 */
export function coverageFromDates(input: {
  periodStart: string | null
  periodEnd: string | null
  documentDate: string | null
}): Coverage {
  const start = parseLooseDate(input.periodStart)
  const end = parseLooseDate(input.periodEnd)
  const docDate = parseLooseDate(input.documentDate)

  if (start || end) {
    return { from: start ?? docDate, to: end }
  }
  if (docDate) {
    return { from: docDate, to: docDate }
  }
  return { from: null, to: null }
}

// ---------------------------------------------------------------------------
// Badge derivation (shared by server queries and ReviewCard)
// ---------------------------------------------------------------------------

export interface VerificationSummary {
  status: string
  coveredFrom: Date | string | null
  coveredTo: Date | string | null
}

export type VerificationBadge =
  | { kind: 'resident' }
  | { kind: 'former'; label: string }
  | null

function toDate(value: Date | string | null): Date | null {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function formatCoverage(from: Date | string | null, to: Date | string | null): string {
  const f = toDate(from)
  const t = toDate(to)
  if (f && t) {
    const a = formatMonthYear(f)
    const b = formatMonthYear(t)
    return a === b ? a : `${a} – ${b}`
  }
  if (t) return `through ${formatMonthYear(t)}`
  if (f) return `since ${formatMonthYear(f)}`
  return ''
}

export function deriveBadge(
  verification: VerificationSummary | null | undefined,
  now: Date = new Date()
): VerificationBadge {
  if (!verification || verification.status !== 'verified') return null
  const to = toDate(verification.coveredTo)
  if (isCurrentCoverage(to, now)) return { kind: 'resident' }
  if (!isWithinRecentWindow(to, now)) return null
  return { kind: 'former', label: formatCoverage(verification.coveredFrom, verification.coveredTo) }
}
