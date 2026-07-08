'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { label: 'Home', href: '/', nav: 'home' },
  { label: 'About', href: '/about', nav: 'about' },
  { label: 'Menu', href: '/menu', nav: 'menu' },
  { label: 'Press', href: '/press', nav: 'press' },
  { label: 'Reserve', href: '/book-table', nav: 'book-table' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const currentNav = navItems.find((item) => item.href === pathname)?.nav ?? ''

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8">
      <nav
        id="main-nav"
        className={`glass-nav mx-auto max-w-6xl rounded-[1.7rem] px-5 py-3 md:rounded-full md:px-8 md:py-4 ${scrolled ? 'scrolled' : ''}`}
      >
        <div className="flex items-center justify-between gap-4 md:gap-6">
          <Link
            href="/"
            className="font-display text-sm sm:text-base md:text-xl tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.2em] text-mist whitespace-nowrap"
          >
            BISTRO AURELIA
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm uppercase tracking-[0.2em] text-mist/90">
            {navItems.map((item) => (
              <Link
                key={item.nav}
                data-nav={item.nav}
                className={`hover:text-amber transition-colors ${
                  currentNav === item.nav ? 'text-amber' : ''
                }`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/book-table"
              className="hidden sm:inline text-xs md:text-sm uppercase tracking-[0.2em] text-amber hover:text-mist transition-colors"
            >
              Book
            </Link>
            <button
              type="button"
              className="mobile-nav-toggle md:hidden"
              data-mobile-toggle
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="text-xs uppercase tracking-[0.2em]">Menu</span>
            </button>
          </div>
        </div>
        <div
          id="mobile-menu"
          data-mobile-menu
          className={`mobile-menu mt-3 md:hidden ${mobileOpen ? 'open' : ''}`}
        >
          <div className="section-panel rounded-2xl p-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.nav}
                data-nav={item.nav}
                className={`mobile-nav-link ${currentNav === item.nav ? 'text-amber' : ''}`}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link className="mobile-nav-link" href="/book-table">
              Book
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
