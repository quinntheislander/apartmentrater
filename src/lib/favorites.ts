import { prisma } from '@/lib/db'

interface FavoriteApartment {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  imageUrl: string | null
  averageRating: number | null
  reviewCount: number
}

export async function getUserFavorites(userId: string): Promise<FavoriteApartment[]> {
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

  return favorites.map((fav: typeof favorites[number]) => ({
    id: fav.apartment.id,
    name: fav.apartment.name,
    address: fav.apartment.address,
    city: fav.apartment.city,
    state: fav.apartment.state,
    zipCode: fav.apartment.zipCode,
    propertyType: fav.apartment.propertyType,
    imageUrl: fav.apartment.imageUrl,
    averageRating: fav.apartment.reviews.length > 0
      ? fav.apartment.reviews.reduce((sum: number, r: { overallRating: number }) => sum + r.overallRating, 0) / fav.apartment.reviews.length
      : null,
    reviewCount: fav.apartment.reviews.length
  }))
}
