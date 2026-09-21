import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { streetViewUrl } from '@/lib/street-view'

// Redirects to a Street View image of the apartment's address, so the API key
// isn't baked into page HTML or the client bundle. The image goes straight
// from Google to the browser; we never proxy or store it.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const apartment = await prisma.apartment.findUnique({
    where: { id },
    select: { address: true, city: true, state: true, zipCode: true },
  })

  if (!apartment) {
    return new NextResponse(null, { status: 404 })
  }

  const url = await streetViewUrl(
    `${apartment.address}, ${apartment.city}, ${apartment.state} ${apartment.zipCode}`
  )

  // Caching either answer is fine under Google's terms: the redirect is our own
  // URL built from our own data, and "no photo" says less than a panorama ID,
  // which Google explicitly allows storing. Each deploy gets a fresh CDN cache.
  const headers = { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' }
  if (!url) {
    return new NextResponse(null, { status: 404, headers })
  }
  return NextResponse.redirect(url, { status: 307, headers })
}
