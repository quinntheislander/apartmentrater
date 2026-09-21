import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { findPlaceId, listingPhoto } from '@/lib/google-places'
import { streetViewUrl } from '@/lib/street-view'

export type PhotoResponse =
  | { source: 'listing'; src: string; credit: { name: string; uri?: string } }
  | { source: 'streetview'; src: string }
  | { source: 'none' }

// Picks the apartment's photo: its Google Maps listing photo (usually the
// property's own), else Street View, else nothing. Images go straight from
// Google to the browser; we never proxy or store them.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const apartment = await prisma.apartment.findUnique({
    where: { id },
    select: {
      name: true, address: true, city: true, state: true, zipCode: true, googlePlaceId: true,
    },
  })
  if (!apartment) {
    return NextResponse.json({ source: 'none' } satisfies PhotoResponse, { status: 404 })
  }

  // First request for an apartment finds and saves its listing ('' = none found)
  let placeId = apartment.googlePlaceId
  if (placeId === null) {
    placeId = await findPlaceId(apartment)
    if (placeId !== null) {
      await prisma.apartment.update({ where: { id }, data: { googlePlaceId: placeId } })
    }
  }

  if (placeId) {
    const photo = await listingPhoto(placeId)
    if (photo) {
      // Google forbids caching listing photo URLs
      return NextResponse.json(
        { source: 'listing', ...photo } satisfies PhotoResponse,
        { headers: { 'Cache-Control': 'private, no-store' } }
      )
    }
  }

  const src = await streetViewUrl(
    `${apartment.address}, ${apartment.city}, ${apartment.state} ${apartment.zipCode}`
  )
  const body: PhotoResponse = src ? { source: 'streetview', src } : { source: 'none' }

  // Street View answers are safe to cache (our own URL, or "no photo"). But if
  // a listing exists, this fallback may just mean today's cap is spent, so keep
  // it short enough to pick the listing photo back up tomorrow.
  const cache = placeId
    ? 'public, max-age=0, s-maxage=600'
    : 'public, max-age=3600, s-maxage=86400'
  return NextResponse.json(body, { headers: { 'Cache-Control': cache } })
}
