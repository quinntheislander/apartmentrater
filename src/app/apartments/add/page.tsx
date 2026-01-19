import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { authOptions } from '@/lib/auth'
import AddApartmentForm from '@/components/AddApartmentForm'

export default async function AddApartmentPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/apartments"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to apartments
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-2">Add a New Apartment</h1>
        <p className="text-gray-600 mb-8">
          Can&apos;t find the apartment you&apos;re looking for? Add it here so you can leave a review.
        </p>

        <AddApartmentForm />
      </div>
    </div>
  )
}
