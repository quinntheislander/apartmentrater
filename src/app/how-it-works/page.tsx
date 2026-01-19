import Link from 'next/link'
import { Search, UserPlus, Star, Building2, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { staticMetadata } from '@/lib/metadata'

export const metadata = staticMetadata.howItWorks

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900">How Apartment Rater Works</h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          Find your perfect apartment using real reviews from real renters.
          Here&apos;s everything you need to know to get started.
        </p>
      </div>

      {/* For Renters Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">For Apartment Seekers</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Search for Apartments</h3>
              <p className="text-gray-600">
                Browse apartments by city, state, or property name. Filter results by
                rating, number of reviews, or newest listings.
              </p>
            </div>
            <ArrowRight className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-8 w-8" />
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Read Detailed Reviews</h3>
              <p className="text-gray-600">
                Each apartment has reviews covering 9 important categories: noise, management,
                maintenance, pest control, safety, amenities, value, cleanliness, and parking.
              </p>
            </div>
            <ArrowRight className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-8 w-8" />
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Make Informed Decisions</h3>
              <p className="text-gray-600">
                Save apartments to your favorites, compare ratings across properties,
                and find the perfect place to call home.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/apartments"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Searching
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* For Reviewers Section */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-100 p-2 rounded-lg">
            <Star className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">For Reviewers</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create an Account</h3>
            <p className="text-gray-600 text-sm">
              Sign up with your email. Verify your email to add credibility to your reviews.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your Apartment</h3>
            <p className="text-gray-600 text-sm">
              Search for your current or past apartment. If it&apos;s not listed, you can add it.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Write Your Review</h3>
            <p className="text-gray-600 text-sm">
              Rate 9 categories, share pros and cons, and provide helpful details for other renters.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
              4
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Help Others</h3>
            <p className="text-gray-600 text-sm">
              Your honest review helps other renters avoid problems and find great places to live.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Rating Categories */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">What We Rate</h2>
        </div>

        <p className="text-gray-600 mb-8">
          Our comprehensive rating system covers everything that matters when choosing an apartment:
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'Noise Level', description: 'How quiet is the building? Can you hear neighbors, traffic, or other disturbances?' },
            { name: 'Management', description: 'Is the property management responsive, professional, and fair?' },
            { name: 'Maintenance', description: 'How quickly and effectively are repair requests handled?' },
            { name: 'Pest Control', description: 'Are there any issues with insects, rodents, or other pests?' },
            { name: 'Safety', description: 'Do you feel safe in the building and surrounding neighborhood?' },
            { name: 'Amenities', description: 'Are the amenities well-maintained and as advertised?' },
            { name: 'Value for Money', description: 'Is the rent fair for what you\'re getting?' },
            { name: 'Cleanliness', description: 'Are common areas and the building exterior well-maintained?' },
            { name: 'Parking', description: 'Is parking available, convenient, and affordable?' },
          ].map((category) => (
            <div key={category.name} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Trust & Transparency</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How We Maintain Quality</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Email verification helps confirm real users</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Community reporting system for suspicious content</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Clear community guidelines for review quality</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Reviews show when they were posted</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Privacy Matters</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Post reviews anonymously if you prefer</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Your email is never shared publicly</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">You control what information is visible</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">Delete your data anytime through settings</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Common Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900">Is Apartment Rater free to use?</h3>
            <p className="text-gray-600 mt-2">
              Yes! Apartment Rater is completely free for both searching and reviewing apartments.
              We believe everyone deserves access to honest apartment information.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900">Can I review anonymously?</h3>
            <p className="text-gray-600 mt-2">
              Absolutely. When writing a review, you can check the &quot;Post anonymously&quot; option.
              Your username won&apos;t be displayed, but the review must still follow our guidelines.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900">What if my apartment isn&apos;t listed?</h3>
            <p className="text-gray-600 mt-2">
              You can add it! Once logged in, click &quot;Add an Apartment&quot; and fill in the
              property details. Then you can be the first to review it.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/faq" className="text-blue-600 hover:underline font-medium">
            View All FAQs &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of renters who use Apartment Rater to find their perfect home
          and share their experiences with others.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/apartments"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Browse Apartments
          </Link>
          <Link
            href="/auth/signup"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  )
}
