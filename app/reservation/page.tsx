export const metadata = {
  title: 'Bistro Aurelia | Reservation',
}

export default function ReservationPage() {
  return (
    <>
      <section className="max-w-5xl mx-auto pt-28 md:pt-36 px-6 md:px-10 pb-24" data-parallax="0.03">
        <div className="section-panel reveal rounded-[2rem] p-8 md:p-12 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-amber">Reservation</p>
          <h1 className="font-display text-6xl md:text-7xl mt-3">Enter The Evening</h1>
          <p className="mt-5 text-mist/80 max-w-2xl mx-auto">
            Secure your place for an intentional dining sequence curated around the season&apos;s most expressive ingredients.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-5 text-left">
            <div className="section-panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-amber/85">Service Hours</p>
              <p className="mt-3 text-mist/85">Tuesday - Sunday</p>
              <p className="text-mist/75">18:00 - 23:00</p>
            </div>
            <div className="section-panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-amber/85">Reservation Desk</p>
              <p className="mt-3 text-mist/85">+1 (212) 555-0147</p>
              <p className="text-mist/75">reserve@bistroaurelia.com</p>
            </div>
          </div>

          <div className="mt-8">
            <button className="btn-3d" type="button">
              <span className="btn-3d-depth" aria-hidden="true" />
              <span className="btn-3d-layer">Request Reservation</span>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
