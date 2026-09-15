import { useState } from 'react'
import { useWeather } from '../../hooks/useWeather'

const NAV_LEFT = [
  {
    label: 'Explore Killington',
    dropdown: [
      { label: 'Killington Resort',    href: '/killington-resort' },
      { label: 'Lodging Options',       href: '/listings?category=lodging-options' },
      { label: 'Woodward Terrain Park', href: '/woodward-terrain-park' },
      { label: 'Ski Lessons',           href: '/ski-lessons' },
      { 
        label: 'The Bus', 
        href: '/the-bus',
        dropdown: [
          { label: 'Overview', href: '/the-bus' },
          { label: 'Routes',   href: '/the-bus/routes' },
          { label: 'Schedule', href: '/the-bus/schedule' },
        ]
      },
      { label: 'Ski Lift Tickets',      href: '/ski-lift-tickets' },
      { label: 'Ski Conditions',        href: '/ski-conditions' },
    ],
  },
  {
    label: 'Things To Do',
    dropdown: [
      { label: 'Summer Activities', href: '/summer' },
      { label: 'Winter Activities', href: '/winter' },
    ],
  },
  { label: 'Food', href: '/listings?category=places-to-eat' },
  {
    label: "Traveler's Choice",
    dropdown: [
      { label: 'Adventure',  href: '/listings?category=adventure' },
      { label: 'Breweries',  href: '/listings?category=breweries' },
      { label: 'Food',       href: '/listings?category=places-to-eat' },
      { label: 'Golf',       href: '/listings?category=golf' },
      { label: 'Hiking',     href: '/listings?category=hiking' },
      { label: 'Ski Shops',  href: '/listings?category=ski-shops' },
    ],
  },
]

const NAV_RIGHT = [
  {
    label: 'Our Story',
    dropdown: [
      { label: 'How it Started', href: '/our-story' },
      { label: 'Our Team',       href: '/our-team' },
      { label: 'Giving Back',    href: '/giving-back' },
    ],
  },
  { label: 'Blog',               href: '/blog' },
  { label: 'Best Gear For 2026', href: '/gear' },
]

function Chevron() {
  return (
    <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function DesktopItem({ item }) {
  if (!item.dropdown) {
    const isExternal = item.href.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap font-medium transition-colors"
        >
          {item.label}
        </a>
      )
    }
    return (
      <a
        href={item.href}
        className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap font-medium transition-colors"
      >
        {item.label}
      </a>
    )
  }
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 whitespace-nowrap font-medium transition-colors">
        {item.label}
        <Chevron />
      </button>
      {/* invisible bridge so cursor can reach the menu */}
      <div className="absolute top-full left-0 w-full h-2" />
      <div className="absolute top-[calc(100%+0.5rem)] left-0 hidden group-hover:block z-50 min-w-[192px]">
        <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-1.5">
          {item.dropdown.map((sub) => {
            if (sub.dropdown) {
              return (
                <div key={sub.label} className="relative group/sub px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between">
                  <span>{sub.label}</span>
                  <svg className="w-3 h-3 -rotate-90 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {/* Nested side menu */}
                  <div className="absolute left-[calc(100%-0.5rem)] top-0 hidden group-hover/sub:block pl-2 z-50 min-w-[160px]">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-1.5">
                      {sub.dropdown.map((ss) => (
                        <a
                          key={ss.label + ss.href}
                          href={ss.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                          {ss.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <a
                key={sub.label + sub.href}
                href={sub.href}
                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {sub.label}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Navbar() {
  const { weather, loading } = useWeather()
  const [mobileOpen, setMobileOpen]  = useState(false)
  const [searchOpen, setSearchOpen]  = useState(false)
  const [openMobile, setOpenMobile]  = useState(null)
  const [openSubMobile, setOpenSubMobile] = useState(null)

  return (
    <>
      {/* ── Top tagline (Visible on all devices now) ── */}
      <div className="border-b border-gray-100 py-2 text-center bg-brand-navy">
        <p className="font-black uppercase text-white tracking-[0.2em] text-[10px] md:text-sm">
          Discover the Best of Killington, Vermont
        </p>
      </div>

      <header className="bg-white sticky top-0 z-50 shadow-sm transition-all duration-300">
        {/* ── Main nav row ── */}
        <div className="border-b border-gray-100 relative bg-white">
          <div className="max-w-screen-xl mx-auto px-5 h-20 md:h-24 flex items-center relative">
            
            {/* 1. MOBILE ONLY: Logo Left, Weather Center, Burger Right */}
            <div className="lg:hidden flex items-center justify-between w-full h-full relative">
              {/* Logo Left */}
              <a href="/" className="flex-shrink-0 z-20">
                <img src="/logo-color.png" alt="Killington Getaway" width={150} height={44} className="h-[44px] md:h-12 object-contain object-left" />
              </a>

              {/* Weather Center (Absolute) */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-gray-50/80 px-2.5 py-1.5 rounded-full border border-gray-100 shadow-sm z-10 pointer-events-none">
                {!loading && weather ? (
                  <div className="flex items-center gap-1.5 whitespace-nowrap pointer-events-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-[12px]">🏔️</span>
                      <span className="text-[10px] font-black text-brand-navy">{weather.temp}°F</span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-200" />
                    <div className="flex items-center gap-1">
                      <span className="text-[12px]">❄️</span>
                      <span className="text-[10px] font-black text-brand-navy uppercase">
                        {weather.newSnow > 0 ? `${weather.newSnow}"` : `${weather.snowDepth}"`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 whitespace-nowrap pointer-events-auto opacity-50 animate-pulse">
                    <div className="flex items-center gap-1">
                      <span className="text-[12px]">🏔️</span>
                      <span className="text-[10px] font-black text-brand-navy">--°F</span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-200" />
                    <div className="flex items-center gap-1">
                      <span className="text-[12px]">❄️</span>
                      <span className="text-[10px] font-black text-brand-navy uppercase">--&quot;</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Burger Right */}
              <button
                className="p-2 text-gray-600 z-20"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <svg className="w-[26px] h-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* 2. DESKTOP ONLY (lg+) */}
            {/* Left Nav Group */}
            <div className="hidden lg:flex items-center gap-1 lg:gap-2 flex-1 justify-start">
              {NAV_LEFT.map((item) => (
                <div key={item.label} className={item.label === 'Food' ? 'hidden xl:block' : ''}>
                  <DesktopItem item={item} />
                </div>
              ))}
            </div>

            {/* Logo Center - Absolute Centered with Sacred Padding */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-10 pointer-events-none">
              <div className="flex items-center justify-center px-12 lg:px-16 pointer-events-auto">
                <a href="/" className="transition-transform hover:scale-105 active:scale-95">
                  <img
                    src="/logo-color.png"
                    alt="Killington Getaway"
                    width={150}
                    height={65}
                    className="h-10 md:h-12 lg:h-[65px] object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Right Nav Group + Weather + Search */}
            <div className="hidden lg:flex items-center gap-1 lg:gap-2 flex-1 justify-end">
              <div className="flex items-center gap-1 lg:gap-2">
                {NAV_RIGHT.map((item) => (
                  <div key={item.label} className={item.label === 'Swag' ? 'hidden xl:block' : ''}>
                    <DesktopItem item={item} />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-gray-50/50 hover:bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 transition-all shadow-sm">
                {!loading && weather ? (
                  <>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">🏔️</span>
                      <span className="text-[9px] font-black text-brand-navy tracking-tight uppercase leading-none">
                        {weather.temp}°F
                      </span>
                    </div>
                    <div className="w-[1px] h-2.5 bg-gray-200" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm">❄️</span>
                      <span className="text-[9px] font-black text-brand-navy tracking-tight uppercase leading-none whitespace-nowrap">
                        {weather.newSnow > 0 ? `${weather.newSnow}" New` : `${weather.snowDepth}" Base`}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 opacity-50 animate-pulse">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">🏔️</span>
                      <span className="text-[9px] font-black text-brand-navy tracking-tight uppercase leading-none">
                        --°F
                      </span>
                    </div>
                    <div className="w-[1px] h-2.5 bg-gray-200" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm">❄️</span>
                      <span className="text-[9px] font-black text-brand-navy tracking-tight uppercase leading-none whitespace-nowrap">
                        --&quot;
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSearchOpen((s) => !s)}
                className={`p-2 rounded-lg transition-all ${searchOpen ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      {/* ── Search bar (expands below nav) ── */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out border-b border-gray-100 bg-white shadow-inner ${searchOpen ? 'max-h-[100px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="max-w-2xl mx-auto flex gap-4 px-6">
          <div className="flex-1 relative group">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search listings, activities, places…"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  window.location.href = `/listings?search=${encodeURIComponent(e.target.value.trim())}`
                }
              }}
            />
          </div>
          <button
            onClick={(e) => {
              const val = e.currentTarget.previousSibling.querySelector('input').value;
              if (val.trim()) window.location.href = `/listings?search=${encodeURIComponent(val.trim())}`;
            }}
            className="text-white text-sm font-black px-8 py-3 rounded-xl hover:opacity-90 transition-opacity bg-brand-blue shadow-premium uppercase tracking-widest"
          >
            Search
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white overflow-y-auto max-h-[75vh]">
          {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
            <div key={item.label} className="border-b border-gray-50 last:border-0">
              {item.dropdown ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700"
                    onClick={() => setOpenMobile(openMobile === item.label ? null : item.label)}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${openMobile === item.label ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openMobile === item.label && (
                    <div className="bg-gray-50 pb-2">
                      {item.dropdown.map((sub) => (
                        <div key={sub.label + sub.href}>
                          {sub.dropdown ? (
                            <>
                              <button
                                className="w-full flex items-center justify-between px-8 py-2.5 text-sm text-gray-600 hover:text-gray-900"
                                onClick={() => setOpenSubMobile(openSubMobile === sub.label ? null : sub.label)}
                              >
                                {sub.label}
                                <svg
                                  className={`w-3 h-3 text-gray-400 transition-transform ${openSubMobile === sub.label ? 'rotate-180' : ''}`}
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              {openSubMobile === sub.label && (
                                <div className="bg-gray-100/50 pb-1">
                                  {sub.dropdown.map((ss) => (
                                    <a
                                      key={ss.label + ss.href}
                                      href={ss.href}
                                      onClick={() => setMobileOpen(false)}
                                      className="block px-12 py-2 text-xs text-gray-500 hover:text-gray-900"
                                    >
                                      {ss.label}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <a
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="block px-8 py-2.5 text-sm text-gray-600 hover:text-gray-900"
                            >
                              {sub.label}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                (() => {
                  const isExternal = item.href && item.href.startsWith('http')
                  if (isExternal) {
                    return (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-5 py-3.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        {item.label}
                      </a>
                    )
                  }
                  return (
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-5 py-3.5 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      {item.label}
                    </a>
                  )
                })()
              )}
            </div>
          ))}
        </div>
      )}

    </header>
    </>
  )
}

export default Navbar
