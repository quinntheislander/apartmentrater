import Link from 'next/link'
import { Accessibility, Mail, MessageSquare } from 'lucide-react'

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Accessibility className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900">Accessibility Statement</h1>
        <p className="text-xl text-gray-600 mt-4">
          Our commitment to making Apartment Rater accessible to everyone.
        </p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
          <p>
            Apartment Rater is committed to ensuring digital accessibility for people with
            disabilities. We are continually improving the user experience for everyone and
            applying the relevant accessibility standards to guarantee we provide equal access
            to all users.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conformance Status</h2>
          <p>
            We aim to conform to the{' '}
            <a
              href="https://www.w3.org/WAI/standards-guidelines/wcag/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1
            </a>{' '}
            at Level AA. These guidelines explain how to make web content more accessible to
            people with disabilities.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <p className="text-sm">
              <strong>Current Status:</strong> Apartment Rater strives to conform to WCAG 2.1 Level AA.
              We regularly test with automated tools and manual reviews to maintain accessibility standards.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
          <p>
            Apartment Rater includes the following accessibility features:
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Navigation</h3>
          <ul className="list-disc pl-6 mt-2">
            <li>Consistent navigation structure across all pages</li>
            <li>Skip-to-content links for keyboard users</li>
            <li>Logical heading hierarchy for screen readers</li>
            <li>Clear focus indicators for interactive elements</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Visual Design</h3>
          <ul className="list-disc pl-6 mt-2">
            <li>Sufficient color contrast ratios (minimum 4.5:1 for normal text)</li>
            <li>Text can be resized up to 200% without loss of functionality</li>
            <li>No content relies solely on color to convey information</li>
            <li>Responsive design that works across different screen sizes</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Forms and Inputs</h3>
          <ul className="list-disc pl-6 mt-2">
            <li>All form fields have associated labels</li>
            <li>Error messages are clearly identified and described</li>
            <li>Required fields are clearly marked</li>
            <li>Form validation provides helpful feedback</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Images and Media</h3>
          <ul className="list-disc pl-6 mt-2">
            <li>Meaningful images include alternative text descriptions</li>
            <li>Decorative images are properly hidden from assistive technologies</li>
            <li>Interactive elements have accessible names</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Keyboard Navigation</h2>
          <p>
            Our website can be navigated using a keyboard. Common keyboard shortcuts include:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Key</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Tab</td>
                  <td className="px-4 py-2 text-sm">Move to the next interactive element</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Shift + Tab</td>
                  <td className="px-4 py-2 text-sm">Move to the previous interactive element</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Enter</td>
                  <td className="px-4 py-2 text-sm">Activate buttons and links</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Space</td>
                  <td className="px-4 py-2 text-sm">Activate buttons and checkboxes</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Escape</td>
                  <td className="px-4 py-2 text-sm">Close modals and dropdowns</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Arrow Keys</td>
                  <td className="px-4 py-2 text-sm">Navigate within menus and select options</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assistive Technologies</h2>
          <p>
            Our website is designed to be compatible with the following assistive technologies:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
            <li>Screen magnification software</li>
            <li>Speech recognition software</li>
            <li>Keyboard-only navigation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Known Limitations</h2>
          <p>
            While we strive for full accessibility, some content may have limitations:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>
              <strong>User-uploaded images:</strong> Images uploaded by users in reviews may
              not always include alternative text descriptions.
            </li>
            <li>
              <strong>Third-party content:</strong> Some embedded content from third-party
              services may not meet our accessibility standards.
            </li>
            <li>
              <strong>PDF documents:</strong> Some downloadable documents may not be fully
              accessible.
            </li>
          </ul>
          <p className="mt-4">
            We are actively working to address these limitations. If you encounter any
            accessibility barriers, please let us know.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Testing</h2>
          <p>
            We regularly test our website for accessibility using:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Automated testing tools (axe, WAVE, Lighthouse)</li>
            <li>Manual testing with keyboard navigation</li>
            <li>Screen reader testing</li>
            <li>Color contrast analyzers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Contact</h2>
          <p>
            We welcome your feedback on the accessibility of Apartment Rater. If you encounter
            any accessibility barriers or have suggestions for improvement, please contact us:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Email</h3>
              </div>
              <a href="mailto:accessibility@apartmentrater.com" className="text-blue-600 hover:underline">
                accessibility@apartmentrater.com
              </a>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Contact Form</h3>
              </div>
              <Link href="/contact" className="text-blue-600 hover:underline">
                Use our contact form
              </Link>
            </div>
          </div>

          <p className="mt-6">
            When contacting us about an accessibility issue, please include:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>The URL of the page where you encountered the issue</li>
            <li>A description of the problem</li>
            <li>The assistive technology you were using (if applicable)</li>
            <li>Your contact information for follow-up</li>
          </ul>
          <p className="mt-4">
            We aim to respond to accessibility feedback within 5 business days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Continuous Improvement</h2>
          <p>
            Accessibility is an ongoing effort. We are committed to:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Regular accessibility audits</li>
            <li>Training our team on accessibility best practices</li>
            <li>Incorporating accessibility into our development process</li>
            <li>Listening to user feedback and making improvements</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal</h2>
          <p>
            This accessibility statement was last updated on{' '}
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
          </p>
          <p className="mt-4">
            We are committed to compliance with applicable accessibility laws including the
            Americans with Disabilities Act (ADA) and Section 508 of the Rehabilitation Act.
          </p>
        </section>
      </div>
    </div>
  )
}
