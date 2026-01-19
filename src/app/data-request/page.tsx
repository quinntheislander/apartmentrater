'use client'

import { useState } from 'react'
import { Shield, Download, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function DataRequestPage() {
  const [requestType, setRequestType] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [reason, setReason] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (email !== confirmEmail) {
      setError('Email addresses do not match.')
      return
    }

    if (!acknowledged) {
      setError('Please acknowledge that you understand the request process.')
      return
    }

    setLoading(true)

    // PLACEHOLDER: In production, this would send to an API endpoint
    // that verifies the user's identity and processes the request
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Data request submission:', { requestType, email, reason })
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Request Submitted</h1>
          <p className="text-gray-600 mt-4">
            We have received your {requestType === 'access' ? 'data access' : requestType === 'export' ? 'data export' : 'data deletion'} request.
          </p>
          <p className="text-gray-600 mt-2">
            You will receive a confirmation email at <strong>{email}</strong> with further instructions.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mt-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. We will verify your identity via email</li>
              <li>2. Your request will be processed within 30 days</li>
              <li>3. You will receive a notification when complete</li>
            </ul>
          </div>
          <Link
            href="/"
            className="inline-block mt-6 text-blue-600 hover:underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900">Data Privacy Request</h1>
        <p className="text-xl text-gray-600 mt-4">
          Exercise your data privacy rights under GDPR, CCPA, and other privacy regulations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Eye className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Access Your Data</h3>
          <p className="text-sm text-gray-600">
            Request a copy of all personal data we hold about you.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Download className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Export Your Data</h3>
          <p className="text-sm text-gray-600">
            Download your data in a portable, machine-readable format.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Delete Your Data</h3>
          <p className="text-sm text-gray-600">
            Request permanent deletion of your account and associated data.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Request</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What type of request would you like to make? *
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="requestType"
                  value="access"
                  checked={requestType === 'access'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mt-1"
                  required
                />
                <div>
                  <span className="font-medium text-gray-900">Access My Data</span>
                  <p className="text-sm text-gray-600">
                    Receive a summary of all personal information we have collected about you.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="requestType"
                  value="export"
                  checked={requestType === 'export'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900">Export My Data (Data Portability)</span>
                  <p className="text-sm text-gray-600">
                    Download your data in JSON format, including your profile, reviews, and favorites.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="requestType"
                  value="delete"
                  checked={requestType === 'delete'}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-gray-900">Delete My Data (Right to be Forgotten)</span>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated personal data. This action cannot be undone.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must match the email associated with your account
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Email Address *
              </label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Confirm your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide any additional details about your request..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-600">
                I understand that my request will be verified via email, and that processing may take
                up to 30 days. For deletion requests, I acknowledge that this action is permanent and
                my account, reviews, and all associated data will be permanently removed.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !requestType}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting Request...' : 'Submit Request'}
          </button>
        </form>
      </div>

      <div className="mt-12 prose prose-lg max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Under GDPR (European Union)</h3>
        <p>If you are a resident of the European Economic Area, you have the right to:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Access your personal data</li>
          <li>Rectify inaccurate personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Restrict processing of your personal data</li>
          <li>Data portability</li>
          <li>Object to processing of your personal data</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Under CCPA (California)</h3>
        <p>If you are a California resident, you have the right to:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Know what personal information is collected about you</li>
          <li>Know whether your personal information is sold or disclosed and to whom</li>
          <li>Say no to the sale of personal information</li>
          <li>Access your personal information</li>
          <li>Request deletion of your personal information</li>
          <li>Equal service and price, even if you exercise your privacy rights</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Processing Time</h3>
        <p>
          We will respond to your request within 30 days. In some cases, we may need to verify your
          identity before processing your request. If we need additional time, we will notify you
          of the delay and the reason for it.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Contact Our Privacy Team</h3>
        <p>
          If you have questions about your privacy rights or need assistance, contact us at:
        </p>
        <p className="mt-2">
          <strong>Email:</strong> privacy@apartmentrater.com
        </p>
        <p className="mt-2">
          <strong>Location:</strong> Jacksonville, FL, United States
        </p>
      </div>
    </div>
  )
}
