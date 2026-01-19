import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { Heart, Search } from 'lucide-react'
import { authOptions } from '@/lib/auth'
import { getUserFavorites } from '@/lib/favorites'
import ApartmentCard from '@/components/ApartmentCard'

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const favorites = await getUserFavorites(session.user.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold">My Favorites</h1>
      </div>

      {favorites.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6">
            {favorites.length} saved apartment{favorites.length === 1 ? '' : 's'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No favorites yet</p>
          <p className="text-gray-400 mt-2">
            Start exploring apartments and save your favorites!
          </p>
          <Link
            href="/apartments"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            <Search className="h-5 w-5" />
            Browse Apartments
          </Link>
        </div>
      )}
    </div>
  )
}
