import { prisma } from '@/lib/db'

const PLACES = 'https://places.googleapis.com/v1'

// Listing photos bill per request with no caching allowed, so cap them per day.
// ~33/day keeps us inside Google's 1,000 free photos a month.
const DAILY_LISTING_PHOTO_LIMIT = Number(process.env.LISTING_PHOTO_DAILY_LIMIT ?? 33)

// Server-side only: never sent to the browser. GOOGLE_MAPS_API_KEY is the local
// dev fallback (the scripts' key already allows Places API (New)).
function placesKey() {
  return process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY
}

export interface ListingPhoto {
  src: string
  credit: { name: string; uri?: string }
}

/**
 * Finds the apartment's Google Maps listing. Returns the place ID, '' when
 * Google has no listing at that street address, or null on a transient
 * failure (so the caller can retry later instead of caching a miss).
 *
 * Place IDs are the one Places value Google lets us store indefinitely.
 */
export async function findPlaceId(apartment: {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
}): Promise<string | null> {
  const key = placesKey()
  if (!key) return null

  const res = await fetch(`${PLACES}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id,places.formattedAddress',
    },
    body: JSON.stringify({
      textQuery: `${apartment.name}, ${apartment.address}, ${apartment.city}, ${apartment.state} ${apartment.zipCode}`,
      pageSize: 1,
    }),
  }).catch(() => null)
  if (!res?.ok) return null

  const { places } = (await res.json()) as {
    places?: { id: string; formattedAddress?: string }[]
  }
  const top = places?.[0]
  // Only accept a listing at the same street number: a name-only hit is
  // often a different complex nearby.
  const streetNumber = apartment.address.split(' ')[0]
  if (!top || !top.formattedAddress?.startsWith(`${streetNumber} `)) return ''
  return top.id
}

/**
 * The listing's cover photo (usually the property's own upload), or null if
 * it has none, the daily cap is spent, or Google errors.
 *
 * Google forbids storing photo names or photo URLs, so this runs per request
 * and the result must never be cached.
 */
export async function listingPhoto(placeId: string): Promise<ListingPhoto | null> {
  const key = placesKey()
  if (!key) return null

  // Free: the photos field is in Place Details' IDs-only tier
  const details = await fetch(`${PLACES}/places/${placeId}`, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'photos' },
  })
    .then(res => (res.ok ? res.json() : null))
    .catch(() => null) as {
      photos?: { name: string; authorAttributions?: { displayName: string; uri?: string }[] }[]
    } | null
  const photo = details?.photos?.[0]
  if (!photo) return null

  if (!(await withinDailyLimit('listing_photo', DAILY_LISTING_PHOTO_LIMIT))) return null

  // Billed. skipHttpRedirect returns a short-lived keyless URL for the browser.
  const media = await fetch(
    `${PLACES}/${photo.name}/media?maxWidthPx=800&skipHttpRedirect=true`,
    { headers: { 'X-Goog-Api-Key': key } }
  )
    .then(res => (res.ok ? res.json() : null))
    .catch(() => null) as { photoUri?: string } | null
  if (!media?.photoUri) return null

  const author = photo.authorAttributions?.[0]
  return {
    src: media.photoUri,
    credit: { name: author?.displayName ?? 'Google Maps user', uri: author?.uri },
  }
}

/** Atomically counts one use of `metric` today (Eastern) and reports whether it's within `limit`. */
async function withinDailyLimit(metric: string, limit: number): Promise<boolean> {
  const [row] = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "ApiUsage" ("metric", "day", "count")
    VALUES (${metric}, (now() AT TIME ZONE 'America/New_York')::date, 1)
    ON CONFLICT ("metric", "day") DO UPDATE SET "count" = "ApiUsage"."count" + 1
    RETURNING "count"`
  return row.count <= limit
}
