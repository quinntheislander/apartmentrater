#!/usr/bin/env node
/**
 * Import apartments from CSV to JSON, then prepare for database import.
 * This combines the corrections from the research CSV with the original data.
 */

const fs = require('fs');
const path = require('path');

// Paths
const CSV_PATH = path.join(__dirname, '..', 'apartments_for_research.csv');
const SOURCE_JSON = path.join(__dirname, '..', 'tax_roll', 'apartments_with_google_names.json');
const OUTPUT_JSON = path.join(__dirname, '..', 'tax_roll', 'apartments_final.json');

// Parse CSV line (handles quoted fields)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function main() {
  console.log('=== Importing Apartments to Database ===\n');

  // Step 1: Load source JSON
  console.log('Loading source apartments...');
  const apartments = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf-8'));
  console.log(`  Loaded ${apartments.length} apartments from JSON\n`);

  // Create lookup by address|zip
  const aptByKey = new Map();
  apartments.forEach(apt => {
    const key = `${apt.address}|${apt.zipCode}`;
    aptByKey.set(key, apt);
  });

  // Step 2: Load corrections from CSV
  console.log('Loading corrections from CSV...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim());
  const header = parseCSVLine(lines[0]);

  // Find column indices
  const addressIdx = header.indexOf('Address');
  const zipIdx = header.indexOf('ZIP');
  const correctedIdx = header.indexOf('Corrected Name');
  const sourceUrlIdx = header.indexOf('Source URL');
  const confidenceIdx = header.indexOf('Confidence');

  let corrections = 0;
  let notFound = 0;

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const address = fields[addressIdx];
    const zip = fields[zipIdx];
    const correctedName = fields[correctedIdx]?.trim();

    if (correctedName && correctedName.toLowerCase() !== 'unknown' && correctedName.toLowerCase() !== 'n/a') {
      const key = `${address}|${zip}`;
      const apt = aptByKey.get(key);

      if (apt) {
        apt.name = correctedName;
        apt.name_source = 'research';
        apt.source_url = fields[sourceUrlIdx] || '';
        apt.confidence = fields[confidenceIdx] || '';
        corrections++;
      } else {
        notFound++;
      }
    }
  }

  console.log(`  Applied ${corrections} corrections`);
  if (notFound > 0) {
    console.log(`  ${notFound} addresses not found in source JSON`);
  }

  // Step 3: Save updated JSON
  console.log(`\nSaving to ${OUTPUT_JSON}...`);
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(apartments, null, 2), 'utf-8');
  console.log('  Done!\n');

  // Step 4: Show summary
  let withNames = 0;
  let withoutNames = 0;
  apartments.forEach(apt => {
    if (apt.name && !apt.name.includes('LLC') && !apt.name.includes('INC') && !apt.name.includes('CORP')) {
      withNames++;
    } else {
      withoutNames++;
    }
  });

  console.log('=== Summary ===');
  console.log(`Total apartments: ${apartments.length}`);
  console.log(`With corrected names: ${corrections}`);
  console.log(`\nOutput file: ${OUTPUT_JSON}`);
  console.log('\nTo import to database, run:');
  console.log('  npx tsx src/scripts/import-apartments.ts --file apartments_final.json');
}

main();
