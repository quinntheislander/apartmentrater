import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdmin, adminNotFound } from '@/lib/admin'
import { parseApartmentInput } from '@/lib/apartment-input'

export async function POST(request: Request) {
  try {
    if (!(await getAdmin())) return adminNotFound()

    const parsed = parseApartmentInput(await request.json())
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 })

    const apartment = await prisma.apartment.create({ data: parsed.data, select: { id: true } })
    return NextResponse.json(apartment)
  } catch (error) {
    console.error('Admin apartment create error:', error)
    return NextResponse.json({ error: 'Failed to create apartment' }, { status: 500 })
  }
}
