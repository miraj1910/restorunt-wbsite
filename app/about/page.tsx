import Link from 'next/link'

export const metadata = {
  title: 'Bistro Aurelia | About',
}

export default function AboutPage() {
  return (
    <>
      <section className="page-hero px-6 md:px-10 flex items-center pt-28 md:pt-36" data-parallax="0.02">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center w-full">
          <div className="reveal">
            <p className="uppercase tracking-[0.3em] text-xs text-amber">About Bistro Aurelia</p>
            <h1 className="font-display text-6xl md:text-7xl leading-[0.9] mt-4">
              A House Built For Sensory Ritual
            </h1>
            <p className="mt-6 text-mist/80 leading-relaxed max-w-xl">
              Our atelier was designed to make dining feel theatrical yet intimate, balancing craft, precision, and graceful hospitality.
            </p>
          </div>
          <article className="tilt-card reveal rounded-[1.75rem] overflow-hidden">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
              alt="Restaurant ambience"
              className="w-full h-[26rem] object-cover"
            />
            <span className="tilt-glare" />
          </article>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24" data-parallax="0.04">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="section-panel reveal rounded-3xl p-8">
            <h2 className="font-display text-4xl">Philosophy</h2>
            <p className="mt-4 text-mist/80">
              Seasonality leads every decision. We build each course around texture, contrast, and emotional pacing.
            </p>
          </div>
          <div className="section-panel reveal rounded-3xl p-8">
            <h2 className="font-display text-4xl">Craft</h2>
            <p className="mt-4 text-mist/80">
              Technique is present but not loud, allowing ingredients and atmosphere to carry the narrative.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
