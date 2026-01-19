'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { JACKSONVILLE_CITY, JACKSONVILLE_STATE, JACKSONVILLE_ZIP_CODES } from '@/lib/geo'

// Jacksonville neighborhoods/areas for the dropdown
const JACKSONVILLE_AREAS = [
  'All Areas',
  'Downtown',
  'Riverside',
  'Avondale',
  'San Marco',
  'Southside',
  'Arlington',
  'Mandarin',
  'Beaches',
  'Northside',
  'Westside',
  'Springfield',
  'Murray Hill',
  'Ortega',
  'Town Center'
]

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [area, setArea] = useState(searchParams.get('area') || '')
  const [zipCode, setZipCode] = useState(searchParams.get('zipCode') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (area && area !== 'All Areas') params.set('area', area)
    if (zipCode) params.set('zipCode', zipCode)
    // Always filter to Jacksonville, FL
    params.set('city', JACKSONVILLE_CITY)
    params.set('state', JACKSONVILLE_STATE)

    router.push(`/apartments?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      {/* Jacksonville-only banner */}
      <div className="mb-3 text-center">
        <span className="inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          <MapPin className="h-4 w-4" />
          Serving Jacksonville, FL (Duval County)
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search apartment name or address..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {JACKSONVILLE_AREAS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-36">
          <select
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">ZIP Code</option>
            {JACKSONVILLE_ZIP_CODES.map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  )
}
