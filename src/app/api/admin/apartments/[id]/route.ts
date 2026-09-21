import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdmin, adminNotFound } from '@/lib/admin'
import { parseApartmentInput } from '@/lib/apartment-input'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  try {
    if (!(await getAdmin())) return adminNotFound()

    const { id } = await params
    const existing = await prisma.apartment.findUnique({
      where: { id },
      select: { name: true, address: true, city: true, zipCode: true },
    })
    if (!existing) return NextResponse.json({ error: 'Apartment not found' }, { status: 404 })

    const parsed = parseApartmentInput(await request.json())
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 })

    // The Google listing was matched on name + address; re-match if they change
    const moved = (['name', 'address', 'city', 'zipCode'] as const).some(
      key => parsed.data[key] !== existing[key]
    )

    const apartment = await prisma.apartment.update({
      where: { id },
      data: { ...parsed.data, ...(moved && { googlePlaceId: null }) },
      select: { id: true },
    })
    return NextResponse.json(apartment)
  } catch (error) {
    console.error('Admin apartment update error:', error)
    return NextResponse.json({ error: 'Failed to update apartment' }, { status: 500 })
  }
}

// Cascades to the apartment's reviews, favorites, and residency checks
export async function DELETE(request: Request, { params }: Params) {
  try {
    if (!(await getAdmin())) return adminNotFound()

    const { id } = await params
    const existing = await prisma.apartment.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return NextResponse.json({ error: 'Apartment not found' }, { status: 404 })

    await prisma.apartment.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin apartment delete error:', error)
    return NextResponse.json({ error: 'Failed to delete apartment' }, { status: 500 })
  }
}
