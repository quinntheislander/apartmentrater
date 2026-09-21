import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireAdminPage } from '@/lib/admin'
import EditUserForm from '@/components/admin/EditUserForm'
import ConfirmDeleteButton from '@/components/admin/ConfirmDeleteButton'

export default async function AdminEditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ invited?: string }>
}) {
  const admin = await requireAdminPage()
  const { id } = await params
  const { invited } = await searchParams

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      createdAt: true,
      tosAcceptedAt: true,
      _count: { select: { reviews: true, favorites: true } },
    },
  })
  if (!user) notFound()

  const isSelf = user.id === admin.id

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">← Users</Link>
        <h2 className="text-xl font-semibold text-gray-900 mt-2">{user.email}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Joined {user.createdAt.toLocaleDateString('en-US')} · {user._count.reviews} reviews ·{' '}
          {user._count.favorites} favorites ·{' '}
          {user.tosAcceptedAt
            ? `accepted Terms ${user.tosAcceptedAt.toLocaleDateString('en-US')}`
            : 'no Terms acceptance on record'}
        </p>
        {invited && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mt-4">
            Invite sent to {user.email}.
          </div>
        )}
        <div className="mt-6">
          <EditUserForm
            user={{ id: user.id, email: user.email, name: user.name, emailVerified: !!user.emailVerified }}
            isSelf={isSelf}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
        <h3 className="font-semibold text-gray-900 mb-3">Delete user</h3>
        {isSelf ? (
          <p className="text-sm text-gray-500">
            To delete your own account, use your <Link href="/profile" className="text-blue-600 hover:underline">profile page</Link>.
          </p>
        ) : (
          <ConfirmDeleteButton
            endpoint={`/api/admin/users/${user.id}`}
            confirmText={user.email}
            label="Delete user"
            warning={`This permanently deletes the account and its ${user._count.reviews} reviews, votes, and favorites. It can't be undone.`}
            redirectTo="/admin/users"
          />
        )}
      </div>
    </div>
  )
}
