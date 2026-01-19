'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Message Sent!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => {
              setSuccess(false)
              setFormData({ name: '', email: '', subject: '', message: '' })
            }}
            className="mt-6 text-blue-600 hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-xl text-gray-600 mt-4">
          Have a question, suggestion, or need help? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="review">Report a Review</option>
                  <option value="apartment">Report an Apartment Listing</option>
                  <option value="account">Account Issues</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="business">Business Inquiry</option>
                  <option value="privacy">Privacy & Data Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Email Us</h3>
            </div>
            <p className="text-gray-600 text-sm">
              For general inquiries:
            </p>
            <a href="mailto:hello@apartmentrater.com" className="text-blue-600 hover:underline">
              hello@apartmentrater.com
            </a>
            <p className="text-gray-600 text-sm mt-3">
              For privacy-related requests:
            </p>
            <a href="mailto:privacy@apartmentrater.com" className="text-blue-600 hover:underline">
              privacy@apartmentrater.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Address</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Jacksonville, FL<br />
              United States
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Response Time</h3>
            </div>
            <p className="text-gray-600 text-sm">
              We typically respond within 24-48 hours during business days.
              For urgent matters, please indicate so in your subject line.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold mb-3">Before You Write</h3>
            <p className="text-gray-600 text-sm">
              Check our{' '}
              <Link href="/faq" className="text-blue-600 hover:underline">
                FAQ page
              </Link>
              {' '}for answers to common questions about accounts, reviews, and more.
            </p>
            <p className="text-gray-600 text-sm mt-3">
              For data privacy requests, visit our{' '}
              <Link href="/data-request" className="text-blue-600 hover:underline">
                Data Request
              </Link>
              {' '}page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
