import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to mark reviews as helpful' },
        { status: 401 }
      )
    }

    const { reviewId } = await params

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    if (review.userId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot mark your own review as helpful' },
        { status: 400 }
      )
    }

    const existingVote = await prisma.helpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id,
          reviewId
        }
      }
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already marked this review as helpful' },
        { status: 400 }
      )
    }

    await prisma.$transaction([
      prisma.helpfulVote.create({
        data: {
          userId: session.user.id,
          reviewId
        }
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { helpful: { increment: 1 } }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding helpful vote:', error)
    return NextResponse.json(
      { error: 'Failed to add helpful vote' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to remove helpful vote' },
        { status: 401 }
      )
    }

    const { reviewId } = await params

    const existingVote = await prisma.helpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id,
          reviewId
        }
      }
    })

    if (!existingVote) {
      return NextResponse.json(
        { error: 'You have not marked this review as helpful' },
        { status: 400 }
      )
    }

    await prisma.$transaction([
      prisma.helpfulVote.delete({
        where: {
          userId_reviewId: {
            userId: session.user.id,
            reviewId
          }
        }
      }),
      prisma.review.update({
        where: { id: reviewId },
        data: { helpful: { decrement: 1 } }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing helpful vote:', error)
    return NextResponse.json(
      { error: 'Failed to remove helpful vote' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { reviewId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ hasVoted: false })
    }

    const existingVote = await prisma.helpfulVote.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id,
          reviewId
        }
      }
    })

    return NextResponse.json({ hasVoted: !!existingVote })
  } catch (error) {
    console.error('Error checking helpful vote:', error)
    return NextResponse.json(
      { error: 'Failed to check helpful vote' },
      { status: 500 }
    )
  }
}
