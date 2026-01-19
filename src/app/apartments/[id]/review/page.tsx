import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ReviewForm from '@/components/ReviewForm'

async function getApartment(id: string) {
  return prisma.apartment.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      zipCode: true
    }
  })
}

async function getReviewForEdit(reviewId: string, userId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      title: true,
      experienceSummary: true,
      noiseLevel: true,
      naturalLight: true,
      generalVibe: true,
      wouldRecommend: true,
      anonymous: true,
      unitNumber: true,
      isUnitVerified: true,
      leaseStartDate: true,
      leaseEndDate: true,
      certifiedPersonalExperience: true,
      userId: true
    }
  })

  if (!review || review.userId !== userId) {
    return null
  }

  return {
    ...review,
    leaseStartDate: review.leaseStartDate?.toISOString() || null,
    leaseEndDate: review.leaseEndDate?.toISOString() || null
  }
}

export default async function ReviewPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ edit?: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const { id } = await params
  const { edit: editReviewId } = await searchParams
  const apartment = await getApartment(id)

  if (!apartment) {
    notFound()
  }

  let editReview = null
  if (editReviewId) {
    editReview = await getReviewForEdit(editReviewId, session.user.id)
    if (!editReview) {
      redirect(`/apartments/${id}/review`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/apartments/${apartment.id}`}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to apartment
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-2">
          {editReview ? 'Edit Your Review' : 'Write a Review'}
        </h1>
        <p className="text-gray-600 mb-8">
          {apartment.name} - {apartment.address}, {apartment.city}, {apartment.state}
        </p>

        <ReviewForm
          apartmentId={apartment.id}
          apartmentInfo={{
            address: apartment.address,
            city: apartment.city,
            state: apartment.state,
            zipCode: apartment.zipCode
          }}
          editReview={editReview}
        />
      </div>
    </div>
  )
}
