/**
 * Geographic constraints for Jacksonville, FL (Duval County) pilot
 * All searches and submissions are restricted to this area
 */

// Jacksonville/Duval County approximate bounding box
export const JACKSONVILLE_BOUNDS = {
  north: 30.5859,  // Northern boundary
  south: 30.1031,  // Southern boundary
  east: -81.3929,  // Eastern boundary
  west: -82.0479,  // Western boundary
}

// Valid zip codes for Jacksonville/Duval County area
export const JACKSONVILLE_ZIP_CODES = [
  '32099', '32201', '32202', '32203', '32204', '32205', '32206', '32207', '32208', '32209',
  '32210', '32211', '32212', '32214', '32216', '32217', '32218', '32219', '32220', '32221',
  '32222', '32223', '32224', '32225', '32226', '32227', '32228', '32229', '32231', '32232',
  '32233', '32234', '32235', '32236', '32237', '32238', '32239', '32240', '32241', '32244',
  '32245', '32246', '32247', '32250', '32254', '32255', '32256', '32257', '32258', '32259',
  '32260', '32266', '32267', '32277'
]

// Hardcoded city/state for Jacksonville pilot
export const JACKSONVILLE_CITY = 'Jacksonville'
export const JACKSONVILLE_STATE = 'FL'
export const JACKSONVILLE_COUNTY = 'Duval'

/**
 * Check if coordinates fall within Jacksonville bounds
 */
export function isWithinJacksonvilleBounds(lat: number, lng: number): boolean {
  return (
    lat >= JACKSONVILLE_BOUNDS.south &&
    lat <= JACKSONVILLE_BOUNDS.north &&
    lng >= JACKSONVILLE_BOUNDS.west &&
    lng <= JACKSONVILLE_BOUNDS.east
  )
}

/**
 * Check if a zip code is valid for Jacksonville
 */
export function isJacksonvilleZipCode(zipCode: string): boolean {
  // Handle 5-digit and ZIP+4 formats
  const fiveDigit = zipCode.split('-')[0]
  return JACKSONVILLE_ZIP_CODES.includes(fiveDigit)
}

/**
 * Validate that an address is within Jacksonville service area
 * Returns an error message if invalid, null if valid
 */
export function validateJacksonvilleAddress(params: {
  city?: string
  state?: string
  zipCode?: string
  latitude?: number
  longitude?: number
}): string | null {
  const { city, state, zipCode, latitude, longitude } = params

  // Check state
  if (state && state.toUpperCase() !== JACKSONVILLE_STATE) {
    return 'This service is currently only available in Jacksonville, FL'
  }

  // Check city (case-insensitive)
  if (city && city.toLowerCase() !== JACKSONVILLE_CITY.toLowerCase()) {
    // Allow some variations
    const validCityNames = ['jacksonville', 'jax', 'jacksonville beach', 'atlantic beach', 'neptune beach']
    if (!validCityNames.includes(city.toLowerCase())) {
      return 'This service is currently only available in the Jacksonville, FL area'
    }
  }

  // Check zip code if provided
  if (zipCode && !isJacksonvilleZipCode(zipCode)) {
    return 'This zip code is outside the Jacksonville service area'
  }

  // Check coordinates if provided
  if (latitude !== undefined && longitude !== undefined) {
    if (!isWithinJacksonvilleBounds(latitude, longitude)) {
      return 'This location is outside the Jacksonville service area'
    }
  }

  return null // Valid
}
