import Link from 'next/link'
import { staticMetadata } from '@/lib/metadata'

export const metadata = staticMetadata.terms

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Apartment Rater (&quot;the Service&quot;), you agree to be bound by these
            Terms of Service (&quot;Terms&quot;). If you do not agree to these terms, please do not use our Service.
          </p>
          <p className="mt-4">
            These Terms constitute a legally binding agreement between you and Apartment Rater. Please
            read them carefully before using our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
          <p>
            Apartment Rater is a platform that allows users to read and write reviews about
            residential rental properties. The Service is provided &quot;as is&quot; and we reserve the
            right to modify or discontinue it at any time without prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
          <p>To use certain features, you must create an account. You agree to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Not create multiple accounts for deceptive purposes</li>
          </ul>
          <p className="mt-4">
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Content Guidelines</h2>
          <p>When posting reviews or other content, you agree to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Be truthful:</strong> Only post reviews based on your genuine experiences</li>
            <li><strong>Be relevant:</strong> Reviews should relate to the property being reviewed</li>
            <li><strong>Be respectful:</strong> Do not use hate speech, threats, or harassment</li>
            <li><strong>Be original:</strong> Do not post content that infringes on others&apos; rights</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Prohibited Content</h3>
          <p>You may not post content that:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Is false, misleading, or defamatory</li>
            <li>Contains personal information of others without consent</li>
            <li>Includes discriminatory statements based on protected characteristics</li>
            <li>Promotes illegal activities</li>
            <li>Contains spam, advertisements, or solicitations</li>
            <li>Includes malware or harmful code</li>
            <li>Violates any applicable law or regulation</li>
          </ul>

          <p className="mt-4">
            For detailed content standards, please review our{' '}
            <Link href="/guidelines" className="text-blue-600 hover:underline">
              Community Guidelines
            </Link>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content Ownership and License</h2>
          <p>
            You retain ownership of content you post. However, by posting content, you grant
            Apartment Rater a non-exclusive, worldwide, royalty-free, sublicensable, and transferable
            license to use, reproduce, display, distribute, and create derivative works from your
            content in connection with operating and promoting our platform.
          </p>
          <p className="mt-4">
            We reserve the right to remove any content that violates these terms or that we
            determine is harmful to our community, without prior notice.
          </p>
          <p className="mt-4">
            You represent and warrant that you have all necessary rights to post your content and
            that it does not infringe on any third party&apos;s intellectual property rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
          <p>
            The Apartment Rater name, logo, and all related names, logos, product and service names,
            designs, and slogans are trademarks of Apartment Rater. You may not use these marks
            without our prior written permission.
          </p>
          <p className="mt-4">
            All content on the Service (excluding user-generated content), including text, graphics,
            logos, icons, images, and software, is the property of Apartment Rater and is protected
            by copyright and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Copyright Infringement (DMCA)</h2>
          <p>
            We respect the intellectual property rights of others. If you believe that your copyrighted
            work has been copied in a way that constitutes copyright infringement, please notify our
            DMCA agent as described in our{' '}
            <Link href="/dmca" className="text-blue-600 hover:underline">
              DMCA Policy
            </Link>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>The accuracy, completeness, or reliability of reviews</li>
            <li>That the Service will be uninterrupted or error-free</li>
            <li>That defects will be corrected</li>
            <li>That the Service is free of viruses or harmful components</li>
            <li>The reliability of any information obtained through the Service</li>
          </ul>
          <p className="mt-4">
            Reviews are opinions of individual users and do not represent our views. You should
            independently verify information before making rental decisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, APARTMENT RATER AND ITS OFFICERS, DIRECTORS,
            EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Loss of profits, data, or business opportunities</li>
            <li>Your use or inability to use the Service</li>
            <li>Any content posted by users</li>
            <li>Unauthorized access to your data</li>
            <li>Decisions made based on information from the Service</li>
          </ul>
          <p className="mt-4">
            IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID US, IF ANY, IN THE
            PAST TWELVE MONTHS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Apartment Rater and its officers,
            directors, employees, agents, and affiliates from any claims, damages, losses, costs,
            or expenses (including reasonable attorney&apos;s fees) arising from:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of a third party</li>
            <li>Any content you post or submit</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h2>
          <p>
            <strong>Informal Resolution:</strong> Before filing any legal claim, you agree to try
            to resolve any dispute informally by contacting us at legal@apartmentrater.com. We will
            try to resolve the dispute within 30 days.
          </p>
          <p className="mt-4">
            <strong>Binding Arbitration:</strong> If informal resolution fails, any disputes arising
            from these Terms or your use of the Service shall be resolved through binding arbitration,
            except where prohibited by law. The arbitration shall be conducted in accordance with
            the rules of the American Arbitration Association.
          </p>
          <p className="mt-4">
            <strong>Class Action Waiver:</strong> You agree to resolve disputes with us on an
            individual basis and waive any right to participate in a class action lawsuit or
            class-wide arbitration.
          </p>
          <p className="mt-4">
            <strong>Exceptions:</strong> You may bring claims in small claims court if eligible.
            Either party may seek injunctive relief in court for intellectual property infringement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Florida,
            United States, without regard to its conflict of law provisions. Any legal action arising from these Terms
            shall be brought exclusively in the state or federal courts located in Duval County, Florida.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid by a court of
            competent jurisdiction, that provision shall be limited or eliminated to the minimum
            extent necessary, and the remaining provisions shall continue in full force and effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, Cookie Policy, and Community Guidelines,
            constitute the entire agreement between you and Apartment Rater regarding your use of
            the Service. These Terms supersede any prior agreements or understandings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Waiver</h2>
          <p>
            Our failure to enforce any right or provision of these Terms shall not constitute a
            waiver of such right or provision. Any waiver must be in writing and signed by us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. We will notify users of material changes by
            posting the new Terms on this page, updating the &quot;Last updated&quot; date, and where
            appropriate, notifying you by email.
          </p>
          <p className="mt-4">
            Continued use of the Service after changes constitutes acceptance of the new Terms.
            If you do not agree to the modified Terms, you should discontinue use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us:
          </p>
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <p><strong>Email:</strong> legal@apartmentrater.com</p>
            <p className="mt-2"><strong>General Inquiries:</strong> hello@apartmentrater.com</p>
            <p className="mt-2"><strong>Location:</strong> Jacksonville, FL, United States</p>
          </div>
        </section>

        <section className="mb-8">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-blue-600 hover:underline">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-blue-600 hover:underline">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-blue-600 hover:underline">
                  DMCA Policy
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
