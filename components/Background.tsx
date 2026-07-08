'use client'

import HeroScene from '@/components/HeroScene'

export default function Background() {
  return (
    <div className="global-background" aria-hidden="true">
      <HeroScene />
      <div className="hero-vignette" aria-hidden="true" />
    </div>
  )
}
