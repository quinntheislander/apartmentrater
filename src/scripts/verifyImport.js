const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const count = await p.apartment.count()
  console.log('Total apartments:', count)

  // Check Jacksonville filter specifically
  const jaxCount = await p.apartment.count({
    where: { city: 'Jacksonville', state: 'FL' }
  })
  console.log('Jacksonville apartments:', jaxCount)

  const sample = await p.apartment.findMany({
    where: { city: 'Jacksonville', state: 'FL' },
    take: 5
  })
  console.log('\nSample Jacksonville apartments:')
  sample.forEach(x => console.log('-', x.name, '|', x.city, x.state, x.zipCode))

  await p.$disconnect()
}

main()
