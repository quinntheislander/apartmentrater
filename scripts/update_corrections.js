#!/usr/bin/env node
/**
 * Update CSV with new corrections.
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'apartments_for_research.csv');

// New corrections to add
const corrections = [
  // Batch 1
  { address: '4910 SAMARITAN WAY', zip: '32210', name: 'Novo Westlake', url: 'https://www.apartments.com/novo-westlake-jacksonville-fl/8g0blg0/', confidence: 'High' },
  { address: '10350 103RD ST', zip: '32210', name: 'Pointe Grand Jacksonville West', url: 'https://www.apartments.com/pointe-grand-jacksonville-west-jacksonville-fl/jx9rt66/', confidence: 'High' },
  { address: '7311 BAYMEADOWS WAY', zip: '32256', name: 'RISE Baymeadows', url: 'https://www.apartments.com/rise-baymeadows-jacksonville-fl/0rlnwe1/', confidence: 'High' },
  { address: '345 BURBANK AVE', zip: '32081', name: 'Velara Luxury Apartments', url: 'https://www.apartments.com/velara-luxury-apartments-ponte-vedra-beach-fl/25q8q69/', confidence: 'High' },
  { address: '6916 S OLD KINGS RD', zip: '32217', name: 'Cobblestone Corners', url: 'https://www.apartments.com/cobblestone-corners-jacksonville-fl/zvtfe0y/', confidence: 'High' },
  { address: '3909 SUNBEAM RD', zip: '32257', name: 'Mandarin Lanai', url: 'https://www.apartments.com/mandarin-lanai-jacksonville-fl/3rn050g/', confidence: 'High' },
  // Batch 2
  { address: '4083 SUNBEAM RD', zip: '32257', name: 'The Park at Anzio', url: 'https://www.apartments.com/the-park-at-anzio-jacksonville-fl/89r67n0/', confidence: 'High' },
  { address: '6226 S BARNES RD', zip: '32216', name: 'Landings at Parkview', url: 'https://www.apartments.com/landings-at-parkview-jacksonville-fl/4nhlx5j/', confidence: 'High' },
  { address: '1600 LANSDOWNE DR', zip: '32211', name: 'Alderman Park Apartments', url: 'https://www.apartments.com/alderman-park-apartments-jacksonville-fl/68f23vr/', confidence: 'High' },
  { address: '2600 TROLLIE LN', zip: '32211', name: 'Trollie Lane Apartments', url: 'https://www.apartments.com/trollie-lane-apartments-jacksonville-fl/sk4qvr5/', confidence: 'High' },
  { address: '6455 SAN JUAN AVE', zip: '32210', name: 'Samson Apartments', url: 'https://www.apartments.com/samson-equities-jacksonville-fl/1qtzl74/', confidence: 'High' },
  { address: '2650 DEAN RD', zip: '32216', name: 'Oxford Hall Apartments', url: 'https://www.apartments.com/oxford-hall-apartments-jacksonville-fl/pejsnct/', confidence: 'High' },
  { address: '8599 A C SKINNER PKWY', zip: '32256', name: 'Steele Creek', url: 'https://www.apartments.com/steele-creek-jacksonville-fl/j99he35/', confidence: 'High' },
  { address: '7385 PARK VILLAGE DR', zip: '32256', name: 'SUR Southside Quarter', url: 'https://www.apartments.com/sur-southside-quarter-jacksonville-fl/wfn2bxk/', confidence: 'High' },
  { address: '11391 SQUARE ST', zip: '32256', name: 'Volta', url: 'https://www.apartments.com/volta-jacksonville-fl/fr9fqfs/', confidence: 'High' },
  // Batch 3
  { address: '4929 SKYWAY DR', zip: '32246', name: 'Ciel Luxury Apartments', url: 'https://www.apartments.com/ciel-luxury-apartments-jacksonville-fl/n0br3wp/', confidence: 'High' },
  { address: '871 NEW BERLIN RD', zip: '32218', name: 'Pointe Grand New Berlin', url: 'https://www.apartments.com/pointe-grand-new-berlin-jacksonville-fl/y9mh4ks/', confidence: 'High' },
  { address: '13505 CITICARDS WAY', zip: '32258', name: 'Cue Luxury Living', url: 'https://www.apartments.com/cue-luxury-living-jacksonville-fl/6p5ycdv/', confidence: 'High' },
  { address: '14051 BEACH BLVD', zip: '32250', name: 'Presidium Regal', url: 'https://www.apartments.com/presidium-regal-jacksonville-fl/z5q53cw/', confidence: 'High' },
  { address: '11849 PALM BAY PKWY', zip: '32256', name: 'Aventon Highgrove', url: 'https://www.apartments.com/aventon-highgrove-jacksonville-fl/c2e9qpf/', confidence: 'High' },
  // Batch 4
  { address: '8074 W GATE PKWY', zip: '32216', name: 'SOLA South Lux Apartments', url: 'https://www.apartments.com/sola-south-lux-apartments-jacksonville-fl/rzb9g93/', confidence: 'High' },
  { address: '4890 FLORIDA CLUB CIR', zip: '32216', name: 'Florida Club at Deerwood', url: 'https://www.floridaclubdeerwood.com/', confidence: 'High' },
  { address: '840 BERT RD', zip: '32211', name: 'Catalina Apartments', url: 'https://www.apartments.com/catalina-jacksonville-fl/fyrx47s/', confidence: 'High' },
  { address: '645 E 21ST ST', zip: '32206', name: 'Sanctuary Walk Apartments', url: 'https://www.apartments.com/sanctuary-walk-apartments-jacksonville-fl/j7j5ph6/', confidence: 'High' },
  { address: '3545 CYPRESS ST', zip: '32205', name: 'Cypress Apartments', url: 'https://www.apartments.com/cypress-apartments-jacksonville-fl/z1rgmez/', confidence: 'High' },
  // Batch 5
  { address: '13924 EGRETS NEST DR', zip: '32256', name: 'Tropia Luxury Apartments', url: 'https://www.apartments.com/tropia-luxury-apartments-jacksonville-fl/8creng1/', confidence: 'High' },
  { address: '901 KENNARD ST', zip: '32208', name: 'Village at Lake Forest', url: 'https://floridayimby.com/2024/08/120-unit-village-at-lake-forest-planned-for-901-kennard-st-jacksonville-fl.html', confidence: 'Medium' },
  { address: '225 DUVAL STATION RD', zip: '32218', name: 'Duval Station Landing', url: 'https://www.apartments.com/duval-station-landing-jacksonville-fl/vxe9nte/', confidence: 'High' },
  { address: '13300 ATLANTIC BLVD', zip: '32225', name: 'The Enclave', url: 'https://www.apartments.com/the-enclave-jacksonville-fl/8z2bdq3/', confidence: 'High' },
  // Batch 6
  { address: '2078 HYDE PARK RD', zip: '32210', name: 'Hyde Park Apartments', url: 'https://www.apartments.com/hyde-park-jacksonville-fl/x6yl23n/', confidence: 'High' },
  { address: '1800 BLANDING BLVD', zip: '32210', name: 'Riviera South Apartments', url: 'https://www.apartments.com/riviera-south-apartments-jacksonville-fl/hyxlgn0/', confidence: 'High' },
  { address: '230 E 1ST ST', zip: '32206', name: 'Centennial Towers', url: 'https://www.apartments.com/centennial-towers-jacksonville-fl/tmvb788/', confidence: 'High' },
  { address: '9825 N GATE PKWY', zip: '32246', name: 'MAA Town Center', url: 'https://www.apartments.com/maa-town-center-jacksonville-fl/j18hrg7/', confidence: 'High' },
  { address: '1600 MILL CREEK RD', zip: '32211', name: 'Mill Creek Manor', url: 'https://www.apartments.com/mill-creek-manor-jacksonville-fl/48hhhzl/', confidence: 'High' },
  // Batch 7
  { address: '12633 MILLEDGE AVE', zip: '32218', name: 'Novo Northlake', url: 'https://www.jaxdailyrecord.com/news/2024/feb/29/development-today-respiratory-care-sleep-medicine-relocating-to-1443-san-marco-blvd/', confidence: 'Medium' },
  { address: '6705 ST AUGUSTINE RD', zip: '32217', name: 'Courtyards at San Jose', url: 'https://www.apartments.com/the-courtyards-at-san-jose-jacksonville-fl/74c9tqw/', confidence: 'High' },
  { address: '8050 W BAYMEADOWS CIR', zip: '32256', name: 'Lofts at Baymeadows', url: 'https://www.apartments.com/lofts-at-baymeadows-resort-style-living-jacksonville-fl/0l2k8h0/', confidence: 'High' },
  { address: '6610 POWERS AVE', zip: '32217', name: 'Jackson Palms', url: 'https://www.apartments.com/jackson-palms-jacksonville-fl/4h12sjj/', confidence: 'High' },
  { address: '11401 OLD ST AUGUSTINE RD', zip: '32258', name: 'River Garden Hebrew Home', url: 'https://rivergarden.org/', confidence: 'High' },
  { address: '2722 W UNIVERSITY BLVD', zip: '32217', name: 'San Jose Place Apartments', url: 'https://www.apartments.com/san-jose-place-apartments-jacksonville-fl/wbzrg1j/', confidence: 'High' },
  // Batch 8
  { address: '3900 OLD SUNBEAM RD', zip: '32257', name: 'JaxBay Apartments', url: 'https://www.xfinity.com/communities/fl/jacksonville/3900-old-sunbeam-road', confidence: 'Medium' },
  { address: '6727 WOLFPACK WAY', zip: '32217', name: 'Wolfpack Way Condos', url: 'https://www.redfin.com/FL/Jacksonville/6727-Wolfpack-Way-32217/home/108823854', confidence: 'Low' },
  // Batch 9
  { address: '2111 MCCOY CREEK BLVD', zip: '32207', name: 'Miller Creek Apartments', url: 'https://www.modweller.com/', confidence: 'High' },
  { address: '9855 REGENCY SQUARE BLVD', zip: '32225', name: 'Regency Place Apartments', url: 'https://www.apartments.com/regency-place-apartments-jacksonville-fl/xhqpvwq/', confidence: 'High' },
  // Batch 10
  { address: '4101 SAN PABLO PKWY', zip: '32224', name: 'Olea Beach Haven', url: 'https://www.apartments.com/olea-beach-haven-jacksonville-fl/rbcbs73/', confidence: 'High' },
  { address: '8050 103RD ST', zip: '32210', name: 'Jacksonville Heights Apartments', url: 'https://www.apartments.com/jacksonville-heights-apartments-homes-jacksonville-fl/bnv26yc/', confidence: 'High' },
  { address: '7071 103RD ST', zip: '32210', name: 'Vivo Living Jacksonville', url: 'https://www.apartments.com/vivo-living-jacksonville-jacksonville-fl/c9epsvf/', confidence: 'High' },
  { address: '1706 ART MUSEUM DR', zip: '32207', name: 'Marco Meadows', url: 'https://www.apartments.com/marco-meadows-jacksonville-fl/059pn42/', confidence: 'High' },
  { address: '2600 ART MUSEUM DR', zip: '32207', name: 'The Landings at San Marco', url: 'https://www.apartments.com/the-landings-at-san-marco-jacksonville-fl/we2dnrk/', confidence: 'High' },
  { address: '2203 ART MUSEUM DR', zip: '32207', name: 'Liberty Studio Apartments', url: 'https://www.apartments.com/liberty-studio-apartments-jacksonville-fl/8dnlxd1/', confidence: 'High' },
];

// Build lookup
const correctionMap = new Map();
corrections.forEach(c => {
  correctionMap.set(`${c.address}|${c.zip}`, c);
});

// Parse CSV
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

function escapeCSV(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Load and update CSV
const content = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = content.split('\n');
const output = [lines[0]]; // Keep header

let updated = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const fields = parseCSVLine(line);
  const address = fields[1];
  const zip = fields[3];
  const key = `${address}|${zip}`;

  const correction = correctionMap.get(key);
  if (correction && !fields[7]) { // Only update if not already corrected
    fields[7] = correction.name;
    fields[8] = correction.url;
    fields[9] = correction.confidence;
    updated++;
    console.log(`Updated: ${address} -> ${correction.name}`);
  }

  output.push(fields.map(escapeCSV).join(','));
}

fs.writeFileSync(CSV_PATH, output.join('\n'), 'utf-8');
console.log(`\nUpdated ${updated} records`);
