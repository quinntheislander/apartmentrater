import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface TaxRollApartment {
  parcel_id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  yearBuilt: number | null
  unitCount: number | null
  description: string
  google_place_id?: string
  name_source?: string
}

// Check for --file flag to specify JSON file
const fileArgIndex = process.argv.findIndex(arg => arg === '--file')
const customFile = fileArgIndex !== -1 ? process.argv[fileArgIndex + 1] : null

// Check for --use-google flag (legacy)
const useGoogleNames = process.argv.includes('--use-google')

async function main() {
  console.log('Importing apartments from tax roll...')

  // Read the JSON file - prioritize custom file, then final, then google names
  let jsonFile: string
  if (customFile) {
    jsonFile = customFile
  } else if (fs.existsSync(path.join(__dirname, '../../tax_roll/apartments_final.json'))) {
    jsonFile = 'apartments_final.json'
  } else if (useGoogleNames) {
    jsonFile = 'apartments_with_google_names.json'
  } else {
    jsonFile = 'apartments.json'
  }
  const jsonPath = path.join(__dirname, '../../tax_roll/', jsonFile)

  console.log(`Using: ${jsonFile}`)

  const data = fs.readFileSync(jsonPath, 'utf-8')
  const apartments: TaxRollApartment[] = JSON.parse(data)

  console.log(`Found ${apartments.length} apartments to import`)

  // Clear existing apartments (optional - comment out to keep existing)
  console.log('Clearing existing apartments...')
  await prisma.review.deleteMany({})
  await prisma.favorite.deleteMany({})
  await prisma.apartment.deleteMany({})

  // Import in batches
  const batchSize = 100
  let imported = 0
  let skipped = 0

  for (let i = 0; i < apartments.length; i += batchSize) {
    const batch = apartments.slice(i, i + batchSize)

    const createData = batch
      .filter(apt => apt.address && apt.zipCode) // Must have address and zip
      .map(apt => ({
        name: apt.name,
        address: apt.address,
        city: apt.city || 'Jacksonville',
        state: apt.state || 'FL',
        zipCode: apt.zipCode,
        propertyType: apt.propertyType === 'high-rise' ? 'apartment' : 'apartment',
        yearBuilt: apt.yearBuilt,
        unitCount: apt.unitCount,
        description: apt.description || `Apartment complex in ${apt.city || 'Jacksonville'}, FL`
      }))

    if (createData.length > 0) {
      await prisma.apartment.createMany({
        data: createData
      })
      imported += createData.length
    }

    skipped += batch.length - createData.length

    // Progress update
    if ((i + batchSize) % 200 === 0 || i + batchSize >= apartments.length) {
      console.log(`Progress: ${Math.min(i + batchSize, apartments.length)}/${apartments.length}`)
    }
  }

  console.log(`\nImport complete!`)
  console.log(`  Imported: ${imported} apartments`)
  console.log(`  Skipped: ${skipped} (missing address or zip)`)

  // Get final count
  const count = await prisma.apartment.count()
  console.log(`  Total in database: ${count}`)
}

main()
  .catch((e) => {
    console.error('Import error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
