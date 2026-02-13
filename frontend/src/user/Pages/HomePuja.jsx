import {
  MapPin,
  Calendar,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const upcomingPujas = [
  {
    id: 101,
    title: "Maha Shivratri Special Rudrabhishek",
    date: "Feb 26, 2026",
    img: "https://i.pinimg.com/736x/f4/7f/a6/f47fa60b150368934020c210c8c49d0d.jpg",
  },
  {
    id: 102,
    title: "Grand Ayodhya Aarti Deepotsav",
    date: "March 15, 2026",
    img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b",
  },
  {
    id: 103,
    title: "Holika Dahan Shanti Path",
    date: "March 24, 2026",
    img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
  },
];

export default function HomePuja() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getSevices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${API_BASE_URL}/puja/allServices/home_puja`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        // console.log(data)
        setServices(data.services);
      } catch (error) {
        console.log("Error", error);
      }
    };

    getSevices();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % upcomingPujas.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const filteredServices = services.filter((service) => {
    const name = service.title || service.puja_name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
            Sacred Rituals &{" "}
            <span className="text-orange-500 italic">Temple Pujas</span>
          </h1>
          <p className="mt-4 mb-4 text-gray-600 text-sm max-w-lg mx-auto">
            Authentic Vedic rituals by verified priests at India’s holiest
            shrines.
          </p>
        </div>
      </section>

      {/* 2. SEARCH INPUT */}
      <div
        className="max-w-7xl mx-auto px-6 py-6 bg-[#FFF4E1]
"
      >
        <div className="relative w-full max-w-2xl mx-auto">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for Temple, God or Dosha..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-orange-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-[#3b2a1a]"
          />
        </div>
      </div>

      {/* 4. SERVICES GRID */}

      <section className="relative max-w-7xl mx-auto px-6 pb-28">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-300 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-200 rounded-full blur-[150px]"></div>
        </div>

        <div className="flex flex-col mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-orange-300"></div>
            <span className="text-xs tracking-[0.3em] uppercase text-orange-600 font-bold">
              Sacred Luxury Rituals
            </span>
            <div className="h-[1px] w-12 bg-orange-300"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2f1e12] mb-4">
            Divine <span className="text-orange-600 italic">Home Pujas</span>
          </h2>
          <p className="mt-2 text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Bring the sanctity of the temple to your doorstep with authentic
            Vedic ceremonies performed by master priests.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/homePuja/${service.id}`)}
              className="group relative bg-white rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(234,88,12,0.2)] border border-orange-200 cursor-pointer"
            >
              {/* Image Container - Height reduced slightly from h-72 to h-60 */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={`${API_BASE_URL}/uploads/${service.image_url}`}
                  alt={service.puja_name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>

                {/* Price Badge - Slightly smaller padding */}
                <div className="absolute top-4 right-4 backdrop-blur-md bg-orange-100 border border-orange-500 px-3 py-1.5 rounded-xl">
                  <span className="text-black font-bold text-base">
                    ₹{service.standard_price}
                  </span>
                </div>

                {/* Floating Tag */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-orange-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                    Verified Pandit
                  </span>
                </div>
              </div>

              {/* Content Section - Reduced from p-8 to p-5 */}
              <div className="p-5">
                <div className="mb-2">
                  <h3 className="text-xl font-serif text-[#3b2a1a] leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                    {service.title || service.puja_name}
                  </h3>
                  <div className="flex items-center text-gray-500 text-[13px] gap-1.5 mt-1">
                    <Calendar size={14} className="text-orange-500" />
                    <span>Available Daily</span>
                  </div>
                </div>

                {/* Action Section - Tighter border and padding */}
                <div className="pt-3 mt-3 border-t border-orange-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                    Book Ritual
                  </span>
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
