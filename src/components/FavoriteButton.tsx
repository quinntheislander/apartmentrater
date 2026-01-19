'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  apartmentId: string
  initialFavorited?: boolean
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function FavoriteButton({
  apartmentId,
  initialFavorited,
  size = 'md',
  showText = false
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited ?? false)
  const [isLoading, setIsLoading] = useState(initialFavorited === undefined)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (initialFavorited === undefined) {
      fetch(`/api/user/favorites/${apartmentId}`)
        .then(res => res.json())
        .then(data => {
          setIsFavorited(data.isFavorited)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [apartmentId, initialFavorited])

  const toggleFavorite = async () => {
    setIsUpdating(true)
    try {
      if (isFavorited) {
        const res = await fetch(`/api/user/favorites/${apartmentId}`, {
          method: 'DELETE'
        })
        if (res.ok) {
          setIsFavorited(false)
        } else if (res.status === 401) {
          alert('You must be logged in to save favorites')
        }
      } else {
        const res = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apartmentId })
        })
        if (res.ok) {
          setIsFavorited(true)
        } else if (res.status === 401) {
          alert('You must be logged in to save favorites')
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const buttonClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  }

  if (isLoading) {
    return (
      <button
        disabled
        className={`${buttonClasses[size]} rounded-full bg-gray-100 text-gray-300`}
        aria-label="Loading favorites"
      >
        <Heart className={sizeClasses[size]} aria-hidden="true" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isUpdating}
      className={`${buttonClasses[size]} rounded-full transition-colors ${
        isFavorited
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
      } disabled:opacity-50`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorited}
    >
      <Heart className={`${sizeClasses[size]} ${isFavorited ? 'fill-current' : ''}`} aria-hidden="true" />
      {showText && (
        <span className="ml-2 text-sm">
          {isFavorited ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}
