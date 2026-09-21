'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface ConfirmDeleteButtonProps {
  endpoint: string
  /** What the admin has to type to enable the button, e.g. the email or name. */
  confirmText: string
  label: string
  warning: string
  redirectTo: string
}

/** Deletes are permanent, so require typing the record's name first. */
export default function ConfirmDeleteButton({
  endpoint,
  confirmText,
  label,
  warning,
  redirectTo,
}: ConfirmDeleteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const remove = async () => {
    setBusy(true)
    setError('')
    const res = await fetch(endpoint, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Delete failed')
      setBusy(false)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-red-700">{warning}</p>
      <label className="block text-sm text-gray-700">
        Type <span className="font-mono font-semibold">{confirmText}</span> to confirm:
        <input
          value={typed}
          onChange={e => setTyped(e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          autoFocus
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={remove}
          disabled={busy || typed.trim() !== confirmText}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-red-300"
        >
          {busy ? 'Deleting...' : label}
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setTyped(''); setError('') }}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
