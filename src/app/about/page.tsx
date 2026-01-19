import { Building2, Users, Shield, Heart } from 'lucide-react'
import Link from 'next/link'
import { staticMetadata } from '@/lib/metadata'

export const metadata = staticMetadata.about

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900">About Apartment Rater</h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          Helping renters make informed decisions through honest, detailed apartment reviews.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600">
          Finding the right apartment is one of the most important decisions you&apos;ll make.
          Unfortunately, most listings only show the highlights while hiding the real issues
          tenants face daily. Apartment Rater was created to change that.
        </p>
        <p className="text-gray-600 mt-4">
          We believe every renter deserves to know the truth about noise levels, management
          responsiveness, maintenance quality, and safety before signing a lease. Our platform
          empowers tenants to share their honest experiences and helps future renters avoid
          costly mistakes.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">What Makes Us Different</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Detailed Ratings</h3>
            </div>
            <p className="text-gray-600">
              We go beyond a simple star rating. Our reviews cover 9 specific categories
              including noise, management, maintenance, safety, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Anonymous Option</h3>
            </div>
            <p className="text-gray-600">
              We understand tenants may fear retaliation. That&apos;s why we offer anonymous
              reviews so you can share your honest experience safely.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Community Driven</h3>
            </div>
            <p className="text-gray-600">
              Every review is written by real tenants. Our community helps others by sharing
              both the good and the bad about their living experiences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">Free Forever</h3>
            </div>
            <p className="text-gray-600">
              Apartment Rater is completely free for renters. We believe everyone deserves
              access to honest housing information regardless of their budget.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Join Our Community</h2>
        <p className="text-gray-600">
          Whether you&apos;re searching for your next home or want to help others by sharing your
          experience, we invite you to join our growing community of renters helping renters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/apartments"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Browse Apartments
          </Link>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  )
}
