'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PROPERTY_TYPES } from '@/lib/apartment-input'

const inputClass = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

export interface ApartmentFormValues {
  name: string
  address: string
  city: string
  zipCode: string
  propertyType: string
  unitCount: string
  yearBuilt: string
  description: string
  amenities: string // comma-separated
  imageUrl: string
}

export const EMPTY_APARTMENT: ApartmentFormValues = {
  name: '',
  address: '',
  city: 'Jacksonville',
  zipCode: '',
  propertyType: 'apartment',
  unitCount: '',
  yearBuilt: '',
  description: '',
  amenities: '',
  imageUrl: '',
}

/** Creates an apartment when `apartmentId` is absent, otherwise edits it. */
export default function ApartmentForm({
  apartmentId,
  initial = EMPTY_APARTMENT,
}: {
  apartmentId?: string
  initial?: ApartmentFormValues
}) {
  const router = useRouter()
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const set = (field: keyof ApartmentFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    const res = await fetch(apartmentId ? `/api/admin/apartments/${apartmentId}` : '/api/admin/apartments', {
      method: apartmentId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) {
      setMessage({ ok: false, text: data.error || 'Failed to save' })
      return
    }
    if (!apartmentId) {
      router.push(`/admin/apartments/${data.id}`)
      return
    }
    setMessage({ ok: true, text: 'Saved' })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-2xl">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <label className="block text-sm font-medium text-gray-700">
        Name
        <input required value={form.name} onChange={set('name')} className={`mt-1 ${inputClass}`} />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
        <label className="block text-sm font-medium text-gray-700 sm:col-span-3">
          Street address
          <input required value={form.address} onChange={set('address')} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
          City
          <input value={form.city} onChange={set('city')} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium text-gray-700 sm:col-span-1">
          ZIP
          <input required inputMode="numeric" maxLength={5} value={form.zipCode} onChange={set('zipCode')} className={`mt-1 ${inputClass}`} />
        </label>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        Florida only; must be a Jacksonville-area (Duval) ZIP. Changing the name or address
        re-matches the Google Maps listing photo.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block text-sm font-medium text-gray-700">
          Type
          <select value={form.propertyType} onChange={set('propertyType')} className={`mt-1 ${inputClass} capitalize`}>
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Units
          <input type="number" min={1} value={form.unitCount} onChange={set('unitCount')} className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Year built
          <input type="number" min={1800} value={form.yearBuilt} onChange={set('yearBuilt')} className={`mt-1 ${inputClass}`} />
        </label>
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Description
        <textarea rows={3} maxLength={2000} value={form.description} onChange={set('description')} className={`mt-1 ${inputClass}`} />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Amenities <span className="font-normal text-gray-400">(comma-separated)</span>
        <input value={form.amenities} onChange={set('amenities')} placeholder="Pool, Gym, Pet friendly" className={`mt-1 ${inputClass}`} />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Photo URL <span className="font-normal text-gray-400">(optional; replaces the Google photo)</span>
        <input type="url" value={form.imageUrl} onChange={set('imageUrl')} className={`mt-1 ${inputClass}`} />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
      >
        {busy ? 'Saving...' : apartmentId ? 'Save changes' : 'Add apartment'}
      </button>
    </form>
  )
}
