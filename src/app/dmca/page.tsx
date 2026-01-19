import Link from 'next/link'
import { Shield, AlertTriangle, FileText } from 'lucide-react'

export default function DMCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">DMCA & Copyright Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="bg-blue-50 rounded-xl p-6 mb-8 flex items-start gap-4">
        <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="font-semibold text-gray-900">Our Commitment</h2>
          <p className="text-gray-600 mt-1">
            Apartment Rater respects the intellectual property rights of others and expects users
            to do the same. We will respond to notices of alleged copyright infringement that
            comply with the Digital Millennium Copyright Act (DMCA).
          </p>
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Reporting Copyright Infringement</h2>
          <p>
            If you believe that your copyrighted work has been copied in a way that constitutes
            copyright infringement and is accessible on our website, please notify our designated
            DMCA agent with a written communication that includes the following:
          </p>
          <ol className="list-decimal pl-6 mt-4 space-y-3">
            <li>
              <strong>Identification of the copyrighted work</strong> that you claim has been
              infringed, or, if multiple copyrighted works are covered by a single notification,
              a representative list of such works.
            </li>
            <li>
              <strong>Identification of the material</strong> that you claim is infringing and
              that is to be removed or access to which is to be disabled, and information
              reasonably sufficient to permit us to locate the material. Providing URLs in the
              body of your notice is the best way to help us locate content quickly.
            </li>
            <li>
              <strong>Your contact information</strong>, including your address, telephone
              number, and email address.
            </li>
            <li>
              <strong>A statement</strong> that you have a good faith belief that use of the
              material in the manner complained of is not authorized by the copyright owner,
              its agent, or the law.
            </li>
            <li>
              <strong>A statement</strong> that the information in the notification is accurate,
              and under penalty of perjury, that you are authorized to act on behalf of the
              owner of an exclusive right that is allegedly infringed.
            </li>
            <li>
              <strong>A physical or electronic signature</strong> of a person authorized to act
              on behalf of the owner of the copyright that has allegedly been infringed.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. DMCA Agent Contact Information</h2>
          <div className="bg-gray-50 rounded-lg p-6 mt-4">
            <p className="font-semibold text-gray-900">Designated DMCA Agent</p>
            <p className="mt-2">Apartment Rater Legal Department</p>
            <p className="mt-1">Jacksonville, FL</p>
            <p className="mt-1">United States</p>
            <p className="mt-3">
              <strong>Email:</strong>{' '}
              <a href="mailto:dmca@apartmentrater.com" className="text-blue-600 hover:underline">
                dmca@apartmentrater.com
              </a>
            </p>
            <p className="mt-1">
              <strong>Subject Line:</strong> DMCA Takedown Request
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Counter-Notification</h2>
          <p>
            If you believe that material you posted was removed or access to it was disabled by
            mistake or misidentification, you may file a counter-notification with us by
            providing the following information:
          </p>
          <ol className="list-decimal pl-6 mt-4 space-y-3">
            <li>
              <strong>Identification of the material</strong> that has been removed or to which
              access has been disabled and the location at which the material appeared before
              it was removed or access was disabled.
            </li>
            <li>
              <strong>A statement under penalty of perjury</strong> that you have a good faith
              belief that the material was removed or disabled as a result of mistake or
              misidentification of the material.
            </li>
            <li>
              <strong>Your name, address, and telephone number</strong>, and a statement that
              you consent to the jurisdiction of the Federal District Court for the judicial
              district in which the address is located, or if your address is outside of the
              United States, for any judicial district in which Apartment Rater may be found,
              and that you will accept service of process from the person who provided
              notification of infringement or an agent of such person.
            </li>
            <li>
              <strong>Your physical or electronic signature.</strong>
            </li>
          </ol>
          <p className="mt-4">
            Upon receipt of a valid counter-notification, we will forward it to the party who
            submitted the original DMCA notification. The original party will then have 10
            business days to notify us that they have filed a court action seeking to restrain
            you from engaging in the allegedly infringing activity. If we do not receive such
            notification, we may restore the material.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Repeat Infringers</h2>
          <div className="bg-yellow-50 rounded-lg p-6 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-800">
                In accordance with the DMCA and other applicable law, we have adopted a policy
                of terminating, in appropriate circumstances and at our sole discretion, users
                who are deemed to be repeat infringers. We may also, at our sole discretion,
                limit access to our website and/or terminate the accounts of any users who
                infringe any intellectual property rights of others, whether or not there is
                any repeat infringement.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User-Generated Content</h2>
          <p>
            Apartment Rater is a platform that allows users to post reviews and other content.
            We do not actively monitor all user-generated content for copyright infringement.
            However, we will respond promptly to any DMCA-compliant takedown notices.
          </p>
          <p className="mt-4">
            When posting reviews, users agree to only post content that they have the right to
            share. This includes:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Original written content authored by the user</li>
            <li>Photos taken by the user or for which they have obtained permission</li>
            <li>Content that does not infringe on any third party&apos;s intellectual property rights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Fair Use</h2>
          <p>
            Please consider whether fair use or a similar exception to copyright applies before
            submitting a takedown notice. Misrepresentation of a claim can result in liability
            for damages, including costs and attorney&apos;s fees, under Section 512(f) of the DMCA.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Trademark Complaints</h2>
          <p>
            If you have a trademark complaint that is not related to copyright infringement,
            please contact us at{' '}
            <a href="mailto:legal@apartmentrater.com" className="text-blue-600 hover:underline">
              legal@apartmentrater.com
            </a>{' '}
            with details about the alleged trademark violation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
          <p>
            For general questions about this policy or intellectual property matters:
          </p>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@apartmentrater.com" className="text-blue-600 hover:underline">
                legal@apartmentrater.com
              </a>
            </p>
            <p>
              <strong>DMCA Notices:</strong>{' '}
              <a href="mailto:dmca@apartmentrater.com" className="text-blue-600 hover:underline">
                dmca@apartmentrater.com
              </a>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Related Policies</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-blue-600 hover:underline">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
