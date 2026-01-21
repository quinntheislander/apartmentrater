'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Building2, Search, User, LogOut, PlusCircle, Heart, Settings, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="bg-white shadow-sm border-b" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2" aria-label="Apartment Rater Home">
              <Building2 className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">Apartment Rater</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link
              href="/apartments"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search
            </Link>

            {session ? (
              <>
                <Link
                  href="/apartments/add"
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <PlusCircle className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Add Apartment</span>
                  <span className="lg:hidden">Add</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Favorites</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  aria-label="Sign out of your account"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
          <Link
            href="/apartments"
            onClick={closeMenu}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium"
            role="menuitem"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            Search Apartments
          </Link>

          {session ? (
            <>
              <Link
                href="/apartments/add"
                onClick={closeMenu}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium"
                role="menuitem"
              >
                <PlusCircle className="h-5 w-5" aria-hidden="true" />
                Add Apartment
              </Link>
              <Link
                href="/favorites"
                onClick={closeMenu}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium"
                role="menuitem"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                Favorites
              </Link>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium"
                role="menuitem"
              >
                <User className="h-5 w-5" aria-hidden="true" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium"
                role="menuitem"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
                Profile
              </Link>
              <button
                onClick={() => {
                  closeMenu()
                  signOut()
                }}
                className="flex w-full items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium"
                role="menuitem"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                onClick={closeMenu}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium"
                role="menuitem"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={closeMenu}
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-3 rounded-md text-base font-medium"
                role="menuitem"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
