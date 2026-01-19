#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const total = await prisma.apartment.count();

  // Count apartments with good names (not containing LLC, INC, etc)
  const apartments = await prisma.apartment.findMany({ select: { name: true } });
  let goodNames = 0;
  let corporateNames = 0;

  apartments.forEach(apt => {
    if (apt.name.includes('LLC') || apt.name.includes('INC') || apt.name.includes('CORP') || apt.name.includes('TRUST')) {
      corporateNames++;
    } else {
      goodNames++;
    }
  });

  // Sample some apartments
  const samples = await prisma.apartment.findMany({
    take: 10,
    orderBy: { unitCount: 'desc' },
    select: { name: true, address: true, unitCount: true }
  });

  console.log('=== Database Verification ===');
  console.log('Total apartments:', total);
  console.log('With proper names:', goodNames);
  console.log('With corporate/owner names:', corporateNames);
  console.log('');
  console.log('=== Sample Largest Apartments ===');
  samples.forEach(s => {
    console.log('- ' + s.name.substring(0, 35).padEnd(35) + ' | ' + s.unitCount + ' units');
  });

  await prisma.$disconnect();
}

verify().catch(console.error);
