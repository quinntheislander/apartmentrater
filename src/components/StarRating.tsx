'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating)
        const partial = index === Math.floor(rating) && rating % 1 > 0
        const starNumber = index + 1

        return interactive ? (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            className="cursor-pointer hover:scale-110 transition-transform"
            aria-label={`Rate ${starNumber} star${starNumber > 1 ? 's' : ''}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : partial
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
              aria-hidden="true"
            />
          </button>
        ) : (
          <span key={index} aria-hidden="true">
            <Star
              className={`${sizeClasses[size]} ${
                filled
                  ? 'fill-yellow-400 text-yellow-400'
                  : partial
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </span>
        )
      })}
    </div>
  )
}
