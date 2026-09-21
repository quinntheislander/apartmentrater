import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { deleteAccount } from '@/lib/account'

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

    const data = await request.json()
    if (data.confirm !== 'DELETE') {
      return NextResponse.json(
        { error: 'Please confirm account deletion' },
        { status: 400 }
      )
    }

    // Re-authenticate: account deletion is irreversible, so a stolen/shared
    // session shouldn't be enough. Ask for the password again.
    if (!data.password || typeof data.password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required to delete your account' },
        { status: 400 }
      )
    }

    const userId = session.user.id
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, password: true }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordValid = await bcrypt.compare(data.password, currentUser.password)
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    await deleteAccount(userId, currentUser.email)

    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
