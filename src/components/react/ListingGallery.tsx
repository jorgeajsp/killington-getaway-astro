'use client'

import { useState, useEffect, useCallback } from 'react'

interface ListingGalleryProps {
  images: string[]
  name: string
}

export default function ListingGallery({ images, name }: ListingGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const prev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length))
  }, [images.length])

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, prev, next])

  if (!images || images.length === 0) return null

  return (
    <div className="not-prose mt-10 mb-4">
      <div className="inline-flex items-center gap-3 mb-5">
        <span className="w-8 h-1 bg-brand-blue rounded-full" />
        <h3 className="text-xl font-heading font-black text-brand-navy tracking-tight uppercase">Featured Images</h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-zoom-in group relative"
            aria-label={`View ${name} photo ${i + 1} large`}
          >
            <img
              src={src}
              alt={`${name} — photo ${i + 1}`}
              width={320}
              height={240}
              loading="lazy"
              className="w-full h-[220px] object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 sm:p-10"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo viewer`}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 text-white/80 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-6 text-white/80 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          <img
            src={images[openIndex]}
            alt={`${name} — photo ${openIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-6 text-white/80 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs font-bold tracking-widest uppercase">
              {openIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
