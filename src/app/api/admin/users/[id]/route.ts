import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { getAdmin, adminNotFound } from '@/lib/admin'
import { deleteAccount } from '@/lib/account'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await getAdmin()
    if (!admin) return adminNotFound()

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, emailVerified: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await request.json()
    const isSelf = user.id === admin.id
    const data: Prisma.UserUpdateInput = {}

    if ('name' in body) {
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : ''
      data.name = name || null
    }

    if ('email' in body) {
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
      if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
      }
      if (email !== user.email) {
        // Changing your own email here could drop you out of ADMIN_EMAILS
        if (isSelf) {
          return NextResponse.json({ error: "You can't change your own email here" }, { status: 400 })
        }
        const taken = await prisma.user.findUnique({ where: { email }, select: { id: true } })
        if (taken) {
          return NextResponse.json({ error: 'Another user already has that email' }, { status: 409 })
        }
        data.email = email
      }
    }

    if ('emailVerified' in body) {
      const verified = Boolean(body.emailVerified)
      if (isSelf && !verified) {
        return NextResponse.json({ error: "You can't unverify your own account" }, { status: 400 })
      }
      data.emailVerified = verified ? (user.emailVerified ?? new Date()) : null
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, emailVerified: true },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Admin user update error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// Same deletion as self-service: the user's reviews, votes, and favorites go too
export async function DELETE(request: Request, { params }: Params) {
  try {
    const admin = await getAdmin()
    if (!admin) return adminNotFound()

    const { id } = await params
    if (id === admin.id) {
      return NextResponse.json(
        { error: 'Delete your own account from your profile page' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await deleteAccount(user.id, user.email)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin user delete error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
