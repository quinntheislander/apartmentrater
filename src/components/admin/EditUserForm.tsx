'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100'

interface EditUserFormProps {
  user: { id: string; email: string; name: string | null; emailVerified: boolean }
  isSelf: boolean
}

export default function EditUserForm({ user, isSelf }: EditUserFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    email: user.email,
    name: user.name ?? '',
    emailVerified: user.emailVerified,
  })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) {
      setMessage({ ok: false, text: data.error || 'Failed to save' })
      return
    }
    setMessage({ ok: true, text: 'Saved' })
    router.refresh()
  }

  const sendReset = async () => {
    setBusy(true)
    setMessage(null)
    const res = await fetch(`/api/admin/users/${user.id}/password-reset`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    setMessage(
      res.ok
        ? { ok: true, text: data.sent === 'invite' ? 'Invite email re-sent' : 'Password reset email sent' }
        : { ok: false, text: data.error || 'Failed to send email' }
    )
  }

  return (
    <form onSubmit={save} className="space-y-4 max-w-md">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}
      <label className="block text-sm font-medium text-gray-700">
        Email
        <input
          type="email"
          required
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          disabled={isSelf}
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Name
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className={`mt-1 ${inputClass}`}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={form.emailVerified}
          onChange={e => setForm(f => ({ ...f, emailVerified: e.target.checked }))}
          disabled={isSelf}
          className="h-4 w-4 text-blue-600 rounded"
        />
        Email verified <span className="text-gray-400">(unverified users can&apos;t sign in)</span>
      </label>
      {isSelf && (
        <p className="text-sm text-gray-500">Your own email and verification can&apos;t be changed here.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={busy}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={sendReset}
          disabled={busy}
          className="border px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {user.emailVerified ? 'Send password reset email' : 'Re-send invite email'}
        </button>
      </div>
    </form>
  )
}
