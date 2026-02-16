import { Video, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function SpecialPujas() {
  const pujas = [
    {
      id: 1,
      title: "Shani Mool Mantra Jaap",
      subtitle: "Removing Negativity & Obstacles",
      temple: "Shani Temple, Ujjain",
      date: "31 Jan, Saturday",
      image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da",
      tag: "Shani Special",
    },
    {
      id: 2,
      title: "Sri Yantra Havan",
      subtitle: "Wealth & Material Abundance",
      temple: "Tripura Shaktipeeth, Udaipur",
      date: "1 Feb, Sunday",
      image: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a",
      tag: "Lalita Jayanti",
    },
    {
      id: 3,
      title: "Shani Saade Saati Shanti",
      subtitle: "For Inner Stability & Peace",
      temple: "Shani Temple, Ujjain",
      date: "31 Jan, Saturday",
      image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da",
      tag: "Dosha Nivaran",
    },
  ];

  return (
    <div className="bg-[#FFF4E1] px-6 py-16 md:px-10 lg:py-24">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 bg-[#fbf2ca] text-orange-400 px-4 py-1.5 rounded-full mb-6 shadow-sm transition-all hover:scale-105">
            <Video size={14} strokeWidth={3} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Online Events</span>
          </div>

          <h2 className="text-xl md:text-4xl font-serif font-bold text-[#3b2a1a] mb-4 ">
            Upcoming Group Pujas
          </h2>

          <p className="text-gray-500 text-sm md:text-base max-w-xl opacity-80 leading-relaxed">
            Join thousands of devotees in collective worship and receive 
            <br className="hidden md:block" /> divine blessings from anywhere in the world.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pujas.map((puja) => (
            <div
              key={puja.id}
              className="group bg-white rounded-[22px] overflow-hidden border border-orange-300 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col h-full active:scale-[0.98]"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={puja.image}
                  alt={puja.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                
                {/* Floating Tag */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#3b2a1a] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-orange-100">
                  {puja.tag}
                </span>

                {/* Date Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Calendar size={12} className="text-orange-300" />
                  <span className="text-[11px] font-bold tracking-wide">{puja.date}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-7 flex flex-col flex-grow">
                <h3 className="font-serif text-xl font-bold text-[#3b2a1a] mb-2 leading-tight">
                  {puja.title}
                </h3>
                
                <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-5">
                  {puja.subtitle}
                </p>

                <div className="flex items-start gap-3 text-gray-500 mb-8 mt-auto">
                  <MapPin size={14} className="shrink-0 text-orange-300 mt-1" />
                  <span className="text-xs font-medium leading-relaxed">{puja.temple}</span>
                </div>

                {/* Button with Border & Subtle Hover */}
                <button className="flex items-center justify-between w-full bg-white hover:bg-orange-500 text-orange-600 hover:text-white px-5 py-3.5 rounded-2xl font-bold text-sm border border-orange-200 transition-all duration-300 group/btn">
                  <span>Participate Now</span>
                  <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}