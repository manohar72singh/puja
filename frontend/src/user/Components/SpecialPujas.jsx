export default function SpecialPujas() {
  const pujas = [
    {
      id: 1,
      title: "92,000 Shani Mool Mantra Jaap and 1008 Sankat Mochan Hanuman Ashtak Path",
      subtitle: "For Removing Negativity and Ensuring Protection from Obstacles in Life",
      temple: "Shri Navgraha Shani Temple, Ujjain, Madhya Pradesh",
      date: "31 January, Saturday, Magh Shukla Trayodashi",
      image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da",
      tag: "Shani Trayodashi Special",
    },
    {
      id: 2,
      title: "Sri Yantra Havan and Maha Tripura Sundari Shaktipeeth Aarti",
      subtitle: "For Material abundance and attracting Wealth",
      temple: "Maa Tripura Sundari Shaktipeeth, Udaipur, Tripura",
      date: "1 February, Sunday, Magha Shukla Purnima",
      image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a",
      tag: "Lalita Jayanti Special",
    },
    {
      id: 3,
      title: "Shani Saade Saati Shanti Puja",
      subtitle: "For Shani Saade Saati Shanti and Inner Stability",
      temple: "Shri Navgraha Shani Temple, Ujjain, Madhya Pradesh",
      date: "31 January, Saturday, Magha Shukla Trayodashi",
      image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80",
      tag: "Dosha Nivaran Puja",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF4E1] px-6 py-12 md:px-10 md:py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADING SECTION - Added mb-16 for a larger gap */}
        <div className="mb-16 md:mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center leading-tight font-serif text-[#3b2a1a]">
            Sacred Rituals, <br className="sm:hidden" />
            <span className="text-orange-500">Modern Convenience</span>
          </h1>
          
        </div>

        {/* CARDS GRID - Added gap-10 for better breathing room between cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pujas.map((puja) => (
            <div
              key={puja.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={puja.image}
                  alt={puja.title}
                  className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  {puja.tag}
                </span>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="font-serif text-xl text-[#3b2a1a] mb-3 leading-snug">
                  {puja.title}
                </h3>

                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {puja.subtitle}
                </p>

                <div className="text-sm text-gray-600 space-y-3 mb-8 border-t border-gray-50 pt-6">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0">📍</span> 
                    <span>{puja.temple}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0">📅</span> 
                    <span>{puja.date}</span>
                  </div>
                </div>

                <button className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold tracking-wide shadow-md shadow-orange-100 transition-colors">
                  PARTICIPATE NOW →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}