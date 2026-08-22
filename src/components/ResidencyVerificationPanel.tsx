'use client'

import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Upload, Loader2, AlertCircle, Lock } from 'lucide-react'
import {
  ACCEPTED_DOCUMENT_MIME_TYPES,
  MAX_DOCUMENT_BYTES,
  RECENT_TENANCY_WINDOW_YEARS,
  type VerificationBadge,
} from '@/lib/residency'

interface ResidencyVerificationPanelProps {
  apartmentId: string
  unitNumber: string
}

interface VerificationResult {
  id: string
  coveredFrom: string | null
  coveredTo: string | null
  badge: VerificationBadge
}

type Phase = 'idle' | 'checking' | 'verified' | 'submitting' | 'rejected' | 'error' | 'unavailable'

/** Photos from phones are routinely 8–12 MB; shrink before upload so we stay under the body limit and read faster. */
const MAX_IMAGE_EDGE = 2000

async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size <= MAX_DOCUMENT_BYTES / 2) {
      bitmap.close()
      return file
    }
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

function badgeLabel(badge: VerificationBadge): string {
  if (!badge) return 'Verified'
  if (badge.kind === 'resident') return 'Verified Resident'
  return badge.label ? `Verified Tenant · ${badge.label}` : 'Verified Tenant'
}

export default function ResidencyVerificationPanel({ apartmentId, unitNumber }: ResidencyVerificationPanelProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [message, setMessage] = useState('')
  const [legalName, setLegalName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Look up existing status whenever the unit changes (debounced for manual typing)
  useEffect(() => {
    if (!unitNumber.trim()) {
      setPhase('idle')
      setResult(null)
      return
    }

    let cancelled = false
    setPhase('checking')
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ apartmentId, unitNumber })
        const response = await fetch(`/api/verify/residency?${params}`)
        if (!response.ok) throw new Error('status check failed')
        const data = await response.json()
        if (cancelled) return
        if (data.verification) {
          setResult(data.verification)
          setPhase('verified')
        } else {
          setResult(null)
          setPhase(data.available ? 'idle' : 'unavailable')
        }
      } catch {
        if (!cancelled) setPhase('idle')
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [apartmentId, unitNumber])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    setFile(picked)
    setMessage('')
    if (phase === 'rejected' || phase === 'error') setPhase('idle')
  }

  const handleSubmit = async () => {
    if (!file || legalName.trim().split(/\s+/).length < 2) {
      setMessage('Enter your first and last name as printed on the document, and choose a file.')
      setPhase('error')
      return
    }

    setPhase('submitting')
    setMessage('')

    try {
      const prepared = await downscaleImage(file)
      if (prepared.size > MAX_DOCUMENT_BYTES) {
        throw new Error(`File must be under ${Math.round(MAX_DOCUMENT_BYTES / 1024 / 1024)} MB. Try a single page or a smaller photo.`)
      }

      const body = new FormData()
      body.append('file', prepared)
      body.append('apartmentId', apartmentId)
      body.append('unitNumber', unitNumber)
      body.append('legalName', legalName.trim())

      const response = await fetch('/api/verify/residency/document', { method: 'POST', body })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      if (data.status === 'verified') {
        setResult(data.verification)
        setPhase('verified')
        setLegalName('')
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setMessage(data.message || 'We could not confirm this document.')
        setPhase('rejected')
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Verification failed')
      setPhase('error')
    }
  }

  if (!unitNumber.trim()) {
    return (
      <p className="text-xs text-gray-500">
        Select your unit above to optionally verify your tenancy and earn a verified badge.
      </p>
    )
  }

  if (phase === 'checking') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Checking verification status…
      </div>
    )
  }

  if (phase === 'verified' && result) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4" role="status">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-green-900">
            <p className="font-medium">Tenancy verified for Unit {unitNumber}</p>
            <p className="mt-1">
              Your review will show the <span className="font-medium">{badgeLabel(result.badge)}</span> badge.
              The document you provided was not kept.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'unavailable') {
    return (
      <p className="text-xs text-gray-500">
        Tenancy verification is temporarily unavailable. You can still submit your review.
      </p>
    )
  }

  const submitting = phase === 'submitting'

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm">
          <p className="font-medium text-gray-900">Verify your tenancy (optional)</p>
          <p className="text-gray-600 mt-1">
            Earn a verified badge by uploading one document that shows your name, this address with
            your unit, and a date from your tenancy — current or within the last {RECENT_TENANCY_WINDOW_YEARS} years.
          </p>
          <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-0.5">
            <li>Renter&apos;s insurance declarations page (fastest)</li>
            <li>Utility bill, such as JEA</li>
            <li>Lease — first page plus signature page</li>
            <li>Move-out statement or rent ledger</li>
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-600 bg-white border border-gray-200 rounded p-3">
        <Lock className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          We read the document once to confirm the name, unit, and dates, then discard it.
          The file is never stored, and the name you enter here is not saved or shown on your review.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="residency-legal-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name as printed on the document
          </label>
          <input
            id="residency-legal-name"
            type="text"
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            autoComplete="name"
            disabled={submitting}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholder="First Last"
          />
        </div>
        <div>
          <label htmlFor="residency-document" className="block text-sm font-medium text-gray-700 mb-1">
            Document (photo or PDF)
          </label>
          <input
            id="residency-document"
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_DOCUMENT_MIME_TYPES.join(',')}
            onChange={handleFileChange}
            disabled={submitting}
            className="w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {(phase === 'rejected' || phase === 'error') && message && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3" role="alert">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p>{message}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !file || !legalName.trim()}
        className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Checking document…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" aria-hidden="true" />
            Verify tenancy
          </>
        )}
      </button>
    </div>
  )
}
