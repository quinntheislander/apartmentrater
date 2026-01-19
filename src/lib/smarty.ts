/**
 * Smarty (formerly SmartyStreets) API Service
 *
 * This service provides address verification and secondary address (unit) lookup
 * using the Smarty US Street Address API and US Secondary Address API.
 *
 * Documentation: https://www.smarty.com/docs/cloud/us-street-api
 * Secondary API: https://www.smarty.com/docs/cloud/us-secondary-api
 */

export interface SmartySecondaryAddress {
  secondary: string           // e.g., "Apt 101", "Unit B", "Suite 200"
  secondary_number: string    // e.g., "101", "B", "200"
  secondary_designator: string // e.g., "Apt", "Unit", "Suite"
}

export interface SmartyAddressResult {
  delivery_line_1: string
  last_line: string
  components: {
    primary_number: string
    street_name: string
    street_suffix: string
    city_name: string
    state_abbreviation: string
    zipcode: string
    plus4_code: string
  }
  metadata: {
    latitude: number
    longitude: number
    county_name: string
  }
  secondary_addresses?: SmartySecondaryAddress[]
}

export interface UnitOption {
  value: string
  label: string
  isVerified: boolean
}

/**
 * Smarty API Configuration
 * Set these environment variables:
 * - SMARTY_AUTH_ID: Your Smarty auth ID
 * - SMARTY_AUTH_TOKEN: Your Smarty auth token
 */
const SMARTY_API_BASE = 'https://us-street.api.smarty.com/street-address'
const SMARTY_SECONDARY_API_BASE = 'https://us-secondary.api.smarty.com/lookup'

/**
 * Fetch valid secondary addresses (units) for a given street address
 *
 * @param streetAddress - The street address (e.g., "123 Main St")
 * @param city - City name
 * @param state - State abbreviation (e.g., "FL")
 * @param zipCode - ZIP code
 * @returns Array of unit options, or empty array if none found
 */
export async function fetchSecondaryAddresses(
  streetAddress: string,
  city: string,
  state: string,
  zipCode: string
): Promise<UnitOption[]> {
  const authId = process.env.SMARTY_AUTH_ID
  const authToken = process.env.SMARTY_AUTH_TOKEN

  // Return empty if credentials not configured
  if (!authId || !authToken) {
    console.warn('Smarty API credentials not configured - falling back to manual entry')
    return []
  }

  try {
    const params = new URLSearchParams({
      'auth-id': authId,
      'auth-token': authToken,
      street: streetAddress,
      city: city,
      state: state,
      zipcode: zipCode,
      candidates: '1',
      match: 'enhanced'
    })

    const response = await fetch(`${SMARTY_SECONDARY_API_BASE}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Smarty API error:', response.status, response.statusText)
      return []
    }

    const data = await response.json()

    if (!data || !Array.isArray(data) || data.length === 0) {
      return []
    }

    // Extract secondary addresses from the response
    const result = data[0] as SmartyAddressResult

    if (!result.secondary_addresses || result.secondary_addresses.length === 0) {
      return []
    }

    // Convert to UnitOption format
    return result.secondary_addresses.map((addr) => ({
      value: addr.secondary_number,
      label: addr.secondary, // Full format like "Apt 101"
      isVerified: true
    }))

  } catch (error) {
    console.error('Error fetching secondary addresses from Smarty:', error)
    return []
  }
}

/**
 * Verify a street address using Smarty API
 * Returns verified address data or null if invalid
 */
export async function verifyAddress(
  streetAddress: string,
  city: string,
  state: string,
  zipCode?: string
): Promise<SmartyAddressResult | null> {
  const authId = process.env.SMARTY_AUTH_ID
  const authToken = process.env.SMARTY_AUTH_TOKEN

  if (!authId || !authToken) {
    console.warn('Smarty API credentials not configured')
    return null
  }

  try {
    const params = new URLSearchParams({
      'auth-id': authId,
      'auth-token': authToken,
      street: streetAddress,
      city: city,
      state: state,
      candidates: '1',
      match: 'enhanced'
    })

    if (zipCode) {
      params.set('zipcode', zipCode)
    }

    const response = await fetch(`${SMARTY_API_BASE}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data || !Array.isArray(data) || data.length === 0) {
      return null
    }

    return data[0] as SmartyAddressResult

  } catch (error) {
    console.error('Error verifying address with Smarty:', error)
    return null
  }
}

/**
 * Check if Smarty API is configured and available
 */
export function isSmartyConfigured(): boolean {
  return !!(process.env.SMARTY_AUTH_ID && process.env.SMARTY_AUTH_TOKEN)
}
