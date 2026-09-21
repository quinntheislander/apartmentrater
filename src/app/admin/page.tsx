import Link from 'next/link'
import { prisma } from '@/lib/db'
import { requireAdminPage } from '@/lib/admin'

export default async function AdminOverviewPage() {
  await requireAdminPage()

  const [users, unverified, apartments, reviews, flagged, photoUsage] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: null } }),
    prisma.apartment.count(),
    prisma.review.count({ where: { moderationStatus: { not: 'removed' } } }),
    prisma.review.count({ where: { moderationStatus: 'flagged' } }),
    prisma.$queryRaw<{ count: number }[]>`
      SELECT "count" FROM "ApiUsage"
      WHERE "metric" = 'listing_photo'
        AND "day" = (now() AT TIME ZONE 'America/New_York')::date`,
  ])

  const stats = [
    { label: 'Users', value: users, detail: `${unverified} unverified`, href: '/admin/users' },
    { label: 'Apartments', value: apartments, href: '/admin/apartments' },
    { label: 'Reviews', value: reviews, detail: `${flagged} flagged` },
    {
      label: 'Listing photos today',
      value: photoUsage[0]?.count ?? 0,
      detail: `of ${process.env.LISTING_PHOTO_DAILY_LIMIT ?? 33} daily cap`,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => {
        const card = (
          <div className="bg-white rounded-xl shadow-sm p-5 h-full">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
            {stat.detail && <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>}
          </div>
        )
        return stat.href ? (
          <Link key={stat.label} href={stat.href} className="hover:opacity-90">{card}</Link>
        ) : (
          <div key={stat.label}>{card}</div>
        )
      })}
    </div>
  )
}
