'use client'

import { useEffect, useRef } from 'react'

interface Listing {
  name: string
  address?: string
  lat?: number
  lng?: number
}

interface ListingMapProps {
  listing: Listing
}

export default function ListingMap({ listing }: ListingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!listing || !listing.lat || !listing.lng || !mapRef.current) return

    function loadScript(src: string, id: string) {
      return new Promise<void>((resolve, reject) => {
        if (document.getElementById(id)) { resolve(); return }
        const s = document.createElement('script')
        s.id = id; s.src = src; s.onload = () => resolve(); s.onerror = reject
        document.head.appendChild(s)
      })
    }

    function loadCss(href: string, id: string) {
      if (document.getElementById(id)) return
      const l = document.createElement('link')
      l.id = id; l.rel = 'stylesheet'; l.href = href
      document.head.appendChild(l)
    }

    const init = async () => {
      loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'leaflet-css')
      await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'leaflet-js')

      const L = (window as any).L
      if (!L || !mapRef.current) return

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const position: [number, number] = [parseFloat(String(listing.lat)), parseFloat(String(listing.lng))]

      const map = L.map(mapRef.current).setView(position, 15)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      L.marker(position)
        .addTo(map)
        .bindPopup(`
          <div style="text-align:center;padding-bottom:8px;font-family:system-ui,sans-serif">
            <p style="font-weight:bold;color:#0B1619;font-size:14px;margin:0 0 4px">${listing.name}</p>
            ${listing.address ? `<p style="font-size:12px;color:#666;margin:0 0 16px">${listing.address}</p>` : ''}
            <p style="font-size:12px;font-weight:600;margin:0 0 12px">Open in Google Maps Navigation?</p>
            <div style="display:flex;gap:8px;justify-content:center">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}"
                target="_blank"
                rel="noopener noreferrer"
                style="background:#10b981;color:white;font-size:12px;font-weight:bold;padding:6px 12px;border-radius:4px;text-decoration:none"
              >
                Yes
              </a>
              <button
                onclick="this.closest('.leaflet-popup').querySelector('.leaflet-popup-close-button').click()"
                style="background:#e5e7eb;color:#374151;font-size:12px;font-weight:bold;padding:6px 12px;border-radius:4px;border:none;cursor:pointer"
              >
                Stay here
              </button>
            </div>
          </div>
        `, { maxWidth: 280 })
    }

    init()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [listing])

  if (!listing || !listing.lat || !listing.lng) return null

  return (
    <div className="mt-12">
      <div className="inline-flex items-center gap-3 mb-8">
        <span className="w-12 h-1 bg-brand-green rounded-full" />
        <h2 className="text-3xl font-heading font-black text-brand-navy tracking-tight uppercase">Location Map</h2>
      </div>

      <div ref={mapRef} className="w-full h-80 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 relative z-0" />
    </div>
  )
}
