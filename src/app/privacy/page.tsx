import Link from 'next/link'
import { staticMetadata } from '@/lib/metadata'

export const metadata = staticMetadata.privacy

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p>
            Apartment Rater (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to
            protecting your personal data. This privacy policy explains how we collect, use, and
            safeguard your information when you use our website and services.
          </p>
          <p className="mt-4">
            <strong>Data Controller:</strong> Apartment Rater<br />
            <strong>Location:</strong> Jacksonville, FL, United States<br />
            <strong>Email:</strong> privacy@apartmentrater.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Account Information</h3>
          <p>When you create an account, we collect:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email address</li>
            <li>Name (optional)</li>
            <li>Password (encrypted)</li>
            <li>Profile image URL (optional)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Review Information</h3>
          <p>When you write a review, we collect:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Review content and ratings</li>
            <li>Unit number (optional)</li>
            <li>Lease dates (optional)</li>
            <li>Whether you chose to post anonymously</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Automatically Collected Information</h3>
          <p>We may automatically collect:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
            <li>Device information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Basis for Processing (GDPR)</h2>
          <p>
            If you are in the European Economic Area (EEA), we process your personal data based on the following legal grounds:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <strong>Contract Performance:</strong> Processing necessary to provide our services (e.g., account creation, review posting)
            </li>
            <li>
              <strong>Legitimate Interests:</strong> Processing for our legitimate business interests (e.g., improving services, preventing fraud), where these are not overridden by your rights
            </li>
            <li>
              <strong>Consent:</strong> Where you have given explicit consent (e.g., marketing communications)
            </li>
            <li>
              <strong>Legal Obligation:</strong> Processing necessary to comply with legal requirements
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide and maintain our services</li>
            <li>Process and display your reviews</li>
            <li>Send verification and account-related emails</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve our website and user experience</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information only in these circumstances:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Public Reviews:</strong> Your reviews are publicly visible (unless posted anonymously)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our service (hosting, email delivery, analytics)</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Third-Party Service Providers</h3>
          <p>We use the following categories of service providers:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Hosting:</strong> Vercel Inc. (San Francisco, CA)</li>
            <li><strong>Database:</strong> Supabase Inc.</li>
            <li><strong>Email:</strong> Resend Inc.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
          <p>We retain your personal data for as long as necessary to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide our services while you have an account</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes and enforce agreements</li>
          </ul>
          <p className="mt-4">
            <strong>Retention Periods:</strong>
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Account data:</strong> Retained until account deletion</li>
            <li><strong>Reviews:</strong> Retained until you delete them or your account</li>
            <li><strong>Server logs:</strong> Retained for up to 90 days</li>
            <li><strong>Analytics data:</strong> Retained in anonymized form</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Encryption of passwords using industry-standard hashing (bcrypt)</li>
            <li>Secure HTTPS connections for all data transmission</li>
            <li>Regular security assessments</li>
            <li>Access controls limiting employee access to personal data</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the Internet is 100% secure. We cannot guarantee
            absolute security of your data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country
            of residence. These countries may have different data protection laws.
          </p>
          <p className="mt-4">
            When we transfer data outside the EEA, we ensure appropriate safeguards are in place,
            including:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Transfers to countries with adequate data protection (adequacy decisions)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Your Rights</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">General Rights (All Users)</h3>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">GDPR Rights (EEA Residents)</h3>
          <p>If you are in the European Economic Area, you additionally have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Right to be informed:</strong> Know how your data is processed</li>
            <li><strong>Right of access:</strong> Obtain a copy of your personal data</li>
            <li><strong>Right to rectification:</strong> Correct inaccurate personal data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
            <li><strong>Right to data portability:</strong> Receive your data in a structured format</li>
            <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Rights related to automated decision-making:</strong> We do not use automated decision-making</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please visit our{' '}
            <Link href="/data-request" className="text-blue-600 hover:underline">
              Data Request page
            </Link>{' '}
            or contact us at privacy@apartmentrater.com.
          </p>
          <p className="mt-2">
            You also have the right to lodge a complaint with your local data protection authority.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">CCPA Rights (California Residents)</h3>
          <p>If you are a California resident, under the California Consumer Privacy Act (CCPA), you have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Right to Know:</strong> Request disclosure of personal information we collect, use, and share</li>
            <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
            <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information (we do not sell personal information)</li>
            <li><strong>Right to Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
          </ul>
          <p className="mt-4">
            <strong>Categories of Personal Information Collected:</strong> Identifiers, account information,
            internet activity, and user-generated content (reviews).
          </p>
          <p className="mt-2">
            <strong>Do Not Sell My Personal Information:</strong> We do not sell your personal information
            to third parties.
          </p>
          <p className="mt-2">
            To exercise your CCPA rights, visit our{' '}
            <Link href="/data-request" className="text-blue-600 hover:underline">
              Data Request page
            </Link>{' '}
            or email privacy@apartmentrater.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to provide and improve our services. For detailed
            information about the cookies we use, please see our{' '}
            <Link href="/cookies" className="text-blue-600 hover:underline">
              Cookie Policy
            </Link>.
          </p>
          <p className="mt-4">
            <strong>Essential cookies:</strong> Required for the website to function (authentication, security).
          </p>
          <p className="mt-2">
            <strong>Analytics cookies:</strong> Help us understand how visitors use our site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under 13 years of age (or 16 in some jurisdictions).
            We do not knowingly collect personal information from children. If you believe we have
            collected information from a child, please contact us immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Data Breach Notification</h2>
          <p>
            In the event of a data breach that affects your personal information, we will:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Notify affected users within 72 hours of becoming aware (where required by law)</li>
            <li>Notify relevant supervisory authorities as required</li>
            <li>Provide information about the nature of the breach and steps being taken</li>
            <li>Offer guidance on protective measures you can take</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of material changes
            by posting the new policy on this page, updating the &quot;Last updated&quot; date, and where
            appropriate, notifying you by email.
          </p>
          <p className="mt-4">
            We encourage you to review this policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, your personal data, or wish to exercise
            your rights, please contact us:
          </p>
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <p><strong>Email:</strong> privacy@apartmentrater.com</p>
            <p className="mt-2"><strong>Data Requests:</strong>{' '}
              <Link href="/data-request" className="text-blue-600 hover:underline">
                Submit a data request
              </Link>
            </p>
            <p className="mt-2"><strong>Location:</strong> Jacksonville, FL, United States</p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cookies" className="text-blue-600 hover:underline">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/data-request" className="text-blue-600 hover:underline">
                  Data Request Form
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
