export default function DevotionalStats() {
  return (
    <section className="bg-[#0a8d64] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm font-semibold text-orange-100 mb-3">
            Trusted by Over 30 Million Devotees
          </p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            India’s Largest Devotional Platform
          </h2>

          <p className="text-orange-100 text-lg leading-relaxed max-w-xl">
            We are committed to building the most trusted destination that
            serves the devotional needs of millions of devotees in India and
            abroad, providing them the access they always wanted.
          </p>
        </div>

        {/* RIGHT STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* CARD 1 */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#076849] flex items-center justify-center text-xl">
              🙏
            </div>
            <div>
              <h3 className="text-2xl font-bold">30M+ Devotees</h3>
              <p className="text-orange-100">
                have trusted us in their devotional journey
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#076849] flex items-center justify-center text-xl">
              ⭐
            </div>
            <div>
              <h3 className="text-2xl font-bold">4.5 star rating</h3>
              <p className="text-orange-100">
                Over 1 Lakh devotees express their love for us on Play Store
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#076849] flex items-center justify-center text-xl">
              🌍
            </div>
            <div>
              <h3 className="text-2xl font-bold">30+ Countries</h3>
              <p className="text-orange-100">
                We help devotees globally reconnect with their devotional heritage
              </p>
            </div>
          </div>

          {/* CARD 4 */}
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#076849] flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <h3 className="text-2xl font-bold">3M+ Services</h3>
              <p className="text-orange-100">
                Millions of devotees have commenced Pooja and Chadhava at famous
                temples of India with us
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
