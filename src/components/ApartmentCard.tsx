import Link from 'next/link'
import { MapPin, Star, MessageSquare } from 'lucide-react'
import StarRating from './StarRating'

interface ApartmentCardProps {
  apartment: {
    id: string
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    propertyType: string
    imageUrl?: string | null
    averageRating?: number | null
    reviewCount: number
  }
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Link href={`/apartments/${apartment.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <div className="h-48 bg-gray-200 relative">
          {apartment.imageUrl ? (
            <img
              src={apartment.imageUrl}
              alt={apartment.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <span className="text-4xl">🏢</span>
            </div>
          )}
          <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium capitalize">
            {apartment.propertyType}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {apartment.name}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">
              {apartment.address}, {apartment.city}, {apartment.state}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {apartment.averageRating ? (
                <>
                  <StarRating rating={apartment.averageRating} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {apartment.averageRating.toFixed(1)}
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400">No ratings yet</span>
              )}
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <span>{apartment.reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
