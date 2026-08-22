import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findVerifiedResidency } from '@/lib/residency-store'
import { deriveBadge } from '@/lib/residency'
import { isExtractionConfigured } from '@/lib/residency-extraction'

/**
 * GET /api/verify/residency?apartmentId=...&unitNumber=...
 * Returns the caller's verification status for a unit so the review form can
 * show "already verified" instead of asking for another upload.
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const apartmentId = searchParams.get('apartmentId')
  const unitNumber = searchParams.get('unitNumber')

  if (!apartmentId || !unitNumber) {
    return NextResponse.json({ error: 'apartmentId and unitNumber are required' }, { status: 400 })
  }

  const verification = await findVerifiedResidency(session.user.id, apartmentId, unitNumber)

  return NextResponse.json({
    available: isExtractionConfigured(),
    verification: verification
      ? {
          id: verification.id,
          method: verification.method,
          coveredFrom: verification.coveredFrom,
          coveredTo: verification.coveredTo,
          badge: deriveBadge(verification),
        }
      : null,
  })
}
