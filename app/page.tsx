import Link from 'next/link'

export const metadata = {
  title: 'Bistro Aurelia | Home',
}

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="relative z-10 text-center max-w-4xl">
          <p className="sub-depth reveal uppercase tracking-[0.35em] text-sm md:text-base text-amber/90">
            Immersive Culinary Atelier
          </p>
          <h1 className="depth-title reveal mt-4 text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9]">
            Bistro<br />Aurelia
          </h1>
          <p className="sub-depth reveal mx-auto mt-8 max-w-2xl text-base md:text-lg text-mist/85 leading-relaxed">
            A luxury dining stage where architecture, atmosphere, and cuisine unfold in cinematic layers.
          </p>
          <div className="sub-depth reveal mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/book-table" className="btn-3d">
              <span className="btn-3d-depth" aria-hidden="true" />
              <span className="btn-3d-layer">Reserve A Table</span>
            </Link>
            <Link href="/menu" className="btn-3d">
              <span className="btn-3d-depth" aria-hidden="true" />
              <span className="btn-3d-layer">View Tasting</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20" data-parallax="0.03">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <article className="tilt-card reveal rounded-[1.75rem] overflow-hidden">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
              alt="Elegant interior dining scene"
              className="w-full h-[24rem] md:h-[30rem] object-cover"
            />
            <span className="tilt-glare" />
          </article>
          <div className="reveal">
            <p className="uppercase tracking-[0.3em] text-xs text-amber">The Experience</p>
            <h2 className="font-display text-5xl md:text-6xl mt-4 leading-[0.95]">
              Architectural Dining<br />In Motion
            </h2>
            <p className="mt-5 text-mist/80 leading-relaxed">
              Explore dedicated pages for our philosophy, menus, press features, and reservation journey.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link href="/about" className="btn-3d">
                <span className="btn-3d-depth" />
                <span className="btn-3d-layer">About</span>
              </Link>
              <Link href="/press" className="btn-3d">
                <span className="btn-3d-depth" />
                <span className="btn-3d-layer">Press</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
