'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  if (pathname === '/about' || pathname === '/menu' || pathname === '/press') {
    return (
      <footer className="px-6 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto reveal section-panel rounded-3xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display text-3xl tracking-[0.12em]">BISTRO AURELIA</p>
          <Link href="/reservation" className="btn-3d">
            <span className="btn-3d-depth" />
            <span className="btn-3d-layer">Reserve</span>
          </Link>
        </div>
      </footer>
    )
  }

  if (pathname === '/reservation') {
    return (
      <footer className="px-6 md:px-10 pb-10">
        <div className="max-w-6xl mx-auto reveal section-panel rounded-3xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display text-3xl tracking-[0.12em]">BISTRO AURELIA</p>
          <Link href="/menu" className="btn-3d">
            <span className="btn-3d-depth" />
            <span className="btn-3d-layer">View Menu</span>
          </Link>
        </div>
      </footer>
    )
  }

  return (
    <footer className="px-6 md:px-10 pb-10">
      <div className="max-w-6xl mx-auto reveal section-panel rounded-3xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-display text-3xl tracking-[0.12em]">BISTRO AURELIA</p>
          <p className="text-sm text-mist/70 mt-1">32 Lumiere Passage, New York, NY</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="#" className="icon-link" aria-label="Instagram">
            <span className="text-xs">IG</span>
          </Link>
          <Link href="#" className="icon-link" aria-label="Facebook">
            <span className="text-xs">FB</span>
          </Link>
          <Link href="#" className="icon-link" aria-label="Email">
            <span className="text-xs">EM</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
