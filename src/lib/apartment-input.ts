import { validateJacksonvilleAddress, JACKSONVILLE_STATE } from '@/lib/geo'

export const PROPERTY_TYPES = ['apartment', 'condo', 'house', 'townhouse'] as const

export interface ApartmentInput {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  description: string | null
  propertyType: string
  unitCount: number | null
  yearBuilt: number | null
  amenities: string | null // JSON array, as AmenitiesList expects
  imageUrl: string | null
}

/** Validates the admin apartment form. Returns the data to save, or an error message. */
export function parseApartmentInput(body: Record<string, unknown>): { data: ApartmentInput } | { error: string } {
  const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

  const name = text(body.name)
  const address = text(body.address)
  const city = text(body.city) || 'Jacksonville'
  const zipCode = text(body.zipCode)
  const description = text(body.description)
  const propertyType = text(body.propertyType) || 'apartment'
  const imageUrl = text(body.imageUrl)

  if (!name || name.length > 200) return { error: 'Name is required (200 characters max)' }
  if (!address || address.length > 200) return { error: 'Address is required (200 characters max)' }
  if (!/^\d{5}$/.test(zipCode)) return { error: 'ZIP code must be 5 digits' }
  if (description.length > 2000) return { error: 'Description is 2,000 characters max' }
  if (!(PROPERTY_TYPES as readonly string[]).includes(propertyType)) return { error: 'Unknown property type' }

  const geoError = validateJacksonvilleAddress({ city, state: JACKSONVILLE_STATE, zipCode })
  if (geoError) return { error: geoError }

  const unitCount = optionalInt(body.unitCount, 1, 100_000)
  if (unitCount === undefined) return { error: 'Unit count must be a whole number' }
  const yearBuilt = optionalInt(body.yearBuilt, 1800, new Date().getFullYear() + 5)
  if (yearBuilt === undefined) return { error: 'Year built must be a valid year' }

  if (imageUrl) {
    try {
      if (!['http:', 'https:'].includes(new URL(imageUrl).protocol)) throw new Error()
    } catch {
      return { error: 'Photo URL must be an http(s) link' }
    }
  }

  const amenities = text(body.amenities)
    .split(',')
    .map(a => a.trim())
    .filter(Boolean)

  return {
    data: {
      name,
      address,
      city,
      state: JACKSONVILLE_STATE,
      zipCode,
      description: description || null,
      propertyType,
      unitCount,
      yearBuilt,
      amenities: amenities.length ? JSON.stringify(amenities) : null,
      imageUrl: imageUrl || null,
    },
  }
}

/** null for blank, undefined for invalid. */
function optionalInt(value: unknown, min: number, max: number): number | null | undefined {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isInteger(n) && n >= min && n <= max ? n : undefined
}
