'use client'

import { useEffect, useRef, useState } from 'react'
import type { PhotoResponse } from '@/app/api/apartments/[id]/photo/route'

interface ApartmentPhotoProps {
  apartmentId: string
  imageUrl?: string | null
  emojiClassName?: string
  /** Set when rendered inside a link (cards), where a nested <a> would be invalid. */
  insideLink?: boolean
}

/**
 * Fills its (relative) parent with the apartment's own photo if it has one,
 * otherwise whatever /api/apartments/[id]/photo picks (Google Maps listing
 * photo or Street View). The emoji placeholder sits underneath and shows
 * whenever there's no image.
 */
export default function ApartmentPhoto({
  apartmentId,
  imageUrl,
  emojiClassName = 'text-4xl',
  insideLink = false,
}: ApartmentPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [photo, setPhoto] = useState<PhotoResponse | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // Listing photos are billed per request, so only ask once the card is
  // (nearly) on screen.
  useEffect(() => {
    if (imageUrl) return
    const el = containerRef.current
    if (!el) return
    let cancelled = false
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return
        observer.disconnect()
        // no-store: browsers may still hold a day-cached redirect from when this
        // route returned one. The CDN still caches the cacheable answers.
        fetch(`/api/apartments/${apartmentId}/photo`, { cache: 'no-store' })
          .then(res => (res.ok ? (res.json() as Promise<PhotoResponse>) : null))
          .catch(() => null)
          .then(data => {
            if (!cancelled) setPhoto(data ?? { source: 'none' })
          })
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [apartmentId, imageUrl])

  const src = imageUrl || (photo && photo.source !== 'none' ? photo.src : null)

  return (
    <div ref={containerRef} className="absolute inset-0">
      <div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200"
        aria-hidden="true"
      >
        <span className={emojiClassName}>🏢</span>
      </div>
      {src && !failed && (
        // Decorative: the apartment name is always right next to it.
        // Plain <img>, not next/image: the optimizer would cache Google's image
        // on our servers, which Google's terms forbid.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Google requires crediting the photo's author (listing photos) and
          Google Maps. Top-left: Street View's own watermark sits in the bottom
          corners, and the wide detail header crops it off. */}
      {!imageUrl && loaded && !failed && photo && photo.source !== 'none' && (
        <span className="absolute top-1.5 left-2 max-w-[65%] truncate text-[11px] font-medium text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.8)]">
          {photo.source === 'listing' && (
            <>
              Photo:{' '}
              <AuthorCredit credit={photo.credit} insideLink={insideLink} />
              {' · '}
            </>
          )}
          Google Maps
        </span>
      )}
    </div>
  )
}

function AuthorCredit({
  credit,
  insideLink,
}: {
  credit: { name: string; uri?: string }
  insideLink: boolean
}) {
  if (!credit.uri) return <>{credit.name}</>
  const uri = credit.uri

  if (!insideLink) {
    return (
      <a href={uri} target="_blank" rel="noopener noreferrer" className="underline">
        {credit.name}
      </a>
    )
  }

  // Inside the card's <Link>: open the profile without navigating the card
  const open = (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(uri, '_blank', 'noopener,noreferrer')
  }
  return (
    <span
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={e => e.key === 'Enter' && open(e)}
      className="underline cursor-pointer"
    >
      {credit.name}
    </span>
  )
}
