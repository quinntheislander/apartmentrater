'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

export default function InviteUserForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || 'Failed to invite user')
      setBusy(false)
      return
    }
    router.push(`/admin/users/${data.id}?invited=1`)
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
      <label className="block text-sm font-medium text-gray-700">
        Email
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={`mt-1 ${inputClass}`} />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Name <span className="font-normal text-gray-400">(optional)</span>
        <input value={name} onChange={e => setName(e.target.value)} className={`mt-1 ${inputClass}`} />
      </label>
      <p className="text-sm text-gray-500">
        They&apos;ll get an email with a link (valid 7 days) to choose a password and accept the
        Terms. They can&apos;t sign in until they do.
      </p>
      <button
        type="submit"
        disabled={busy}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
      >
        {busy ? 'Sending invite...' : 'Send invite'}
      </button>
    </form>
  )
}
