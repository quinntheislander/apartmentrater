#!/usr/bin/env python3
"""
Update apartment names using Google Places API.
Looks up each address and gets the actual property name from Google Maps.
"""

import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path

# Load API key from .env file
def load_env():
    env_path = Path(__file__).parent.parent / ".env"
    env_vars = {}
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip().strip('"')
    return env_vars

env = load_env()
API_KEY = env.get('GOOGLE_MAPS_API_KEY', '')

if not API_KEY:
    print("ERROR: GOOGLE_MAPS_API_KEY not found in .env file")
    exit(1)

# Paths
APARTMENTS_JSON = Path(__file__).parent.parent / "tax_roll" / "apartments.json"
OUTPUT_JSON = Path(__file__).parent.parent / "tax_roll" / "apartments_with_google_names.json"
CACHE_FILE = Path(__file__).parent.parent / "tax_roll" / "google_cache.json"

def load_cache():
    """Load cached Google API responses."""
    if CACHE_FILE.exists():
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}

def save_cache(cache):
    """Save cache to disk."""
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=2)

def find_place(address: str, city: str, state: str, zip_code: str, cache: dict) -> dict | None:
    """Query Google Places API to find a place by address."""

    # Build full address for cache key
    full_address = f"{address}, {city}, {state} {zip_code}"

    # Check cache first
    cache_key = f"textsearch:{full_address}"
    if cache_key in cache:
        return cache[cache_key]

    # Also check old cache format
    if full_address in cache:
        return cache[full_address]

    # Query Google Places Text Search API - better for finding named places
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        'query': f"apartments near {address}, {city}, {state} {zip_code}",
        'type': 'establishment',
        'key': API_KEY
    }

    url = f"{base_url}?{urllib.parse.urlencode(params)}"

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())

            if data.get('status') == 'OK' and data.get('results'):
                # Find the best match - prefer apartment complexes at our address
                target_addr_parts = address.upper().split()

                for result in data['results']:
                    result_addr = result.get('formatted_address', '').upper()
                    result_name = result.get('name', '')

                    # Check if this result matches our address
                    if target_addr_parts and target_addr_parts[0] in result_addr:
                        # This result is at or near our address
                        cache[cache_key] = result
                        return result

                # If no exact match, return first result
                cache[cache_key] = data['results'][0]
                return data['results'][0]
            else:
                cache[cache_key] = None
                return None

    except Exception as e:
        print(f"  Error querying Google API: {e}")
        return None

def is_apartment_name(name: str, types: list) -> bool:
    """Check if the Google result looks like an apartment complex."""

    # Check types
    apartment_types = [
        'apartment_complex', 'real_estate_agency', 'lodging',
        'premise', 'establishment', 'point_of_interest'
    ]

    if any(t in types for t in ['apartment_complex', 'lodging']):
        return True

    # Check name for apartment keywords
    name_lower = name.lower()
    apt_keywords = [
        'apartment', 'apts', 'residences', 'living', 'place', 'village',
        'commons', 'gardens', 'grove', 'park', 'landing', 'point',
        'crossing', 'square', 'terrace', 'manor', 'club', 'loft',
        'tower', 'heights', 'ridge', 'woods', 'pointe', 'cove',
        'bay', 'lake', 'creek', 'oaks', 'pines', 'villas', 'estates',
        'flats', 'suites', 'court', 'plaza', 'centre', 'center'
    ]

    if any(kw in name_lower for kw in apt_keywords):
        return True

    # Check if it has relevant types and isn't clearly something else
    skip_types = ['restaurant', 'store', 'church', 'school', 'hospital',
                  'gas_station', 'bank', 'atm', 'pharmacy', 'supermarket']

    if any(t in types for t in skip_types):
        return False

    # If it's an establishment/point of interest and has a proper name, consider it
    if any(t in types for t in apartment_types):
        # Skip if name looks like a street address
        if name[0].isdigit():
            return False
        return True

    return False

def clean_google_name(name: str) -> str:
    """Clean up the name from Google."""
    # Remove common suffixes
    suffixes = [' - Apartments', ' Apartments for Rent', ' | Apartments']
    for suffix in suffixes:
        if name.endswith(suffix):
            name = name[:-len(suffix)]
    return name.strip()

def is_valid_name(name: str, types: list) -> bool:
    """Check if a name is a valid property name (not an address or unit number)."""
    if not name:
        return False

    # Skip types that are just addresses
    address_types = ['street_address', 'premise', 'subpremise', 'route']
    if all(t in address_types for t in types):
        # This is just an address, not a named place
        return False

    # Skip if it starts with a number (likely an address)
    if name[0].isdigit():
        return False

    # Skip if it's just "Unit X" or similar
    if name.lower().startswith(('unit ', 'apt ', 'suite ')):
        return False

    # Skip generic names
    generic_names = ['gm02', 'gm01', 'building', 'complex']
    if name.lower() in generic_names:
        return False

    # Must have at least 3 characters
    if len(name) < 3:
        return False

    return True

def main():
    print("Loading apartments...")
    with open(APARTMENTS_JSON) as f:
        apartments = json.load(f)

    print(f"Loaded {len(apartments)} apartments")

    # Load cache
    cache = load_cache()
    print(f"Loaded {len(cache)} cached results")

    updated = 0
    not_found = 0
    kept_original = 0

    try:
        for i, apt in enumerate(apartments):
            address = apt.get('address', '')
            city = apt.get('city', 'Jacksonville')
            state = apt.get('state', 'FL')
            zip_code = apt.get('zipCode', '')
            original_name = apt.get('name', '')

            # Query Google
            result = find_place(address, city, state, zip_code, cache)

            if result:
                google_name = result.get('name', '')
                types = result.get('types', [])

                # Check if it's a valid apartment name
                if google_name and is_apartment_name(google_name, types):
                    cleaned_name = clean_google_name(google_name)
                    if cleaned_name != original_name and is_valid_name(cleaned_name, types):
                        apt['name'] = cleaned_name
                        apt['google_place_id'] = result.get('place_id')
                        apt['name_source'] = 'google'
                        updated += 1
                        print(f"  [{i+1}/{len(apartments)}] Updated: {original_name[:40]} -> {cleaned_name[:40]}")
                    else:
                        kept_original += 1
                else:
                    apt['name_source'] = 'tax_roll'
                    kept_original += 1
            else:
                apt['name_source'] = 'tax_roll'
                not_found += 1

            # Rate limiting - Google allows ~50 requests per second
            # Being conservative with 10 per second
            if (i + 1) % 10 == 0:
                time.sleep(1)
                # Save cache periodically
                if (i + 1) % 100 == 0:
                    save_cache(cache)
                    print(f"  Progress: {i+1}/{len(apartments)} ({updated} updated)")

    except KeyboardInterrupt:
        print("\n\nInterrupted! Saving progress...")

    finally:
        # Save cache and output
        save_cache(cache)

        with open(OUTPUT_JSON, 'w') as f:
            json.dump(apartments, f, indent=2)

        print(f"\n\nResults:")
        print(f"  Updated with Google names: {updated}")
        print(f"  Kept original name: {kept_original}")
        print(f"  Not found on Google: {not_found}")
        print(f"\nSaved to: {OUTPUT_JSON}")
        print(f"Cache saved to: {CACHE_FILE}")

if __name__ == '__main__':
    main()
