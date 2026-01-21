import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, image } = data

    // Validate image URL if provided
    if (image) {
      try {
        new URL(image)
      } catch {
        return NextResponse.json(
          { error: 'Invalid image URL' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        image: image || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Require confirmation in the request body
    const data = await request.json()
    if (data.confirm !== 'DELETE') {
      return NextResponse.json(
        { error: 'Please confirm account deletion' },
        { status: 400 }
      )
    }

    const userId = session.user.id

    // Delete all user data in the correct order (respecting foreign key constraints)
    // The Prisma schema has onDelete: Cascade for most relations, but we'll be explicit
    await prisma.$transaction(async (tx) => {
      // Delete helpful votes by this user
      await tx.helpfulVote.deleteMany({ where: { userId } })

      // Delete favorites
      await tx.favorite.deleteMany({ where: { userId } })

      // Delete reviews by this user
      await tx.review.deleteMany({ where: { userId } })

      // Delete sessions
      await tx.session.deleteMany({ where: { userId } })

      // Delete accounts (OAuth connections)
      await tx.account.deleteMany({ where: { userId } })

      // Delete verification tokens for this user's email
      const user = await tx.user.findUnique({ where: { id: userId }, select: { email: true } })
      if (user?.email) {
        await tx.verificationToken.deleteMany({
          where: {
            OR: [
              { identifier: user.email },
              { identifier: `password-reset:${user.email}` }
            ]
          }
        })
      }

      // Finally, delete the user
      await tx.user.delete({ where: { id: userId } })
    })

    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
