#!/usr/bin/env python3
"""
Import corrected apartment names from the research CSV.
Updates the JSON file and can regenerate the database.
"""

import csv
import json
from pathlib import Path

# Paths
INPUT_CSV = Path(__file__).parent.parent / "tax_roll" / "apartments_for_research.csv"
APARTMENTS_JSON = Path(__file__).parent.parent / "tax_roll" / "apartments_with_google_names.json"
OUTPUT_JSON = Path(__file__).parent.parent / "tax_roll" / "apartments_final.json"

def main():
    # Load current apartments
    with open(APARTMENTS_JSON) as f:
        apartments = json.load(f)

    print(f"Loaded {len(apartments)} apartments")

    # Create lookup by address
    apt_by_address = {}
    for apt in apartments:
        key = f"{apt.get('address', '')}|{apt.get('zipCode', '')}"
        apt_by_address[key] = apt

    # Read corrections from CSV
    corrections = 0
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            corrected_name = row.get('Corrected Name', '').strip()

            if corrected_name and corrected_name.lower() not in ['', 'unknown', 'n/a', 'not found']:
                address = row.get('Address', '')
                zip_code = row.get('ZIP', '')
                key = f"{address}|{zip_code}"

                if key in apt_by_address:
                    old_name = apt_by_address[key].get('name', '')
                    apt_by_address[key]['name'] = corrected_name
                    apt_by_address[key]['name_source'] = 'research'
                    corrections += 1

                    if corrections <= 20:  # Show first 20
                        print(f"  Updated: {old_name[:30]:30} -> {corrected_name[:30]}")

    if corrections > 20:
        print(f"  ... and {corrections - 20} more")

    print(f"\nTotal corrections: {corrections}")

    # Save updated JSON
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(apartments, f, indent=2)

    print(f"Saved to: {OUTPUT_JSON}")
    print(f"\nTo update the database, run:")
    print(f"  npx tsx src/scripts/import-apartments.ts --file apartments_final.json")

if __name__ == '__main__':
    main()
