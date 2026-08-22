'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react'

interface ExportProfile {
  email: string
  name: string | null
  image: string | null
  accountCreated: string
}

interface ExportData {
  profile: ExportProfile
  reviews: unknown[]
  favorites: unknown[]
  requestedAt: string
  fulfilledAt: string
}

interface ConfirmResult {
  success: true
  requestType: 'access' | 'export' | 'delete'
  message?: string
  data?: ExportData
}

export default function DataRequestConfirmPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-12 text-gray-500">Loading…</div>}>
      <DataRequestConfirmInner />
    </Suspense>
  )
}

function DataRequestConfirmInner() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'done' | 'error'>(
    token ? 'ready' : 'error'
  )
  const [error, setError] = useState<string>(token ? '' : 'Missing confirmation token.')
  const [result, setResult] = useState<ConfirmResult | null>(null)

  const confirm = async () => {
    if (!token) return
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/data-request/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Failed to confirm request')
        setStatus('error')
        return
      }
      setResult(json as ConfirmResult)
      setStatus('done')
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  const downloadJson = () => {
    if (!result?.data) return
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `apartment-rater-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Confirm Data Request</h1>

        {status === 'error' && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Unable to process</p>
              <p className="text-sm">{error}</p>
              <Link href="/data-request" className="inline-block mt-3 text-blue-600 hover:underline text-sm">
                Submit a new request
              </Link>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <>
            <p className="text-gray-600 mt-4">
              Click the button below to verify your identity and complete your data request. This link will only work once.
            </p>
            <button
              onClick={confirm}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700"
            >
              Confirm and Complete Request
            </button>
          </>
        )}

        {status === 'loading' && (
          <p className="text-gray-600 mt-6">Processing your request&hellip;</p>
        )}

        {status === 'done' && result && (
          <div className="mt-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-2">
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Request complete</p>
                <p className="text-sm mt-1">
                  {result.requestType === 'delete'
                    ? result.message || 'Your account and data have been permanently deleted.'
                    : 'Your data is ready below.'}
                </p>
              </div>
            </div>

            {result.requestType === 'delete' && (
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
                <Trash2 className="h-5 w-5" />
                <span className="text-sm">Goodbye. We&apos;re sorry to see you go.</span>
              </div>
            )}

            {(result.requestType === 'access' || result.requestType === 'export') && result.data && (
              <div className="mt-6 space-y-4">
                <button
                  onClick={downloadJson}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Data (JSON)
                </button>
                <details className="bg-gray-50 rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Preview data
                  </summary>
                  <pre className="mt-3 text-xs bg-white p-3 rounded overflow-auto max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline text-sm">
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
