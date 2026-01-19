#!/usr/bin/env node
/**
 * Sync all apartments from JSON to CSV, preserving existing corrections.
 */

const fs = require('fs');
const path = require('path');

// Paths
const JSON_PATH = path.join(__dirname, '..', 'tax_roll', 'apartments_with_google_names.json');
const CSV_PATH = path.join(__dirname, '..', 'apartments_for_research.csv');
const OUTPUT_PATH = path.join(__dirname, '..', 'apartments_for_research.csv');

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

// Escape CSV field
function escapeCSV(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Load existing CSV corrections
function loadExistingCorrections() {
  const corrections = new Map();

  if (!fs.existsSync(CSV_PATH)) {
    console.log('No existing CSV found');
    return corrections;
  }

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split('\n');

  // Parse header
  const header = parseCSVLine(lines[0]);
  const correctedNameIdx = header.indexOf('Corrected Name');
  const sourceUrlIdx = header.indexOf('Source URL');
  const confidenceIdx = header.indexOf('Confidence');
  const addressIdx = header.indexOf('Address');
  const zipIdx = header.indexOf('ZIP');

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    const address = fields[addressIdx];
    const zip = fields[zipIdx];
    const key = `${address}|${zip}`;

    const correction = {
      correctedName: fields[correctedNameIdx] || '',
      sourceUrl: fields[sourceUrlIdx] || '',
      confidence: fields[confidenceIdx] || ''
    };

    // Only save if there's actual correction data
    if (correction.correctedName || correction.sourceUrl) {
      corrections.set(key, correction);
    }
  }

  console.log(`Loaded ${corrections.size} existing corrections`);
  return corrections;
}

// Main
function main() {
  // Load apartments from JSON
  const apartments = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  console.log(`Loaded ${apartments.length} apartments from JSON`);

  // Load existing corrections
  const corrections = loadExistingCorrections();

  // Sort by unit count (largest first)
  apartments.sort((a, b) => (b.unitCount || 0) - (a.unitCount || 0));

  // Build CSV
  const header = ['Row', 'Address', 'City', 'ZIP', 'Current Name', 'Units', 'Year Built', 'Corrected Name', 'Source URL', 'Confidence'];
  const rows = [header.join(',')];

  let withCorrections = 0;
  let needsResearch = 0;

  for (let i = 0; i < apartments.length; i++) {
    const apt = apartments[i];
    const key = `${apt.address}|${apt.zipCode}`;
    const correction = corrections.get(key) || { correctedName: '', sourceUrl: '', confidence: '' };

    if (correction.correctedName) {
      withCorrections++;
    } else {
      needsResearch++;
    }

    const row = [
      i + 1,
      escapeCSV(apt.address),
      escapeCSV(apt.city || 'Jacksonville'),
      escapeCSV(apt.zipCode),
      escapeCSV(apt.name),
      apt.unitCount || '',
      apt.yearBuilt || '',
      escapeCSV(correction.correctedName),
      escapeCSV(correction.sourceUrl),
      escapeCSV(correction.confidence)
    ];

    rows.push(row.join(','));
  }

  // Write output
  fs.writeFileSync(OUTPUT_PATH, rows.join('\n'), 'utf-8');

  console.log(`\nOutput: ${OUTPUT_PATH}`);
  console.log(`Total apartments: ${apartments.length}`);
  console.log(`With corrections: ${withCorrections}`);
  console.log(`Needs research: ${needsResearch}`);
}

main();
