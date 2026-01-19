/**
 * Jacksonville Tax Roll Import Script
 *
 * Imports apartment complexes from the Duval County Property Appraiser
 * tax roll data file into the Apartment Rater database.
 *
 * Usage: npx tsx src/scripts/importTaxRoll.ts
 */

const fs = require('fs')
const readline = require('readline')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Minimum buildings to qualify as an apartment complex
const MIN_BUILDINGS = 5

// Property use codes to include (based on DOR codes)
// 08 = Multi-family 2-9, 03 = Multi-family 10+, 04 = Condo
// But we'll filter by building count instead since codes vary
const APARTMENT_LIKE_CODES = ['03', '04', '08', '09', '12', '23', '33']

interface ParcelData {
  parcelId: string
  useCode: string
  records: string[]
  buildingCount: number
  yearBuilt?: number
}

interface ParsedApartment {
  parcelId: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  unitCount: number
  yearBuilt?: number
}

function parseAddress(addrRecord: string): { streetNum: string; streetDir: string; streetName: string; streetType: string; city: string; zip: string } | null {
  // Format: 00004|PARCEL_ID|STREET_NUM|DIR|STREET_NAME|TYPE|SUFFIX|CITY|ZIP|FLAG
  const parts = addrRecord.split('|')
  if (parts.length < 9) return null

  return {
    streetNum: parts[2] || '',
    streetDir: parts[3] || '',
    streetName: parts[4] || '',
    streetType: parts[5] || '',
    city: parts[7] || '',
    zip: (parts[8] || '').split('-')[0].trim() // Remove ZIP+4
  }
}

function parseOwnerName(ownerRecord: string): string {
  // Format: 00003|PARCEL_ID|LINE_NUM|OWNER_NAME
  const parts = ownerRecord.split('|')
  return parts[3] || 'Unknown Property'
}

function parseYearBuilt(buildingRecords: string[]): number | undefined {
  // Format: 00005|PARCEL_ID|LINE|CODE|DESC|...|YEAR_BUILT|...
  // Look for the most common/recent year
  const years: number[] = []

  for (const rec of buildingRecords) {
    const parts = rec.split('|')
    // Year built is typically in position 7 or 8
    for (let i = 6; i < 10; i++) {
      const val = parseInt(parts[i])
      if (val >= 1900 && val <= 2030) {
        years.push(val)
        break
      }
    }
  }

  if (years.length === 0) return undefined

  // Return the most common year, or the most recent if tied
  const yearCounts = new Map<number, number>()
  for (const y of years) {
    yearCounts.set(y, (yearCounts.get(y) || 0) + 1)
  }

  let bestYear = years[0]
  let bestCount = 0
  for (const [year, count] of yearCounts) {
    if (count > bestCount || (count === bestCount && year > bestYear)) {
      bestYear = year
      bestCount = count
    }
  }

  return bestYear
}

function formatPropertyName(ownerName: string, address: string): string {
  // Clean up owner name to create a property name
  let name = ownerName
    .replace(/\bLLC\b/gi, '')
    .replace(/\bLP\b/gi, '')
    .replace(/\bINC\b/gi, '')
    .replace(/\bCORP\b/gi, '')
    .replace(/\bLTD\b/gi, '')
    .replace(/\bCO\b/gi, '')
    .replace(/\bPROPERTIES\b/gi, '')
    .replace(/\bPROPERTY\b/gi, '')
    .replace(/\bAPARTMENTS?\b/gi, '')
    .replace(/\bHOLDINGS?\b/gi, '')
    .replace(/\bINVESTMENTS?\b/gi, '')
    .replace(/\bOWNER\b/gi, '')
    .replace(/\bFL\b/gi, '')
    .replace(/\bJACKSONVILLE\b/gi, '')
    .replace(/[,.\-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // If name is too short or generic, use address
  if (name.length < 3 || name.match(/^(YES|AP|THE|A|AN)$/i)) {
    const addrParts = address.split(' ')
    // Use street name
    name = addrParts.slice(1).join(' ')
  }

  // Capitalize properly
  name = name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

  // Add "Apartments" if not already descriptive
  if (!name.match(/(apartments|village|estates|commons|place|park|manor|court|gardens|terrace|landing|pointe|crossing)/i)) {
    name += ' Apartments'
  }

  return name
}

async function parseFile(filePath: string): Promise<ParsedApartment[]> {
  console.log('Parsing tax roll file...')

  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity })

  const parcels = new Map<string, ParcelData>()

  for await (const line of rl) {
    const parts = line.split('|')
    const recType = parts[0]
    const parcelId = parts[1]

    if (recType === '00001') {
      // Main property record
      parcels.set(parcelId, {
        parcelId,
        useCode: parts[2] || '',
        records: [line],
        buildingCount: 0
      })
    } else if (parcels.has(parcelId)) {
      const parcel = parcels.get(parcelId)!
      parcel.records.push(line)

      if (recType === '00005') {
        parcel.buildingCount++
      }
    }
  }

  console.log(`Found ${parcels.size} total parcels`)

  // Filter and convert to apartments
  const apartments: ParsedApartment[] = []

  for (const [id, data] of parcels) {
    // Must have enough buildings
    if (data.buildingCount < MIN_BUILDINGS) continue

    // Get address record
    const addrRecord = data.records.find(r => r.startsWith('00004|'))
    if (!addrRecord) continue

    const addr = parseAddress(addrRecord)
    if (!addr || addr.city.toUpperCase() !== 'JACKSONVILLE') continue
    if (!addr.zip || addr.zip.length < 5) continue

    // Get owner record
    const ownerRecord = data.records.find(r => r.startsWith('00003|'))
    const ownerName = ownerRecord ? parseOwnerName(ownerRecord) : 'Unknown'

    // Skip mobile home parks
    if (ownerName.match(/\b(MHP|MHC|MOBILE HOME|MANUFACTURED)\b/i)) continue

    // Get building records for year built
    const buildingRecords = data.records.filter(r => r.startsWith('00005|'))
    const yearBuilt = parseYearBuilt(buildingRecords)

    // Construct address string
    const streetParts = [addr.streetNum, addr.streetDir, addr.streetName, addr.streetType]
      .filter(Boolean)
      .join(' ')
      .trim()

    if (!streetParts) continue

    apartments.push({
      parcelId: id,
      name: formatPropertyName(ownerName, streetParts),
      address: streetParts,
      city: 'Jacksonville',
      state: 'FL',
      zipCode: addr.zip,
      propertyType: 'apartment',
      unitCount: data.buildingCount,
      yearBuilt
    })
  }

  console.log(`Found ${apartments.length} apartment complexes`)
  return apartments
}

async function importToDatabase(apartments: ParsedApartment[]): Promise<void> {
  console.log('\nImporting to database...')

  let created = 0
  let skipped = 0

  for (const apt of apartments) {
    try {
      // Check if already exists (by address)
      const existing = await prisma.apartment.findFirst({
        where: {
          address: apt.address,
          city: apt.city,
          zipCode: apt.zipCode
        }
      })

      if (existing) {
        skipped++
        continue
      }

      await prisma.apartment.create({
        data: {
          name: apt.name,
          address: apt.address,
          city: apt.city,
          state: apt.state,
          zipCode: apt.zipCode,
          propertyType: apt.propertyType,
          unitCount: apt.unitCount,
          yearBuilt: apt.yearBuilt,
          description: `${apt.unitCount} unit apartment complex in Jacksonville, FL.`
        }
      })

      created++

      if (created % 50 === 0) {
        console.log(`  Created ${created} apartments...`)
      }
    } catch (error) {
      console.error(`Error importing ${apt.name}:`, error)
    }
  }

  console.log(`\nImport complete!`)
  console.log(`  Created: ${created}`)
  console.log(`  Skipped (duplicates): ${skipped}`)
}

async function main() {
  const filePath = './tax_roll/tax_roll_2025.txt'

  if (!fs.existsSync(filePath)) {
    console.error('Tax roll file not found:', filePath)
    console.error('Please download from Jacksonville Property Appraiser:')
    console.error('https://www.jacksonville.gov/departments/property-appraiser/information-offerings')
    process.exit(1)
  }

  try {
    const apartments = await parseFile(filePath)

    // Show preview
    console.log('\nPreview (first 10):')
    apartments.slice(0, 10).forEach(apt => {
      console.log(`  - ${apt.name}`)
      console.log(`    ${apt.address}, ${apt.city}, ${apt.state} ${apt.zipCode}`)
      console.log(`    Units: ${apt.unitCount}, Year: ${apt.yearBuilt || 'N/A'}`)
    })

    // Import
    await importToDatabase(apartments)

  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
