'use client'

import { useState, useEffect } from 'react'
import { Building2, ChevronDown, AlertCircle } from 'lucide-react'

interface UnitOption {
  value: string
  label: string
  isVerified: boolean
}

interface UnitSelectorProps {
  apartmentId: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  value: string
  isVerified: boolean
  onChange: (value: string, isVerified: boolean) => void
}

export default function UnitSelector({
  apartmentId,
  streetAddress,
  city,
  state,
  zipCode,
  value,
  isVerified,
  onChange
}: UnitSelectorProps) {
  const [units, setUnits] = useState<UnitOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [manualValue, setManualValue] = useState('')

  // Fetch units from Smarty API when apartment is selected
  useEffect(() => {
    async function fetchUnits() {
      if (!streetAddress || !city || !state) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({
          streetAddress,
          city,
          state,
          zipCode: zipCode || ''
        })

        const response = await fetch(`/api/units/lookup?${params}`)

        if (!response.ok) {
          throw new Error('Failed to fetch units')
        }

        const data = await response.json()
        setUnits(data.units || [])

        // If no units found, show manual entry by default
        if (!data.units || data.units.length === 0) {
          setShowManualEntry(true)
        }
      } catch (err) {
        console.error('Error fetching units:', err)
        setError('Unable to load unit list')
        setShowManualEntry(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()
  }, [apartmentId, streetAddress, city, state, zipCode])

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value

    if (selectedValue === '__manual__') {
      setShowManualEntry(true)
      onChange('', false)
      return
    }

    const selectedUnit = units.find(u => u.value === selectedValue)
    if (selectedUnit) {
      onChange(selectedValue, selectedUnit.isVerified)
      setShowManualEntry(false)
    }
  }

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setManualValue(newValue)
    onChange(newValue, false) // Manual entries are never verified
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Unit / Apartment Number
      </label>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          <span className="text-sm">Loading units...</span>
        </div>
      ) : (
        <>
          {units.length > 0 && !showManualEntry && (
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={value}
                onChange={handleSelectChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
              >
                <option value="">Select your unit...</option>
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label} {unit.isVerified && '✓'}
                  </option>
                ))}
                <option value="__manual__">Unit not listed...</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          )}

          {(showManualEntry || units.length === 0) && (
            <div className="space-y-2">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={manualValue || value}
                  onChange={handleManualChange}
                  placeholder="Enter unit number (e.g., 4B, Apt 101)"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {units.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowManualEntry(false)
                    setManualValue('')
                    onChange('', false)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Back to unit list
                </button>
              )}

              <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Manual entries are marked as user-provided and not verified against official records.
                </span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {value && (
            <div className="flex items-center gap-2 text-sm">
              {isVerified ? (
                <span className="text-green-600 bg-green-50 px-2 py-1 rounded">
                  ✓ Verified unit
                </span>
              ) : (
                <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  User-provided unit
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
