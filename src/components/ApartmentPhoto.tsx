'use client'

import { useCallback, useState } from 'react'

interface ApartmentPhotoProps {
  apartmentId: string
  imageUrl?: string | null
  emojiClassName?: string
}

/**
 * Fills its (relative) parent with the apartment's own photo if it has one,
 * otherwise Google Street View of its address. The emoji placeholder sits
 * underneath and shows through whenever there's no image: no Street View
 * coverage, API disabled, or the daily quota cap reached.
 */
export default function ApartmentPhoto({
  apartmentId,
  imageUrl,
  emojiClassName = 'text-4xl',
}: ApartmentPhotoProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')
  const isStreetView = !imageUrl

  // The server-rendered <img> can settle before hydration attaches onLoad/onError
  const checkAlreadySettled = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setStatus(img.naturalWidth > 0 ? 'loaded' : 'failed')
  }, [])

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200"
        aria-hidden="true"
      >
        <span className={emojiClassName}>🏢</span>
      </div>
      {status !== 'failed' && (
        // Decorative: the apartment name is always right next to it. Empty alt
        // also keeps a failed image invisible if onError hasn't hydrated yet.
        // Plain <img>, not next/image: the optimizer would cache Google's image
        // on our servers, which the Street View terms forbid.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={checkAlreadySettled}
          src={imageUrl || `/api/apartments/${apartmentId}/photo`}
          alt=""
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('failed')}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Top-left: Google's own watermark sits in the bottom corners, and the
          wide detail header crops it off */}
      {isStreetView && status === 'loaded' && (
        <span className="absolute top-1.5 left-2 text-[11px] font-medium text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.8)]">
          Google Maps
        </span>
      )}
    </div>
  )
}
