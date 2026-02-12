import { MapPin, Calendar, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const upcomingPujas = [
  { id: 101, title: "Maha Shivratri Special Rudrabhishek", date: "Feb 26, 2026", img: "https://i.pinimg.com/736x/f4/7f/a6/f47fa60b150368934020c210c8c49d0d.jpg" },
  { id: 102, title: "Grand Ayodhya Aarti Deepotsav", date: "March 15, 2026", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b" },
  { id: 103, title: "Holika Dahan Shanti Path", date: "March 24, 2026", img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b" },
];

export default function HomePuja() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([])

  useEffect(() => {
    const getSevices = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(`http://localhost:5000/puja/allServices`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await response.json();
        // console.log(data)
        setServices(data)
      } catch (error) {
        console.log("Error", error)
      }
    }

    getSevices();
  }, [])


  

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
      <section className="relative max-w-7xl mx-auto px-6 pb-28">

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,170,0,0.15),_transparent_70%)]"></div>

        <div className="flex flex-col mb-14 text-center">
          <span className="text-xs tracking-[4px] uppercase text-orange-500 font-semibold mb-2">
            Sacred Luxury Rituals
          </span>
          <h2 className="text-5xl font-serif text-[#2f1e12]">
            Divine <span className="text-orange-500 italic">Home Pujas</span>
          </h2>
          <p className="mt-3 text-gray-600 text-sm max-w-xl mx-auto">
            Experience authentic Vedic rituals performed by learned priests in the comfort of your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services
            .filter(service => service.puja_type === "home_puja")
            .map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/homePuja/${service.id}`)}
                className="group relative bg-white/70 backdrop-blur-xl border border-orange-200 rounded-[36px] overflow-hidden shadow-xl hover:shadow-[0_25px_60px_rgba(249,115,22,0.25)] hover:-translate-y-3 transition-all duration-700 cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/uploads/${service.image_url}`}
                    alt={service.puja_name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Price Luxury Badge */}
                  <div className="absolute top-5 right-5 bg-gradient-to-r from-orange-500 to-amber-400 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg tracking-wide">
                    ₹ {service.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-[#3b2a1a] mb-3 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-5 font-medium">
                    {service.puja_name}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-orange-400" />
                      {service.date}
                    </div>

                    <button className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-wider group-hover:gap-3 transition-all">
                      Book Now
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Golden Border Glow Effect */}
                <div className="absolute inset-0 rounded-[36px] border border-transparent group-hover:border-orange-400/50 transition-all duration-700"></div>
              </div>
            ))}
        </div>
      </section>


    </div>
  );
}