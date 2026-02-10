import { MapPin, Calendar, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const services = [
  {
    id: 1,
    title: "Satyanarayan Katha",
    temple: "Ayodhya Ram Mandir",
    category: "Dosha",
    date: "Thursday",
    rating: 4.9,
    reviews: 180,
    price: "₹1500",
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b",
    badge: "Popular",
  },
  {
    id: 2,
    title: "Griha Pravesh Puja",
    temple: "Haridwar",
    category: "Marriage",
    date: "Auspicious Day",
    rating: 4.7,
    reviews: 92,
    price: "₹4100",
    image: "https://i.pinimg.com/736x/f4/7f/a6/f47fa60b150368934020c210c8c49d0d.jpg",
  },
  {
    id: 3,
    title: "Maha Mrityunjaya Jaap",
    temple: "Kashi Vishwanath",
    category: "Shiv Puja",
    date: "Monday",
    rating: 5.0,
    reviews: 256,
    price: "₹5100",
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
    badge: "Highly Rated"
  },
  {
    id: 4,
    title: "Rahu–Ketu Shanti Puja",
    temple: "Srikalahasti",
    category: "Navgraha",
    date: "Next Week",
    rating: 4.6,
    reviews: 110,
    price: "₹2700",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
  },
  {
    id: 5,
    title: "Kaal Sarp Dosha Puja",
    temple: "Trimbakeshwar, Nashik",
    category: "Dosha",
    date: "Tomorrow",
    rating: 4.8,
    reviews: 124,
    price: "₹2100",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    badge: "Most Booked",
  },
  {
    id: 6,
    title: "Manglik Dosha Nivaran",
    temple: "Ujjain Mahakal",
    category: "Marriage",
    date: "Amavasya",
    rating: 4.7,
    reviews: 98,
    price: "₹2500",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIc1BqS_aDmS26-3x3JSSotU2p0Dr2InktA&s",
    badge: "Recommended",
  },
  {
    id: 7,
    title: "Navgraha Shanti Puja",
    temple: "Kashi Vishwanath",
    category: "Navgraha",
    date: "This Week",
    rating: 4.9,
    reviews: 210,
    price: "₹3100",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN4BqbvT9jy2Jgqr3gQY-Q9bWELVO3eyyS6A&s",
  },
  {
    id: 8,
    title: "Rudrabhishek",
    temple: "Somnath Temple",
    category: "Shiv Puja",
    date: "Monday",
    rating: 4.6,
    reviews: 76,
    price: "₹1100",
    image: "https://static.wixstatic.com/media/6642a4_8930a82d27434739a6aeaf5fc2d4e2fe~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6642a4_8930a82d27434739a6aeaf5fc2d4e2fe~mv2.jpg",
  },
];

const upcomingPujas = [
  { id: 101, title: "Maha Shivratri Special Rudrabhishek", date: "Feb 26, 2026", img: "https://i.pinimg.com/736x/f4/7f/a6/f47fa60b150368934020c210c8c49d0d.jpg" },
  { id: 102, title: "Grand Ayodhya Aarti Deepotsav", date: "March 15, 2026", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b" },
  { id: 103, title: "Holika Dahan Shanti Path", date: "March 24, 2026", img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b" },
];

export default function HomePuja() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % upcomingPujas.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    // FULL PAGE BACKGROUND COLOR SET HERE
    <div className="min-h-screen bg-[#FFF4E1]">

      {/* 1. HERO SECTION (Adjusted for same bg) */}
      <section className="bg-[#FFF4E1]py-12 pt-5 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
            Divine Ceremonies
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#3b2a1a] leading-tight">
            Sacred Rituals & <span className="text-orange-500 italic">Temple Pujas</span>
          </h1>
          <p className="mt-4 mb-4 text-gray-600 text-sm max-w-lg mx-auto">
            Authentic Vedic rituals by verified priests at India’s holiest shrines.
          </p>
        </div>
      </section>


      {/* 2. SEARCH INPUT */}
      <div className="max-w-7xl mx-auto px-6 py-6 bg-[#FFF4E1]
">
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
          <input
            type="text"
            placeholder="Search for Temple, God or Dosha..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-orange-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-[#3b2a1a]"
          />
        </div>
      </div>

      {/* 4. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20 bg-[#FFF4E1]">
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-[2px] w-8 bg-orange-500"></span>
            <span className="text-orange-500 font-bold text-[10px] uppercase tracking-widest">Divine Experiences</span>
          </div>
          <h2 className="text-3xl font-serif text-[#3b2a1a]">Sacred <span className="italic text-orange-500">Services</span></h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col md:flex-row  bg-white rounded-[28px] overflow-hidden border border-orange-300 shadow-sm hover:shadow-lg transition-all duration-300 h-auto md:h-64"
            >
              {/* Image Container */}
              <div className="relative w-full md:w-[45%] h-52 md:h-full shrink-0 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold opacity-80 uppercase mb-0.5">Dakshina</p>
                  <p className="text-xl font-bold">{service.price}</p>
                </div>
              </div>

              {/* Content Box (Background white to pop out from cream bg) */}
              <div className="p-6 flex flex-col justify-between flex-1 bg-white"
              onClick={() => navigate(`/homePuja/${service.id}`)}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-orange-500 uppercase bg-orange-50 px-2 py-0.5 rounded">
                      {service.category}
                    </span>
                    <span className="text-xs font-bold text-[#3b2a1a]">★ {service.rating}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-[#3b2a1a] mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={14} className="text-orange-300" />
                      <p className="text-[11px] font-semibold uppercase truncate">{service.temple}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={14} className="text-orange-300" />
                      <p className="text-[11px] font-semibold uppercase">{service.date}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    className="flex items-center gap-2 bg-[#3b2a1a] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase hover:bg-orange-600 transition-all group/btn"
                    onClick={() => navigate(`/homePuja/${service.id}`)}
                  >
                    Book Now
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}