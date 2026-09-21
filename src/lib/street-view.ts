import crypto from 'crypto'

// Metadata and image requests share these so both resolve the same panorama.
// Past ~100m the nearest panorama is often a neighboring house or a fence.
const SEARCH = { source: 'outdoor', radius: '100' }

// The key is restricted to our site's HTTP referrers, so server-side calls
// have to present one.
const SITE_REFERER = 'https://apartmentrater.io/'

/**
 * Google Street View Static image URL for a street address, or null when
 * there's no suitable Google-captured panorama within 100m (or no key).
 * Google aims the camera from the nearest panorama at the address.
 *
 * Google's terms forbid storing Street View imagery (panorama IDs are the only
 * exception), so build this per request and never persist the image or URL.
 */
export async function streetViewUrl(address: string): Promise<string | null> {
  const key = process.env.GOOGLE_STREET_VIEW_API_KEY
  if (!key) return null

  // The metadata endpoint is free. Only Google's own captures pass:
  // third-party uploads slip through `source=outdoor` and are mostly
  // leasing-tour 360s of closets and bathrooms.
  const meta = await fetch(
    signedUrl('/maps/api/streetview/metadata', { location: address, ...SEARCH, key }),
    { headers: { Referer: SITE_REFERER } }
  )
    .then(res => res.json() as Promise<{ status?: string; copyright?: string }>)
    .catch(() => null)
  if (meta?.status !== 'OK' || !meta.copyright?.includes('Google')) return null

  return signedUrl('/maps/api/streetview', {
    size: '640x320', // 640 is the API max; 2:1 suits both cards and the detail header
    location: address,
    ...SEARCH,
    return_error_code: 'true', // 404 instead of a gray "no imagery" tile
    key,
  })
}

// Optional URL signing: with a signing secret set, a scraped key can't be
// reused to request other images.
function signedUrl(endpoint: string, params: Record<string, string>): string {
  const path = `${endpoint}?${new URLSearchParams(params)}`
  const secret = process.env.GOOGLE_MAPS_URL_SIGNING_SECRET
  if (!secret) return `https://maps.googleapis.com${path}`

  const signature = crypto
    .createHmac('sha1', Buffer.from(secret, 'base64url'))
    .update(path)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_') // Google wants URL-safe base64 with padding kept
  return `https://maps.googleapis.com${path}&signature=${signature}`
}
