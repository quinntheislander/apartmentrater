import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none text-gray-600">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you
            visit a website. They are widely used to make websites work more efficiently and provide
            information to website owners. Cookies help us improve your experience on Apartment Rater.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
          <p>Apartment Rater uses cookies for the following purposes:</p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Essential Cookies</h3>
          <p>These cookies are necessary for the website to function properly. They include:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Session cookies:</strong> Keep you signed in while you navigate the site</li>
            <li><strong>Security cookies:</strong> Help protect your account from unauthorized access</li>
            <li><strong>CSRF tokens:</strong> Prevent cross-site request forgery attacks</li>
          </ul>
          <p className="mt-2 text-sm">
            <strong>Duration:</strong> Session cookies expire when you close your browser. Security cookies may persist for up to 30 days.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Functional Cookies</h3>
          <p>These cookies remember your preferences and choices:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Preference cookies:</strong> Remember your settings (e.g., search filters, sort preferences)</li>
            <li><strong>Cookie consent:</strong> Remember your cookie preferences</li>
          </ul>
          <p className="mt-2 text-sm">
            <strong>Duration:</strong> Up to 1 year
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Analytics Cookies</h3>
          <p>These cookies help us understand how visitors interact with our website:</p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Page views:</strong> Which pages are visited most frequently</li>
            <li><strong>Traffic sources:</strong> How visitors find our website</li>
            <li><strong>User behavior:</strong> How users navigate through the site</li>
          </ul>
          <p className="mt-2 text-sm">
            <strong>Duration:</strong> Up to 2 years
          </p>
          <p className="mt-2">
            We may use analytics tools to collect this data.
            This information is anonymized and aggregated.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our pages. We do not
            control these cookies. Third-party services we use include:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Vercel:</strong> For website hosting and performance optimization</li>
            <li><strong>Supabase:</strong> For authentication and database services</li>
          </ul>
          <p className="mt-4">
            For more information about these cookies, please visit the respective privacy policies
            of these third-party providers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookie List</h2>
          <p>Below is a detailed list of cookies we use:</p>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Cookie Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Purpose</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Duration</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm">next-auth.session-token</td>
                  <td className="px-4 py-2 text-sm">User authentication session</td>
                  <td className="px-4 py-2 text-sm">30 days</td>
                  <td className="px-4 py-2 text-sm">Essential</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">next-auth.csrf-token</td>
                  <td className="px-4 py-2 text-sm">Security - prevents CSRF attacks</td>
                  <td className="px-4 py-2 text-sm">Session</td>
                  <td className="px-4 py-2 text-sm">Essential</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">next-auth.callback-url</td>
                  <td className="px-4 py-2 text-sm">Redirect after authentication</td>
                  <td className="px-4 py-2 text-sm">Session</td>
                  <td className="px-4 py-2 text-sm">Essential</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm">cookie-consent</td>
                  <td className="px-4 py-2 text-sm">Stores cookie preferences</td>
                  <td className="px-4 py-2 text-sm">1 year</td>
                  <td className="px-4 py-2 text-sm">Functional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Managing Cookies</h2>
          <p>You have several options for managing cookies:</p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>View what cookies are stored on your device</li>
            <li>Delete all or specific cookies</li>
            <li>Block all cookies or only third-party cookies</li>
            <li>Set your browser to notify you when a cookie is set</li>
          </ul>
          <p className="mt-4">
            Please note that disabling essential cookies may prevent you from using certain features
            of our website, such as signing in to your account.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Browser-Specific Instructions</h3>
          <ul className="list-disc pl-6 mt-2">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Opt-Out of Analytics</h3>
          <p>
            To opt out of analytics tracking, you can install browser extensions like Privacy Badger
            or uBlock Origin, or adjust your browser&apos;s cookie settings as described above.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Do Not Track</h2>
          <p>
            Some browsers have a &quot;Do Not Track&quot; feature that signals to websites that you do not
            want to be tracked. Our website honors Do Not Track signals where technically feasible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices
            or for legal, operational, or regulatory reasons. We will notify you of any material
            changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> privacy@apartmentrater.com
          </p>
          <p className="mt-2">
            You can also visit our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for
            more information about how we handle your data.
          </p>
        </section>
      </div>
    </div>
  )
}
