export const isMobile: boolean =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

export const prefersReducedMotion: boolean =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const allowHeavy3D: boolean = !isMobile && !prefersReducedMotion
