import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkRateLimit, getClientIp, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit'
import { fetchSecondaryAddresses, isSmartyConfigured } from '@/lib/smarty'
import {
  MAX_DOCUMENT_BYTES,
  REJECTION_MESSAGES,
  coverageFromDates,
  deriveBadge,
  isAcceptedDocumentMimeType,
  isWithinRecentWindow,
  namesMatch,
  normalizeUnit,
  streetsMatch,
  unitsMatch,
  type RejectionReason,
} from '@/lib/residency'
import { extractResidencyDocument, extractionModel, isExtractionConfigured } from '@/lib/residency-extraction'
import { findVerifiedResidency } from '@/lib/residency-store'

// Document extraction can take a while on a multi-page PDF.
export const maxDuration = 60

/**
 * POST /api/verify/residency/document  (multipart/form-data)
 *   file        — image/jpeg|png|webp or application/pdf, ≤ 4 MB
 *   apartmentId — the community being reviewed
 *   unitNumber  — the unit being reviewed
 *   legalName   — the name as printed on the document (used for the match, never stored)
 *
 * The file lives only in this request's memory. We persist the outcome
 * (matched / rejected + coverage dates) and nothing that was extracted.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be logged in to verify residency' }, { status: 401 })
    }
    const userId = session.user.id

    // Every attempt costs a model call — throttle per user and per IP.
    const ip = getClientIp(request)
    for (const key of [`residency:user:${userId}`, `residency:ip:${ip}`]) {
      const result = checkRateLimit(key, RATE_LIMITS.residencyVerification)
      if (!result.allowed) return rateLimitResponse(result)
    }

    if (!isExtractionConfigured()) {
      return NextResponse.json(
        { error: 'Residency verification is not available right now' },
        { status: 503 }
      )
    }

    const form = await request.formData()
    const file = form.get('file')
    const apartmentId = String(form.get('apartmentId') || '')
    const unitNumber = normalizeUnit(String(form.get('unitNumber') || ''))
    const legalName = String(form.get('legalName') || '').trim()

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'A document file is required' }, { status: 400 })
    }
    if (!apartmentId || !unitNumber) {
      return NextResponse.json({ error: 'Apartment and unit number are required' }, { status: 400 })
    }
    if (legalName.split(/\s+/).length < 2) {
      return NextResponse.json({ error: 'Enter your first and last name as printed on the document' }, { status: 400 })
    }
    if (!isAcceptedDocumentMimeType(file.type)) {
      return NextResponse.json({ error: 'Upload a JPEG, PNG, WebP, or PDF' }, { status: 400 })
    }
    if (file.size === 0 || file.size > MAX_DOCUMENT_BYTES) {
      return NextResponse.json(
        { error: `File must be under ${Math.round(MAX_DOCUMENT_BYTES / 1024 / 1024)} MB` },
        { status: 400 }
      )
    }

    const apartment = await prisma.apartment.findUnique({
      where: { id: apartmentId },
      select: { id: true, address: true, city: true, state: true, zipCode: true },
    })
    if (!apartment) {
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 })
    }

    // Already verified for this unit — don't spend another model call.
    const existing = await findVerifiedResidency(userId, apartmentId, unitNumber)
    if (existing) {
      return NextResponse.json({
        status: 'verified',
        alreadyVerified: true,
        verification: {
          id: existing.id,
          coveredFrom: existing.coveredFrom,
          coveredTo: existing.coveredTo,
          badge: deriveBadge(existing),
        },
      })
    }

    // Unit-level is the whole point: if Smarty knows this building, the unit
    // must be one USPS actually delivers to.
    let unitSmartyConfirmed = false
    if (isSmartyConfigured()) {
      const units = await fetchSecondaryAddresses(apartment.address, apartment.city, apartment.state, apartment.zipCode)
      if (units.length > 0) {
        unitSmartyConfirmed = units.some(u => unitsMatch(u.value, unitNumber))
        if (!unitSmartyConfirmed) {
          return NextResponse.json(
            { error: 'That unit number is not recognized for this address. Pick it from the unit list.' },
            { status: 400 }
          )
        }
      }
    }

    const data = Buffer.from(await file.arrayBuffer())
    const extraction = await extractResidencyDocument(data, file.type)

    // ---- Compare extraction to the claim -----------------------------------
    let rejection: RejectionReason | null = null
    const coverage = coverageFromDates(extraction)

    if (!extraction.isResidencyDocument) rejection = 'not_residency_document'
    else if (extraction.readability === 'poor') rejection = 'low_confidence'
    else if (extraction.tamperingIndicators.length > 0) rejection = 'tampering_suspected'
    else if (!namesMatch(legalName, extraction.namesOnDocument)) rejection = 'name_mismatch'
    else if (!streetsMatch(extraction.streetAddress, apartment.address)) rejection = 'address_mismatch'
    else if (!extraction.unitNumber) rejection = 'unit_missing'
    else if (!unitsMatch(extraction.unitNumber, unitNumber)) rejection = 'unit_mismatch'
    else if (!coverage.from && !coverage.to) rejection = 'date_missing'
    else if (!isWithinRecentWindow(coverage.to)) rejection = 'out_of_window'

    // The checks above run in order, so a rejection code tells us which
    // earlier checks passed. Record those booleans — not the values behind them.
    const failedBeforeName: RejectionReason[] = ['not_residency_document', 'low_confidence', 'tampering_suspected', 'name_mismatch']
    const failedBeforeUnit: RejectionReason[] = [...failedBeforeName, 'address_mismatch', 'unit_missing', 'unit_mismatch']

    const verification = await prisma.residencyVerification.create({
      data: {
        userId,
        apartmentId,
        unitNumber,
        method: 'document',
        documentType: extraction.documentType,
        status: rejection ? 'rejected' : 'verified',
        rejectionReason: rejection,
        nameMatched: rejection === null || !failedBeforeName.includes(rejection),
        unitMatched: rejection === null || !failedBeforeUnit.includes(rejection),
        unitSmartyConfirmed,
        coveredFrom: rejection ? null : coverage.from,
        coveredTo: rejection ? null : coverage.to,
        modelUsed: extractionModel(),
      },
      select: { id: true, status: true, coveredFrom: true, coveredTo: true },
    })

    if (rejection) {
      return NextResponse.json({
        status: 'rejected',
        reason: rejection,
        message: REJECTION_MESSAGES[rejection],
      })
    }

    return NextResponse.json({
      status: 'verified',
      verification: {
        id: verification.id,
        coveredFrom: verification.coveredFrom,
        coveredTo: verification.coveredTo,
        badge: deriveBadge(verification),
      },
    })
  } catch (error) {
    // Log the failure class only — never the document or extraction.
    console.error('Residency verification failed:', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json(
      { error: 'We could not process that document. Please try again.' },
      { status: 500 }
    )
  }
}
