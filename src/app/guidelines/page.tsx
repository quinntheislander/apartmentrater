import Link from 'next/link'
import { Users, CheckCircle, XCircle, AlertTriangle, Star, Shield, MessageSquare } from 'lucide-react'

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900">Community Guidelines</h1>
        <p className="text-xl text-gray-600 mt-4">
          Creating a trustworthy community for renters and landlords.
        </p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-2">Our Mission</h2>
        <p className="text-gray-600">
          Apartment Rater exists to help renters make informed decisions about where to live.
          We achieve this by fostering an honest, respectful community where people can share
          their genuine experiences. These guidelines help us maintain a platform that is
          helpful, fair, and trustworthy.
        </p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Star className="h-7 w-7 text-yellow-500" />
            Writing Quality Reviews
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">What Makes a Good Review</h3>
          <div className="bg-green-50 rounded-lg p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Do This</span>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Be specific:</strong> Describe particular experiences, not vague
                impressions. &quot;Maintenance responded within 24 hours when my AC broke&quot; is
                better than &quot;maintenance is okay.&quot;
              </li>
              <li>
                <strong>Be balanced:</strong> Include both positives and negatives when
                applicable. Even great apartments have minor issues.
              </li>
              <li>
                <strong>Be relevant:</strong> Focus on aspects that matter to future renters:
                noise levels, management responsiveness, maintenance quality, amenities, etc.
              </li>
              <li>
                <strong>Be honest:</strong> Only review places where you have actually lived
                or had significant personal experience.
              </li>
              <li>
                <strong>Be timely:</strong> Recent experiences are most helpful. Note if
                you&apos;re reviewing from months or years ago, as things may have changed.
              </li>
              <li>
                <strong>Rate fairly:</strong> Use the full rating scale. A 5-star isn&apos;t
                perfect, and a 1-star isn&apos;t necessarily terrible.
              </li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">Avoid This</span>
            </div>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Vague reviews:</strong> &quot;This place is bad&quot; doesn&apos;t help anyone.
                Explain why.
              </li>
              <li>
                <strong>Emotional rants:</strong> It&apos;s okay to express frustration, but keep
                it constructive and factual.
              </li>
              <li>
                <strong>One-time issues:</strong> A single bad day shouldn&apos;t define your entire
                review. Focus on patterns.
              </li>
              <li>
                <strong>Reviewing without experience:</strong> Don&apos;t review apartments you
                toured but never lived in.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Shield className="h-7 w-7 text-blue-600" />
            Content Standards
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Prohibited Content</h3>
          <p>The following content is not allowed and will be removed:</p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Harassment & Discrimination</h4>
              <ul className="text-sm space-y-1">
                <li>- Personal attacks or threats</li>
                <li>- Hate speech or slurs</li>
                <li>- Discriminatory statements based on race, gender, religion, etc.</li>
                <li>- Doxxing or sharing private information</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">False Information</h4>
              <ul className="text-sm space-y-1">
                <li>- Knowingly false statements</li>
                <li>- Fake reviews (never lived there)</li>
                <li>- Paid or incentivized reviews</li>
                <li>- Competitor sabotage</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Privacy Violations</h4>
              <ul className="text-sm space-y-1">
                <li>- Full names of staff without consent</li>
                <li>- Personal contact information</li>
                <li>- Photos of individuals without consent</li>
                <li>- Unit numbers of other residents</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Inappropriate Content</h4>
              <ul className="text-sm space-y-1">
                <li>- Spam or advertisements</li>
                <li>- Illegal content</li>
                <li>- Obscene or explicit material</li>
                <li>- Off-topic content</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <AlertTriangle className="h-7 w-7 text-yellow-600" />
            Special Situations
          </h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Anonymous Reviews</h3>
          <p>
            You can post reviews anonymously to protect your privacy. However, anonymous
            reviews must still follow all community guidelines. We may require verification
            in cases of disputed content.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Landlord/Property Manager Responses</h3>
          <p>
            Property managers are welcome to respond to reviews professionally. Responses should:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Be respectful and constructive</li>
            <li>Address specific concerns raised</li>
            <li>Avoid personal attacks on reviewers</li>
            <li>Not pressure reviewers to remove or change reviews</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Disputes and Disagreements</h3>
          <p>
            If you believe a review is inaccurate or unfair:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <strong>Reviewers:</strong> You can edit your review if circumstances change
              or you have new information.
            </li>
            <li>
              <strong>Property managers:</strong> Respond professionally to provide your
              perspective. Do not harass reviewers.
            </li>
            <li>
              <strong>Report violations:</strong> Use the report feature for content that
              violates guidelines.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enforcement</h2>

          <p>We take the following actions to maintain community standards:</p>

          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">Warning</span>
              <p className="text-sm">
                First-time minor violations typically receive a warning with guidance on
                how to improve.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium">Content Removal</span>
              <p className="text-sm">
                Reviews that violate guidelines will be removed. You&apos;ll be notified and
                can appeal the decision.
              </p>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">Account Suspension</span>
              <p className="text-sm">
                Repeated or severe violations may result in temporary or permanent account
                suspension.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Appeals Process</h3>
          <p>
            If your content was removed or your account was suspended, you can appeal by
            contacting us at{' '}
            <a href="mailto:appeals@apartmentrater.com" className="text-blue-600 hover:underline">
              appeals@apartmentrater.com
            </a>
            . Include your username and a brief explanation of why you believe the action
            was incorrect.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MessageSquare className="h-7 w-7 text-blue-600" />
            Reporting Content
          </h2>

          <p>
            If you see content that violates these guidelines, please report it. You can:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Use the &quot;Report&quot; button on reviews</li>
            <li>
              Email us at{' '}
              <a href="mailto:report@apartmentrater.com" className="text-blue-600 hover:underline">
                report@apartmentrater.com
              </a>
            </li>
            <li>
              Use our{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                contact form
              </Link>
            </li>
          </ul>
          <p className="mt-4">
            When reporting, please include the specific content you&apos;re concerned about
            and why you believe it violates our guidelines.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
          <p>
            If you have questions about these guidelines or need clarification, please
            contact us at{' '}
            <a href="mailto:hello@apartmentrater.com" className="text-blue-600 hover:underline">
              hello@apartmentrater.com
            </a>
            .
          </p>

          <div className="bg-gray-100 rounded-lg p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Related Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-blue-600 hover:underline">
                  DMCA & Copyright Policy
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
