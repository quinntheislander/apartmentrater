#!/usr/bin/env python3
"""
Export apartments to CSV for AI-assisted name research.
Sorted by unit count (largest first) for prioritization.
"""

import csv
import json
from pathlib import Path

# Paths
INPUT_JSON = Path(__file__).parent.parent / "tax_roll" / "apartments_with_google_names.json"
OUTPUT_CSV = Path(__file__).parent.parent / "tax_roll" / "apartments_for_research.csv"

def main():
    # Load apartments
    with open(INPUT_JSON) as f:
        apartments = json.load(f)

    print(f"Loaded {len(apartments)} apartments")

    # Sort by unit count (largest first)
    apartments.sort(key=lambda x: x.get('unitCount') or 0, reverse=True)

    # Export to CSV
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)

        # Header
        writer.writerow([
            'Row',
            'Address',
            'City',
            'ZIP',
            'Current Name',
            'Units',
            'Year Built',
            'Corrected Name'  # User fills this in
        ])

        # Data rows
        for i, apt in enumerate(apartments, 1):
            writer.writerow([
                i,
                apt.get('address', ''),
                apt.get('city', 'Jacksonville'),
                apt.get('zipCode', ''),
                apt.get('name', ''),
                apt.get('unitCount', ''),
                apt.get('yearBuilt', ''),
                ''  # Blank for user to fill in
            ])

    print(f"\nExported to: {OUTPUT_CSV}")
    print(f"\nInstructions:")
    print("1. Open the CSV in Excel/Google Sheets")
    print("2. Copy batches of 20-30 rows (Address, City, ZIP columns)")
    print("3. Paste into ChatGPT/Claude with this prompt:")
    print()
    print('   "For each address below, find the actual apartment complex name')
    print('   in Jacksonville, FL. Search the web if needed. Return as a simple')
    print('   list: Address | Apartment Name (or \"Unknown\" if not found)"')
    print()
    print("4. Paste the AI's responses into the 'Corrected Name' column")
    print("5. Save the CSV and run the import script")

if __name__ == '__main__':
    main()
