#!/usr/bin/env python3
"""
Extract apartment properties from Duval County 2025 Tax Roll
Filters for property types 0301 (APTS 1-3 STORY) and 0302 (APTS 4+ STORY)
Outputs clean JSON for database import
"""

import json
import re
from collections import defaultdict
from pathlib import Path

# Tax roll file path
TAX_ROLL_PATH = Path(__file__).parent.parent / "tax_roll" / "tax_roll_2025.txt"
OUTPUT_PATH = Path(__file__).parent.parent / "tax_roll" / "apartments.json"

# Apartment building codes
APARTMENT_CODES = {'0301', '0302'}  # 1-3 story and 4+ story apartments

def parse_tax_roll():
    """Parse the tax roll and extract apartment properties."""

    # First pass: find all parcel IDs with apartment buildings
    print("Finding apartment parcels...")
    apartment_parcels = set()

    with open(TAX_ROLL_PATH, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            if line.startswith('00005|'):
                parts = line.strip().split('|')
                if len(parts) >= 4:
                    parcel_id = parts[1]
                    building_code = parts[3]
                    if building_code in APARTMENT_CODES:
                        apartment_parcels.add(parcel_id)

    print(f"Found {len(apartment_parcels)} apartment parcels")

    # Second pass: collect data for apartment parcels
    print("Extracting property details...")
    properties = defaultdict(lambda: {
        'parcel_id': None,
        'owner_name': None,
        'addresses': [],
        'city': None,
        'zip_code': None,
        'year_built': None,
        'building_type': None,
        'unit_count': 0
    })

    with open(TAX_ROLL_PATH, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            parts = line.strip().split('|')
            if len(parts) < 3:
                continue

            record_type = parts[0]
            parcel_id = parts[1]

            if parcel_id not in apartment_parcels:
                continue

            prop = properties[parcel_id]
            prop['parcel_id'] = parcel_id

            # Record type 00003: Owner name
            if record_type == '00003' and len(parts) >= 3:
                if parts[2] == '1':  # Primary owner name
                    prop['owner_name'] = parts[3] if len(parts) > 3 else None

            # Record type 00004: Situs (property) address
            elif record_type == '00004' and len(parts) >= 8:
                street_num = parts[2].strip()
                street_dir = parts[3].strip()
                street_name = parts[4].strip()
                street_suffix = parts[5].strip()
                unit = parts[6].strip()
                city = parts[7].strip()
                zip_code = parts[8].strip().replace('-', '').strip()[:5]

                # Build address string
                addr_parts = [street_num]
                if street_dir:
                    addr_parts.append(street_dir)
                if street_name:
                    addr_parts.append(street_name)
                if street_suffix:
                    addr_parts.append(street_suffix)

                address = ' '.join(addr_parts)

                if address and address not in prop['addresses']:
                    prop['addresses'].append(address)

                if city and not prop['city']:
                    prop['city'] = city.title()
                if zip_code and len(zip_code) == 5 and not prop['zip_code']:
                    prop['zip_code'] = zip_code

            # Record type 00005: Building info
            elif record_type == '00005' and len(parts) >= 9:
                building_code = parts[3]
                building_desc = parts[4].strip()
                year_built = parts[8]

                if building_code in APARTMENT_CODES:
                    prop['unit_count'] += 1

                    if not prop['building_type']:
                        prop['building_type'] = building_desc

                    try:
                        year = int(year_built)
                        if year > 1800 and year < 2030:
                            if not prop['year_built'] or year < prop['year_built']:
                                prop['year_built'] = year
                    except (ValueError, TypeError):
                        pass

    return properties

def clean_property_name(owner_name, address):
    """Generate a clean property name from owner name or address."""

    # Remove common corporate suffixes and patterns
    suffixes_to_remove = [
        ' LLC', ' LP', ' L P', ' INC', ' CORP', ' LTD', ' TRUST',
        ' PARTNERS', ' PARTNERSHIP', ' PROPERTIES', ' PROPERTY',
        ' HOLDINGS', ' INVESTMENTS', ' ENTERPRISES', ' GROUP',
        ' MANAGEMENT', ' MGMT', ' CO', ' COMPANY', ' ASSOCIATES',
        ' OWNER', ' OWNERS', ' FL', ' FLORIDA', ' JAX', ' JACKSONVILLE',
        ' ET AL', ' ETAL', ' I ', ' II ', ' III ', ' IV ', ' 1 ', ' 2 ',
        ' VENTURE', ' VENTURES', ' GROUND', ' SENIOR', ' JR'
    ]

    if owner_name:
        name = owner_name.strip().upper()

        # Remove suffixes iteratively
        changed = True
        while changed:
            changed = False
            for suffix in suffixes_to_remove:
                if name.endswith(suffix.strip()):
                    name = name[:-len(suffix.strip())].strip()
                    changed = True

        # Remove patterns like "123 MAIN ST" addresses in owner names
        # If name starts with numbers and looks like an address, use the address instead
        if re.match(r'^\d+\s+\w+', name) and len(name.split()) <= 5:
            name = None  # Will fall back to address-based name

        if name:
            # Title case
            name = name.title()

            # Fix common title case issues
            name = name.replace("'S", "'s").replace(" Of ", " of ").replace(" At ", " at ")
            name = name.replace(" The ", " the ").replace(" And ", " and ")
            name = re.sub(r'\bLlc\b', 'LLC', name)
            name = re.sub(r'\bLp\b', 'LP', name)

    else:
        name = None

    # If we don't have a good name, create one from the address
    if not name or len(name) < 3:
        if address:
            # Create a name from the address
            addr_parts = address.title().split()
            if len(addr_parts) >= 2:
                # Use street name part
                street_name = ' '.join(addr_parts[1:3])  # Skip house number
                name = f"{street_name} Apartments"
            else:
                name = f"Apartments at {address.title()}"
        else:
            return "Unknown Apartments"

    # Check if name already has apartment-related keywords
    apt_keywords = ['apt', 'apartment', 'villa', 'residence', 'place', 'court',
                    'commons', 'gardens', 'grove', 'park', 'landing', 'point',
                    'crossing', 'square', 'terrace', 'manor', 'club', 'village',
                    'station', 'loft', 'tower', 'heights', 'ridge', 'woods',
                    'pointe', 'cove', 'bay', 'lake', 'creek', 'oaks', 'pines']

    name_lower = name.lower()
    has_keyword = any(kw in name_lower for kw in apt_keywords)

    # Don't add "Apartments" if it already has a good descriptor
    if not has_keyword and not name_lower.endswith('apartments'):
        name = f"{name} Apartments"

    return name.strip()

def main():
    """Main function to extract and save apartment data."""

    properties = parse_tax_roll()

    # Convert to list and clean up
    apartments = []
    seen_addresses = set()

    for parcel_id, prop in properties.items():
        # Get primary address
        address = prop['addresses'][0] if prop['addresses'] else None

        if not address:
            continue

        # Skip if we've already seen this address (dedupe)
        addr_key = f"{address}|{prop['zip_code']}"
        if addr_key in seen_addresses:
            continue
        seen_addresses.add(addr_key)

        # Clean up the property name
        name = clean_property_name(prop['owner_name'], address)

        # Determine property type
        property_type = 'apartment'
        if prop['building_type']:
            if '4' in prop['building_type'] or 'HIGH' in prop['building_type'].upper():
                property_type = 'high-rise'

        apartment = {
            'parcel_id': parcel_id,
            'name': name,
            'address': address,
            'city': prop['city'] or 'Jacksonville',
            'state': 'FL',
            'zipCode': prop['zip_code'],
            'propertyType': property_type,
            'yearBuilt': prop['year_built'],
            'unitCount': prop['unit_count'] if prop['unit_count'] > 0 else None,
            'description': f"{prop['building_type'] or 'Apartment'} complex in {prop['city'] or 'Jacksonville'}, FL"
        }

        apartments.append(apartment)

    # Sort by name
    apartments.sort(key=lambda x: x['name'])

    print(f"\nExtracted {len(apartments)} unique apartment properties")

    # Save to JSON
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(apartments, f, indent=2)

    print(f"Saved to {OUTPUT_PATH}")

    # Print sample
    print("\nSample properties:")
    for apt in apartments[:10]:
        print(f"  - {apt['name']}: {apt['address']}, {apt['city']} {apt['zipCode']}")

if __name__ == '__main__':
    main()
