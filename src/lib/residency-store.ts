/**
 * Residency verification persistence helpers (server only).
 */

import { prisma } from './db'
import { normalizeUnit } from './residency'

/**
 * The most recent successful verification this user holds for this unit.
 * Review routes call this to link a review to its verification server-side,
 * so the badge can never be asserted from the request body.
 */
export async function findVerifiedResidency(
  userId: string,
  apartmentId: string,
  unitNumber: string | null | undefined
) {
  const unit = normalizeUnit(unitNumber)
  if (!unit) return null

  return prisma.residencyVerification.findFirst({
    where: { userId, apartmentId, unitNumber: unit, status: 'verified' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, status: true, method: true, coveredFrom: true, coveredTo: true, createdAt: true },
  })
}
