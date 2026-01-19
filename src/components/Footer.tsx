import Link from 'next/link'
import { Building2, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white" aria-label="Apartment Rater Home">
              <Building2 className="h-6 w-6" aria-hidden="true" />
              <span className="font-bold">Apartment Rater</span>
            </Link>
            <p className="mt-4 text-sm">
              Helping renters make informed decisions through honest, detailed reviews.
            </p>
            <address className="mt-4 flex items-start gap-2 text-sm not-italic">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>
                Jacksonville, FL<br />
                United States
              </span>
            </address>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/apartments" className="hover:text-white transition-colors">
                  Browse Apartments
                </Link>
              </li>
              <li>
                <Link href="/apartments/add" className="hover:text-white transition-colors">
                  Add an Apartment
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-white transition-colors">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company information">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal information">
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-white transition-colors">
                  DMCA Policy
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/data-request" className="hover:text-white transition-colors">
                  Data Request
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@apartmentrater.com"
                  className="hover:text-white transition-colors"
                  aria-label="Email us at hello@apartmentrater.com"
                >
                  hello@apartmentrater.com
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p><small>&copy; {new Date().getFullYear()} Apartment Rater. All rights reserved.</small></p>
          <nav aria-label="Legal links">
            <ul className="flex gap-4">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
