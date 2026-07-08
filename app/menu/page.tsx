export const metadata = {
  title: 'Bistro Aurelia | Menu',
}

export default function MenuPage() {
  return (
    <>
      <section className="max-w-6xl mx-auto pt-28 md:pt-36 px-6 md:px-10 pb-24" data-parallax="0.02">
        <div className="reveal mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-amber">Menu</p>
          <h1 className="font-display text-6xl md:text-7xl mt-3">Seasonal Signature Courses</h1>
          <p className="text-mist/75 mt-4 max-w-2xl">
            A curated progression designed to move from brightness to depth, with thoughtful contrasts in aroma and texture.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-parallax="0.04">
          <article className="tilt-card reveal rounded-3xl overflow-hidden">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
              alt="Fine dining dish"
              className="w-full h-72 object-cover"
            />
            <div className="tilt-glare" />
            <div className="section-panel rounded-b-3xl p-5">
              <h3 className="font-display text-3xl">Aged Amber Scallop</h3>
              <p className="text-mist/75 text-sm mt-2">Brown butter emulsion, fennel pollen, charred citrus.</p>
            </div>
          </article>

          <article className="tilt-card reveal rounded-3xl overflow-hidden">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
              alt="Pasta tasting plate"
              className="w-full h-72 object-cover"
            />
            <div className="tilt-glare" />
            <div className="section-panel rounded-b-3xl p-5">
              <h3 className="font-display text-3xl">Velvet Truffle Agnolotti</h3>
              <p className="text-mist/75 text-sm mt-2">Black garlic confit, aged pecorino, smoked herb oil.</p>
            </div>
          </article>

          <article className="tilt-card reveal rounded-3xl overflow-hidden">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80"
              alt="Roasted dish"
              className="w-full h-72 object-cover"
            />
            <div className="tilt-glare" />
            <div className="section-panel rounded-b-3xl p-5">
              <h3 className="font-display text-3xl">Midnight Duck Rosette</h3>
              <p className="text-mist/75 text-sm mt-2">Black cherry glaze, celery root silk, warm spice jus.</p>
            </div>
          </article>

          <article className="tilt-card reveal rounded-3xl overflow-hidden sm:col-span-2 lg:col-span-1">
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80"
              alt="Dessert plating"
              className="w-full h-72 object-cover"
            />
            <div className="tilt-glare" />
            <div className="section-panel rounded-b-3xl p-5">
              <h3 className="font-display text-3xl">Aurelia Nocturne</h3>
              <p className="text-mist/75 text-sm mt-2">Dark chocolate mousse, saffron pear, hazelnut praline.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
