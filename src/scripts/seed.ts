import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12)

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: hashedPassword
    }
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: {
      email: 'mike@example.com',
      name: 'Mike Johnson',
      password: hashedPassword
    }
  })

  console.log('Created users')

  // Create Jacksonville apartments (pilot market only)
  const apartments = [
    // San Marco
    {
      name: 'San Marco Place',
      address: '1234 San Marco Blvd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32207',
      description: 'Modern apartment complex in the heart of San Marco. Walking distance to restaurants and shops.',
      propertyType: 'apartment',
      unitCount: 120,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Pool', 'Gym', 'Parking', 'Pet Friendly'])
    },
    {
      name: 'The Hendricks at San Marco',
      address: '1450 Hendricks Ave',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32207',
      description: 'Luxury living in historic San Marco. Rooftop terrace with downtown views. Steps from San Marco Square.',
      propertyType: 'apartment',
      unitCount: 85,
      yearBuilt: 2020,
      amenities: JSON.stringify(['Pool', 'Gym', 'Rooftop Terrace', 'Concierge', 'Parking Garage', 'Pet Friendly'])
    },
    // Riverside
    {
      name: 'Riverside Lofts',
      address: '567 Park Street',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32204',
      description: 'Historic building converted to modern lofts in the trendy Riverside neighborhood.',
      propertyType: 'apartment',
      unitCount: 45,
      yearBuilt: 1925,
      amenities: JSON.stringify(['Laundry', 'Pet Friendly', 'Courtyard'])
    },
    {
      name: 'The Brooklyn Riverside',
      address: '220 Riverside Ave',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32202',
      description: 'Urban living at its finest in Brooklyn/Riverside. Walk to shops, restaurants, and the Riverwalk.',
      propertyType: 'apartment',
      unitCount: 300,
      yearBuilt: 2019,
      amenities: JSON.stringify(['Pool', 'Gym', 'Dog Park', 'Co-Working Space', 'Parking Garage', 'Pet Friendly'])
    },
    {
      name: 'Five Points Flats',
      address: '1028 Park Street',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32204',
      description: 'Boutique apartments in the heart of Five Points. Walkable to local shops and nightlife.',
      propertyType: 'apartment',
      unitCount: 32,
      yearBuilt: 2016,
      amenities: JSON.stringify(['Laundry', 'Bike Storage', 'Pet Friendly'])
    },
    // Southside
    {
      name: 'Southside Gardens',
      address: '8900 Baymeadows Rd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32256',
      description: 'Family-friendly community with great schools nearby. Resort-style pool and playground.',
      propertyType: 'apartment',
      unitCount: 200,
      yearBuilt: 2015,
      amenities: JSON.stringify(['Pool', 'Gym', 'Parking', 'Playground', 'Pet Friendly'])
    },
    {
      name: 'Town Center Crossing',
      address: '4850 Big Island Dr',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32246',
      description: 'Premium apartments near St. Johns Town Center. Shopping and dining at your doorstep.',
      propertyType: 'apartment',
      unitCount: 250,
      yearBuilt: 2017,
      amenities: JSON.stringify(['Pool', 'Gym', 'Business Center', 'Garage Parking', 'Pet Friendly', 'Package Lockers'])
    },
    {
      name: 'Deerwood Lake Commons',
      address: '7740 Southside Blvd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32256',
      description: 'Peaceful lakeside community in Deerwood. Nature trails and scenic views.',
      propertyType: 'apartment',
      unitCount: 180,
      yearBuilt: 2012,
      amenities: JSON.stringify(['Pool', 'Gym', 'Lake Access', 'Tennis Courts', 'Pet Friendly'])
    },
    // Downtown
    {
      name: 'The Doro',
      address: '100 E Adams St',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32202',
      description: 'Luxury high-rise living in the heart of Downtown Jacksonville. Stunning river views.',
      propertyType: 'apartment',
      unitCount: 325,
      yearBuilt: 2021,
      amenities: JSON.stringify(['Pool', 'Gym', 'Rooftop Lounge', 'Concierge', 'Valet Parking', 'Pet Spa'])
    },
    {
      name: 'Laura Street Tower',
      address: '325 W Laura St',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32202',
      description: 'Historic building renovation in Downtown. Character meets modern amenities.',
      propertyType: 'apartment',
      unitCount: 90,
      yearBuilt: 1928,
      amenities: JSON.stringify(['Gym', 'Rooftop Deck', 'Parking', 'Pet Friendly'])
    },
    // Avondale
    {
      name: 'Avondale Park Apartments',
      address: '3651 St Johns Ave',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32205',
      description: 'Charming community in historic Avondale. Tree-lined streets and local boutiques nearby.',
      propertyType: 'apartment',
      unitCount: 60,
      yearBuilt: 1955,
      amenities: JSON.stringify(['Pool', 'Laundry', 'Courtyard', 'Pet Friendly'])
    },
    {
      name: 'The Shoppes at Avondale Living',
      address: '3620 St Johns Ave',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32205',
      description: 'Mixed-use development with apartments above retail. Walk to everything Avondale offers.',
      propertyType: 'apartment',
      unitCount: 48,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Rooftop Terrace', 'Parking', 'Pet Friendly'])
    },
    // Mandarin
    {
      name: 'Mandarin Reserve',
      address: '11251 Old St Augustine Rd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32257',
      description: 'Spacious apartments in quiet Mandarin. Great schools and easy access to I-295.',
      propertyType: 'apartment',
      unitCount: 220,
      yearBuilt: 2008,
      amenities: JSON.stringify(['Pool', 'Gym', 'Tennis Courts', 'Playground', 'Pet Friendly', 'Garages Available'])
    },
    {
      name: 'Riverwood at Mandarin',
      address: '10550 Mandarin Rd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32257',
      description: 'Secluded community near the St. Johns River. Nature lovers paradise with kayak launch.',
      propertyType: 'apartment',
      unitCount: 150,
      yearBuilt: 2005,
      amenities: JSON.stringify(['Pool', 'Kayak Launch', 'Nature Trail', 'Fishing Dock', 'Pet Friendly'])
    },
    // Beaches
    {
      name: 'Atlantic Beach Surf Club',
      address: '725 Atlantic Blvd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32233',
      description: 'Steps from the ocean in Atlantic Beach. Surf culture meets comfortable living.',
      propertyType: 'apartment',
      unitCount: 40,
      yearBuilt: 2019,
      amenities: JSON.stringify(['Pool', 'Surfboard Storage', 'Outdoor Showers', 'Pet Friendly'])
    },
    {
      name: 'Neptune Landing',
      address: '500 1st Street',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32266',
      description: 'Beach living in Neptune Beach. Walk to the pier and local restaurants.',
      propertyType: 'apartment',
      unitCount: 28,
      yearBuilt: 2015,
      amenities: JSON.stringify(['Pool', 'Grilling Area', 'Bike Storage', 'Pet Friendly'])
    },
    {
      name: 'Jax Beach Towers',
      address: '1201 1st St S',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32250',
      description: 'High-rise living with ocean views. Close to Jacksonville Beach shops and nightlife.',
      propertyType: 'condo',
      unitCount: 150,
      yearBuilt: 2010,
      amenities: JSON.stringify(['Pool', 'Gym', 'Ocean View', 'Parking Garage', 'Pet Friendly'])
    },
    // Arlington
    {
      name: 'Regency Square Living',
      address: '9501 Arlington Expy',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32225',
      description: 'Affordable apartments near Regency Square. Easy access to downtown via Arlington Expressway.',
      propertyType: 'apartment',
      unitCount: 280,
      yearBuilt: 1998,
      amenities: JSON.stringify(['Pool', 'Laundry', 'Playground', 'Pet Friendly'])
    },
    {
      name: 'Fort Caroline Club',
      address: '11700 Fort Caroline Rd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32225',
      description: 'Quiet community in Fort Caroline area. Close to Fort Caroline National Memorial.',
      propertyType: 'apartment',
      unitCount: 120,
      yearBuilt: 2002,
      amenities: JSON.stringify(['Pool', 'Gym', 'Tennis Courts', 'Pet Friendly'])
    },
    // Northside
    {
      name: 'Northside Station',
      address: '2500 Dunn Ave',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32218',
      description: 'Convenient Northside location near shopping and dining. Quick access to I-95.',
      propertyType: 'apartment',
      unitCount: 200,
      yearBuilt: 2000,
      amenities: JSON.stringify(['Pool', 'Laundry', 'Playground', 'Pet Friendly'])
    },
    {
      name: 'River City Marketplace Apartments',
      address: '12795 Fountain Lake Circle',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32218',
      description: 'New construction near River City Marketplace. Modern finishes and great amenities.',
      propertyType: 'apartment',
      unitCount: 175,
      yearBuilt: 2022,
      amenities: JSON.stringify(['Pool', 'Gym', 'Dog Park', 'Package Lockers', 'Pet Friendly'])
    },
    // Westside
    {
      name: 'Argyle Forest Commons',
      address: '8301 Argyle Forest Blvd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32244',
      description: 'Family community in Argyle Forest. Near NAS Jacksonville and Orange Park.',
      propertyType: 'apartment',
      unitCount: 240,
      yearBuilt: 2006,
      amenities: JSON.stringify(['Pool', 'Gym', 'Playground', 'Business Center', 'Pet Friendly'])
    },
    {
      name: 'Oakleaf Plantation Residences',
      address: '575 Oakleaf Plantation Pkwy',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32222',
      description: 'Master-planned community living. Resort-style amenities and top-rated schools.',
      propertyType: 'apartment',
      unitCount: 300,
      yearBuilt: 2014,
      amenities: JSON.stringify(['Pool', 'Gym', 'Clubhouse', 'Tennis Courts', 'Playground', 'Pet Friendly'])
    },
    // Springfield
    {
      name: 'Springfield Historic Flats',
      address: '1530 N Main St',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32206',
      description: 'Renovated historic homes in up-and-coming Springfield. Original character preserved.',
      propertyType: 'apartment',
      unitCount: 24,
      yearBuilt: 1910,
      amenities: JSON.stringify(['Laundry', 'Courtyard', 'Pet Friendly'])
    },
    {
      name: 'Main Street Commons',
      address: '1800 N Main St',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32206',
      description: 'New urban apartments in Springfield. Part of the neighborhood revitalization.',
      propertyType: 'apartment',
      unitCount: 65,
      yearBuilt: 2021,
      amenities: JSON.stringify(['Gym', 'Rooftop Deck', 'Bike Storage', 'Pet Friendly'])
    },
    // Murray Hill
    {
      name: 'Murray Hill Manor',
      address: '4327 Post St',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32205',
      description: 'Cozy apartments in artsy Murray Hill. Walking distance to Edgewood Ave shops.',
      propertyType: 'apartment',
      unitCount: 36,
      yearBuilt: 1960,
      amenities: JSON.stringify(['Laundry', 'Pet Friendly'])
    },
    // Ortega
    {
      name: 'Ortega River Club',
      address: '4234 Lakeside Dr',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32210',
      description: 'Waterfront living on the Ortega River. Private boat slips available.',
      propertyType: 'condo',
      unitCount: 55,
      yearBuilt: 1985,
      amenities: JSON.stringify(['Pool', 'Boat Slips', 'Fishing Pier', 'Tennis Courts', 'Pet Friendly'])
    },
    {
      name: 'Venetia Terrace',
      address: '4600 Ortega Blvd',
      city: 'Jacksonville',
      state: 'FL',
      zipCode: '32210',
      description: 'Classic Ortega charm in a garden-style setting. Quiet, established community.',
      propertyType: 'apartment',
      unitCount: 48,
      yearBuilt: 1972,
      amenities: JSON.stringify(['Pool', 'Laundry', 'Courtyard', 'Pet Friendly'])
    }
  ]

  const createdApartments = []
  for (const apt of apartments) {
    const created = await prisma.apartment.create({
      data: apt
    })
    createdApartments.push(created)
  }

  console.log('Created apartments')

  // Create reviews with Opinion-First schema
  const reviews = [
    // San Marco Place (index 0)
    {
      apartmentId: createdApartments[0].id,
      userId: demoUser.id,
      overallRating: 4.0,
      noiseLevel: 4,
      naturalLight: 5,
      generalVibe: 4,
      title: 'Love the San Marco location',
      experienceSummary: 'Great location in San Marco - I can walk to coffee shops and restaurants. The natural light in my unit is amazing with floor-to-ceiling windows. Pretty quiet for being so close to downtown.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '305',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2023-06-01')
    },
    {
      apartmentId: createdApartments[0].id,
      userId: user2.id,
      overallRating: 4.3,
      noiseLevel: 3,
      naturalLight: 4,
      generalVibe: 5,
      title: 'Best apartment experience in Jax',
      experienceSummary: 'The vibe here is fantastic - neighbors are friendly and management hosts monthly events. Can hear some traffic noise from San Marco Blvd but nothing too bad. Really enjoy living here.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '210',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2022-01-01')
    },
    // The Hendricks at San Marco (index 1)
    {
      apartmentId: createdApartments[1].id,
      userId: user3.id,
      overallRating: 4.7,
      noiseLevel: 5,
      naturalLight: 5,
      generalVibe: 5,
      title: 'Luxury worth the price',
      experienceSummary: 'The rooftop views are incredible. Very quiet building with great soundproofing. The concierge is super helpful. Only downside is the price but you get what you pay for.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '801',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2023-03-01')
    },
    // Riverside Lofts (index 2)
    {
      apartmentId: createdApartments[2].id,
      userId: user3.id,
      overallRating: 3.7,
      noiseLevel: 2,
      naturalLight: 5,
      generalVibe: 4,
      title: 'Charming but older building',
      experienceSummary: 'Love the Riverside neighborhood and the character of this converted building. The loft windows let in tons of light. However, the old building means you can hear neighbors pretty easily. Worth it for the location!',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // The Brooklyn Riverside (index 3)
    {
      apartmentId: createdApartments[3].id,
      userId: demoUser.id,
      overallRating: 4.5,
      noiseLevel: 4,
      naturalLight: 4,
      generalVibe: 5,
      title: 'Urban living done right',
      experienceSummary: 'Love being able to walk everywhere - Riverwalk, restaurants, bars. The dog park is a huge plus. Co-working space saved me during WFH days. Great community events.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '1502',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2022-08-01')
    },
    {
      apartmentId: createdApartments[3].id,
      userId: user2.id,
      overallRating: 4.0,
      noiseLevel: 3,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Great location, some noise',
      experienceSummary: 'Perfect spot if you want to be in the action. Can hear some street noise on weekends but nothing too bad. Pool area gets crowded but that is part of the social vibe.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Five Points Flats (index 4)
    {
      apartmentId: createdApartments[4].id,
      userId: user3.id,
      overallRating: 4.2,
      noiseLevel: 3,
      naturalLight: 4,
      generalVibe: 5,
      title: 'Five Points lifestyle',
      experienceSummary: 'If you want to be in the heart of Five Points, this is it. Walking distance to Sun-Ray Cinema and all the bars. Weekends can be loud but that is expected here.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Southside Gardens (index 5)
    {
      apartmentId: createdApartments[5].id,
      userId: demoUser.id,
      overallRating: 4.3,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Perfect for families',
      experienceSummary: 'Really quiet community, great for families. The pool is always clean and the playground is well maintained. Decent natural light in most units. Overall very positive experience.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '1205',
      isUnitVerified: false,
      certifiedPersonalExperience: true
    },
    // Town Center Crossing (index 6)
    {
      apartmentId: createdApartments[6].id,
      userId: user2.id,
      overallRating: 4.4,
      noiseLevel: 4,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Shoppers paradise',
      experienceSummary: 'Living next to Town Center is amazing for shopping and dining. The apartments are well maintained and management is responsive. Gym is top notch.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '312',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2023-01-15')
    },
    // Deerwood Lake Commons (index 7)
    {
      apartmentId: createdApartments[7].id,
      userId: user3.id,
      overallRating: 4.1,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Peaceful lake views',
      experienceSummary: 'Wake up to beautiful lake views every morning. Very quiet and peaceful. Tennis courts are well maintained. A bit dated but comfortable.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // The Doro (index 8)
    {
      apartmentId: createdApartments[8].id,
      userId: demoUser.id,
      overallRating: 4.8,
      noiseLevel: 5,
      naturalLight: 5,
      generalVibe: 5,
      title: 'Best high-rise in Jax',
      experienceSummary: 'The river views are unmatched. Building is brand new with amazing amenities. Rooftop lounge is perfect for entertaining. Valet parking is convenient. Worth every penny.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '2105',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2022-06-01')
    },
    {
      apartmentId: createdApartments[8].id,
      userId: user2.id,
      overallRating: 4.5,
      noiseLevel: 4,
      naturalLight: 5,
      generalVibe: 5,
      title: 'Downtown luxury living',
      experienceSummary: 'Moved from Atlanta and this rivals anything there. Pet spa is a unique touch my dog loves. Concierge handles everything. Elevators can be slow during rush hour.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Laura Street Tower (index 9)
    {
      apartmentId: createdApartments[9].id,
      userId: user3.id,
      overallRating: 3.8,
      noiseLevel: 3,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Historic charm downtown',
      experienceSummary: 'Love the historic character of this building. High ceilings and original details. Can hear street noise and neighbors sometimes. Rooftop deck is great for sunsets.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Avondale Park Apartments (index 10)
    {
      apartmentId: createdApartments[10].id,
      userId: demoUser.id,
      overallRating: 3.9,
      noiseLevel: 4,
      naturalLight: 3,
      generalVibe: 4,
      title: 'Classic Avondale living',
      experienceSummary: 'Older complex but well maintained. Love the Avondale neighborhood - can walk to shops on St Johns Ave. Pool area is nice. Some units are darker than others.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // The Shoppes at Avondale Living (index 11)
    {
      apartmentId: createdApartments[11].id,
      userId: user2.id,
      overallRating: 4.3,
      noiseLevel: 3,
      naturalLight: 4,
      generalVibe: 5,
      title: 'Best location in Avondale',
      experienceSummary: 'Living above the shops is so convenient. Rooftop terrace has great views. Can hear some noise from restaurants below on weekends but it is manageable.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '204',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2023-04-01')
    },
    // Mandarin Reserve (index 12)
    {
      apartmentId: createdApartments[12].id,
      userId: user3.id,
      overallRating: 4.2,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Family friendly Mandarin',
      experienceSummary: 'Great for families with kids. Schools nearby are excellent. Very quiet suburban feel. Tennis courts and playground are well used. Easy access to I-295.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '1822',
      isUnitVerified: false,
      certifiedPersonalExperience: true
    },
    // Riverwood at Mandarin (index 13)
    {
      apartmentId: createdApartments[13].id,
      userId: demoUser.id,
      overallRating: 4.4,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 5,
      title: 'Nature lovers dream',
      experienceSummary: 'The kayak launch is amazing - paddle right into the St Johns River. Fishing dock is peaceful. Saw manatees last winter! Very secluded and quiet.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Atlantic Beach Surf Club (index 14)
    {
      apartmentId: createdApartments[14].id,
      userId: user2.id,
      overallRating: 4.6,
      noiseLevel: 4,
      naturalLight: 5,
      generalVibe: 5,
      title: 'Beach life at its best',
      experienceSummary: 'Steps to the beach - literally grab your board and go. Surfboard storage is clutch. Outdoor showers save your apartment from sand. Chill beach vibe community.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '12',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2022-05-01')
    },
    // Neptune Landing (index 15)
    {
      apartmentId: createdApartments[15].id,
      userId: user3.id,
      overallRating: 4.3,
      noiseLevel: 4,
      naturalLight: 5,
      generalVibe: 5,
      title: 'Quiet beach town living',
      experienceSummary: 'Neptune Beach is more chill than Jax Beach. Walk to the pier for coffee. Bike to Atlantic Beach. Small community feels like neighbors know each other.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Jax Beach Towers (index 16)
    {
      apartmentId: createdApartments[16].id,
      userId: demoUser.id,
      overallRating: 4.1,
      noiseLevel: 3,
      naturalLight: 5,
      generalVibe: 4,
      title: 'Ocean views worth it',
      experienceSummary: 'Waking up to ocean views never gets old. Building is a bit older but well maintained. Close to Jax Beach nightlife which can be loud on weekends.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '1402',
      isUnitVerified: false,
      certifiedPersonalExperience: true
    },
    // Regency Square Living (index 17)
    {
      apartmentId: createdApartments[17].id,
      userId: user2.id,
      overallRating: 3.2,
      noiseLevel: 3,
      naturalLight: 3,
      generalVibe: 3,
      title: 'Budget friendly option',
      experienceSummary: 'Good for the price. Older complex showing its age. Management could be more responsive. Location is convenient to Arlington Expressway. Pool is nice in summer.',
      wouldRecommend: false,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Fort Caroline Club (index 18)
    {
      apartmentId: createdApartments[18].id,
      userId: user3.id,
      overallRating: 3.9,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Quiet Arlington community',
      experienceSummary: 'Very quiet area near Fort Caroline National Memorial. Great for nature walks. Tennis courts are a nice bonus. A bit removed from main shopping areas.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Northside Station (index 19)
    {
      apartmentId: createdApartments[19].id,
      userId: demoUser.id,
      overallRating: 3.5,
      noiseLevel: 3,
      naturalLight: 4,
      generalVibe: 3,
      title: 'Convenient Northside spot',
      experienceSummary: 'Easy access to I-95 and shopping on Dunn Ave. Older complex but decent. Some noise from nearby traffic. Playground is nice for kids.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // River City Marketplace Apartments (index 20)
    {
      apartmentId: createdApartments[20].id,
      userId: user2.id,
      overallRating: 4.5,
      noiseLevel: 4,
      naturalLight: 5,
      generalVibe: 5,
      title: 'New construction gem',
      experienceSummary: 'Brand new and it shows. Modern finishes throughout. Dog park is huge. Package lockers save trips to the office. River City Marketplace has everything you need.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '2201',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2023-02-01')
    },
    // Argyle Forest Commons (index 21)
    {
      apartmentId: createdApartments[21].id,
      userId: user3.id,
      overallRating: 4.0,
      noiseLevel: 4,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Great for military families',
      experienceSummary: 'Close to NAS Jacksonville. Lots of military families here. Community is friendly. Playground always has kids playing. Business center useful for remote work.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Oakleaf Plantation Residences (index 22)
    {
      apartmentId: createdApartments[22].id,
      userId: demoUser.id,
      overallRating: 4.4,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 5,
      title: 'Master planned perfection',
      experienceSummary: 'Oakleaf Plantation is beautiful. Resort style pool is amazing. Schools are top rated. Tennis courts well maintained. Clubhouse hosts great events.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '1543',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2021-08-01')
    },
    // Springfield Historic Flats (index 23)
    {
      apartmentId: createdApartments[23].id,
      userId: user2.id,
      overallRating: 3.8,
      noiseLevel: 2,
      naturalLight: 5,
      generalVibe: 4,
      title: 'Historic character',
      experienceSummary: 'Love the original hardwood floors and high ceilings. Springfield is up and coming with new restaurants opening. Old building so you hear neighbors. Worth it for the charm.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Main Street Commons (index 24)
    {
      apartmentId: createdApartments[24].id,
      userId: user3.id,
      overallRating: 4.3,
      noiseLevel: 4,
      naturalLight: 5,
      generalVibe: 5,
      title: 'Springfield revitalized',
      experienceSummary: 'Great to see Springfield coming back. New building with modern amenities. Rooftop deck has downtown views. Bike storage is useful. Exciting neighborhood.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '305',
      isUnitVerified: false,
      certifiedPersonalExperience: true,
      leaseStartDate: new Date('2022-11-01')
    },
    // Murray Hill Manor (index 25)
    {
      apartmentId: createdApartments[25].id,
      userId: demoUser.id,
      overallRating: 3.7,
      noiseLevel: 3,
      naturalLight: 3,
      generalVibe: 4,
      title: 'Artsy Murray Hill vibes',
      experienceSummary: 'Murray Hill has great character. Walk to Edgewood Ave for coffee and vintage shops. Older building needs some updates. Good community feel.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    },
    // Ortega River Club (index 26)
    {
      apartmentId: createdApartments[26].id,
      userId: user2.id,
      overallRating: 4.2,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 5,
      title: 'Boaters paradise',
      experienceSummary: 'Have my boat at the slip - so convenient. Fishing pier is peaceful mornings. Older building but the waterfront location makes up for it. Tennis courts are nice.',
      wouldRecommend: true,
      anonymous: false,
      unitNumber: '18',
      isUnitVerified: false,
      certifiedPersonalExperience: true
    },
    // Venetia Terrace (index 27)
    {
      apartmentId: createdApartments[27].id,
      userId: user3.id,
      overallRating: 3.9,
      noiseLevel: 5,
      naturalLight: 4,
      generalVibe: 4,
      title: 'Classic Ortega charm',
      experienceSummary: 'Quiet established neighborhood. Pool is nice and never crowded. Courtyard is well maintained. Older complex but has character. Good value for Ortega.',
      wouldRecommend: true,
      anonymous: false,
      certifiedPersonalExperience: true
    }
  ]

  for (const review of reviews) {
    await prisma.review.create({
      data: review
    })
  }

  console.log('Created reviews')
  console.log('Seeding complete!')
  console.log('')
  console.log('Demo login:')
  console.log('  Email: demo@example.com')
  console.log('  Password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
