export const metadata = {
  title: 'Bistro Aurelia | Press',
}

export default function PressPage() {
  return (
    <>
      <section className="max-w-6xl mx-auto pt-28 md:pt-36 px-6 md:px-10 pb-24" data-parallax="0.02">
        <div className="reveal mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-amber">Press</p>
          <h1 className="font-display text-6xl md:text-7xl mt-3">Critical Acclaim</h1>
          <p className="text-mist/75 mt-4 max-w-2xl">
            Our work has been recognized for marrying culinary precision with spatial and sensory storytelling.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5" data-parallax="0.05">
          <article className="press-badge reveal rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-amber/80">Gastronomy Ledger</p>
            <h3 className="mt-3 font-display text-3xl">One of the most atmospheric dining rooms this year.</h3>
          </article>
          <article className="press-badge reveal rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-amber/80">Atelier Journal</p>
            <h3 className="mt-3 font-display text-3xl">A tactile interplay of architecture and cuisine.</h3>
          </article>
          <article className="press-badge reveal rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-amber/80">Table & Tone</p>
            <h3 className="mt-3 font-display text-3xl">Precision cooking set inside cinematic serenity.</h3>
          </article>
        </div>
      </section>
    </>
  )
}
