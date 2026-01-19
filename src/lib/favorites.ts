import { prisma } from '@/lib/db'

export async function getUserFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      apartment: {
        include: {
          reviews: {
            select: { overallRating: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return favorites.map(fav => ({
    ...fav.apartment,
    averageRating: fav.apartment.reviews.length > 0
      ? fav.apartment.reviews.reduce((sum, r) => sum + r.overallRating, 0) / fav.apartment.reviews.length
      : null,
    reviewCount: fav.apartment.reviews.length
  }))
}
