import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin'
import InviteUserForm from '@/components/admin/InviteUserForm'

export default async function AdminInviteUserPage() {
  await requireAdminPage()

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">← Users</Link>
      <h2 className="text-xl font-semibold text-gray-900 mt-2 mb-4">Invite a user</h2>
      <InviteUserForm />
    </div>
  )
}
