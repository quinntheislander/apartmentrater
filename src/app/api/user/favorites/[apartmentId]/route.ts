import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ apartmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { apartmentId } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_apartmentId: {
          userId: session.user.id,
          apartmentId
        }
      }
    })

    return NextResponse.json({ isFavorited: !!favorite })
  } catch (error) {
    console.error('Error checking favorite:', error)
    return NextResponse.json(
      { error: 'Failed to check favorite' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ apartmentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { apartmentId } = await params

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_apartmentId: {
          userId: session.user.id,
          apartmentId
        }
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_apartmentId: {
          userId: session.user.id,
          apartmentId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
