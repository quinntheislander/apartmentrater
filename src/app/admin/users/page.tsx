import Link from 'next/link'
import type { Prisma } from '@prisma/client'
import { UserPlus } from 'lucide-react'
import { prisma } from '@/lib/db'
import { requireAdminPage, isAdminEmail } from '@/lib/admin'
import AdminSearch from '@/components/admin/AdminSearch'
import AdminPagination from '@/components/admin/AdminPagination'

const PAGE_SIZE = 25

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  await requireAdminPage()
  const { q = '', page = '1' } = await searchParams
  const pageNum = Math.max(1, parseInt(page) || 1)
  const term = q.trim()

  const where: Prisma.UserWhereInput = term
    ? {
        OR: [
          { email: { contains: term, mode: 'insensitive' } },
          { name: { contains: term, mode: 'insensitive' } },
        ],
      }
    : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { reviews: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <div className="flex-1 max-w-xl">
          <AdminSearch q={term} placeholder="Search by email or name" />
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Invite user
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Reviews</th>
              <th className="py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 pr-4">
                  <Link href={`/admin/users/${user.id}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </Link>
                  {isAdminEmail(user.email) && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Admin</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-gray-700">{user.name ?? '—'}</td>
                <td className="py-2 pr-4">
                  {user.emailVerified ? (
                    <span className="text-green-700">Verified</span>
                  ) : (
                    <span className="text-amber-700">Unverified</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-gray-700">{user._count.reviews}</td>
                <td className="py-2 text-gray-500">{user.createdAt.toLocaleDateString('en-US')}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        basePath="/admin/users"
        q={term}
        page={pageNum}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        total={total}
      />
    </div>
  )
}
