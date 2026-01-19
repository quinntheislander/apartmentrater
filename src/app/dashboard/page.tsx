import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getUserFavorites } from '@/lib/favorites'
import DashboardContent from '@/components/DashboardContent'

async function getUserReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    include: {
      apartment: {
        select: {
          id: true,
          name: true,
          address: true,
          city: true,
          state: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true }
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const [reviews, favorites, user] = await Promise.all([
    getUserReviews(session.user.id),
    getUserFavorites(session.user.id),
    getUserProfile(session.user.id)
  ])

  return (
    <DashboardContent
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: user?.emailVerified ?? null
      }}
      reviews={reviews}
      favorites={favorites}
    />
  )
}
