'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { allowHeavy3D, prefersReducedMotion } from '@/lib/constants'

function setupRevealObserver(): () => void {
  const revealEls = document.querySelectorAll<HTMLElement>('.reveal')
  if (!revealEls.length) return () => {}

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  )

  revealEls.forEach((el) => observer.observe(el))

  return () => observer.disconnect()
}

function setupTiltCards(): void {
  const cards = document.querySelectorAll<HTMLElement>('.tilt-card')
  if (!allowHeavy3D) return

  const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
    const rect = card.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const px = mx / rect.width - 0.5
    const py = my / rect.height - 0.5
    card.style.transform = `rotateX(${-py * 10}deg) rotateY(${px * 14}deg) translateZ(18px)`
    card.style.setProperty('--mx', `${(mx / rect.width) * 100}%`)
    card.style.setProperty('--my', `${(my / rect.height) * 100}%`)
  }

  const handleMouseLeave = (card: HTMLElement) => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => handleMouseMove(e, card))
    card.addEventListener('mouseleave', () => handleMouseLeave(card))
  })
}

function setupGsapEntry(): void {
  if (prefersReducedMotion) return

  gsap.from('.depth-title', {
    y: 90,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
  })

  gsap.from('.sub-depth', {
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 1,
    ease: 'power2.out',
  })
}

function setupCanvasAnimation(): void {
  if (prefersReducedMotion) return
  if (!document.getElementById('hero-canvas-wrap')) return

  gsap.to('#hero-canvas-wrap', {
    filter: 'blur(1.4px) saturate(1.2)',
    duration: 3.6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

function setupParallax(): () => void {
  const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]')
  let ticking = false

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0')
        if (!allowHeavy3D || !speed) {
          el.style.transform = 'translate3d(0,0,0)'
          return
        }
        el.style.transform = `translate3d(0, ${-y * speed}px, 0)`
      })
      ticking = false
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  return () => window.removeEventListener('scroll', onScroll)
}

export default function ClientInit({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const cleanupParallax = setupParallax()
    setupCanvasAnimation()
    return () => {
      cleanupParallax()
    }
  }, [])

  useEffect(() => {
    const cleanupObserver = setupRevealObserver()
    setupTiltCards()
    setupGsapEntry()
    return () => {
      cleanupObserver()
    }
  }, [pathname])

  return <>{children}</>
}
