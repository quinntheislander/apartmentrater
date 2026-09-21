import { prisma } from '@/lib/db'

/**
 * Deletes a user and everything tied to them (reviews, votes, favorites,
 * reports they filed, sessions, pending tokens). Shared by self-service
 * account deletion and the admin portal; callers handle authorization.
 */
export async function deleteAccount(userId: string, email: string) {
  await prisma.$transaction(async (tx) => {
    await tx.helpfulVote.deleteMany({ where: { userId } })
    await tx.favorite.deleteMany({ where: { userId } })
    await tx.reviewReport.deleteMany({ where: { reporterId: userId } })
    await tx.review.deleteMany({ where: { userId } })
    await tx.session.deleteMany({ where: { userId } })
    await tx.account.deleteMany({ where: { userId } })
    await tx.verificationToken.deleteMany({
      where: {
        OR: [
          { identifier: email },
          { identifier: `password-reset:${email}` }
        ]
      }
    })
    await tx.user.delete({ where: { id: userId } })
  })
}
