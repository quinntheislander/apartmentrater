import Link from 'next/link'
import { Building2, Star, Shield, Users, Search, ArrowRight } from 'lucide-react'
import { staticMetadata } from '@/lib/metadata'
import { WebSiteSchema } from '@/components/StructuredData'

export const metadata = staticMetadata.home

export default function Home() {
  return (
    <>
      <WebSiteSchema />
      {/* Hero Section */}
      <section className="relative text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/jax_01.jpeg')" }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-800/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Apartment
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Real reviews from real tenants. Get the truth about noise levels,
              management, maintenance, and more before you sign the lease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apartments"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search Apartments
              </Link>
              <Link
                href="/auth/signup"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 flex items-center justify-center gap-2"
              >
                Write a Review
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Use Apartment Rater?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Ratings</h3>
              <p className="text-gray-600">
                Rate apartments on 9 categories including noise, management,
                maintenance, safety, and more.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Reviews</h3>
              <p className="text-gray-600">
                Look for verified badges from tenants who have proven their
                residency for trustworthy reviews.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Anonymous Option</h3>
              <p className="text-gray-600">
                Share your honest experience without fear. Post anonymously to
                protect yourself from retaliation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Categories Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Comprehensive Rating System
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our reviews cover everything you need to know about an apartment
            before moving in.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '🔇', label: 'Noise Level' },
              { icon: '👔', label: 'Management' },
              { icon: '🔧', label: 'Maintenance' },
              { icon: '🐜', label: 'Pest Control' },
              { icon: '🛡️', label: 'Safety' },
              { icon: '🏊', label: 'Amenities' },
              { icon: '💰', label: 'Value' },
              { icon: '✨', label: 'Cleanliness' },
              { icon: '🚗', label: 'Parking' },
              { icon: '🐕', label: 'Pet Friendly' }
            ].map((cat) => (
              <div
                key={cat.label}
                className="bg-gray-50 p-4 rounded-lg text-center"
              >
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/jax_02.jpeg')" }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gray-900/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Help Others Find Their Perfect Home
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Share your apartment experience and help future renters make informed
            decisions. Your review could save someone from a bad living situation.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700"
          >
            <Building2 className="h-5 w-5" />
            Get Started - It&apos;s Free
          </Link>
        </div>
      </section>
    </>
  )
}
