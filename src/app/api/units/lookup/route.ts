import { NextResponse } from 'next/server'
import { fetchSecondaryAddresses, isSmartyConfigured } from '@/lib/smarty'
import { validateJacksonvilleAddress } from '@/lib/geo'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const streetAddress = searchParams.get('streetAddress')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const zipCode = searchParams.get('zipCode') || ''

    // Validate required parameters
    if (!streetAddress || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required parameters: streetAddress, city, state' },
        { status: 400 }
      )
    }

    // Validate Jacksonville area
    const geoError = validateJacksonvilleAddress({ city, state, zipCode: zipCode || undefined })
    if (geoError) {
      return NextResponse.json(
        { error: geoError },
        { status: 400 }
      )
    }

    // Check if Smarty is configured
    if (!isSmartyConfigured()) {
      // Return empty array to trigger manual entry fallback
      return NextResponse.json({
        units: [],
        message: 'Unit verification service not configured - manual entry required'
      })
    }

    // Fetch units from Smarty API
    const units = await fetchSecondaryAddresses(streetAddress, city, state, zipCode)

    return NextResponse.json({
      units,
      source: units.length > 0 ? 'smarty' : 'none'
    })

  } catch (error) {
    console.error('Error looking up units:', error)
    return NextResponse.json(
      { error: 'Failed to look up units' },
      { status: 500 }
    )
  }
}
