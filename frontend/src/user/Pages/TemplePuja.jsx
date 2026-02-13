import { MapPin, Calendar, ArrowRight, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const upcomingPujas = [
  { id: 101, title: "Maha Shivratri Special Rudrabhishek", date: "Feb 26, 2026", img: "https://i.pinimg.com/736x/f4/7f/a6/f47fa60b150368934020c210c8c49d0d.jpg" },
  { id: 102, title: "Grand Ayodhya Aarti Deepotsav", date: "March 15, 2026", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b" },
  { id: 103, title: "Holika Dahan Shanti Path", date: "March 24, 2026", img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b" },
];

export default function TemplePuja() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % upcomingPujas.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getServices = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/puja/allServices/temple_puja`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Server connection failed");

        const data = await response.json();

        // FIX: Database column names check karein (standard_price, puja_name etc.)
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError("Backend connection refused. Please start your server.");
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF4E1]">
      {/* 1. HERO SECTION */}
      <section className="py-12 pt-5 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
            Divine Ceremonies
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#3b2a1a] leading-tight">
            Sacred Rituals & <span className="text-orange-500 italic">Temple Pujas</span>
          </h1>
        </div>
      </section>

      {/* 3. UPCOMING PUJA SLIDER */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative h-[35vh] w-full rounded-[32px] overflow-hidden shadow-xl bg-gray-900 border-4 border-white/50">
          {upcomingPujas.map((slide, idx) => (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}>
              <img src={slide.img} className="w-full h-full object-cover opacity-70" alt={slide.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-2xl font-serif">{slide.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-serif text-[#3b2a1a] mb-10">Sacred <span className="italic text-orange-500">Services</span></h2>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
            <p className="mt-4 font-bold text-gray-500">Fetching Services...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-bold">No services found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group flex flex-col md:flex-row bg-white rounded-[28px] overflow-hidden border border-orange-100/50 shadow-sm hover:shadow-lg transition-all h-auto md:h-64">
                {/* Image */}
                <div className="relative w-full md:w-[45%] h-52 md:h-full shrink-0 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/uploads/${service.image_url}`}
                    alt={service.puja_name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-[10px] font-bold text-orange-500 uppercase bg-orange-50 px-2 py-0.5 rounded">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-[#3b2a1a] mb-2 group-hover:text-orange-600 transition-colors">
                      {service.puja_name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <MapPin size={14} className="text-orange-300" />
                      <p className="text-[11px] font-semibold uppercase">{service.location || "Temple Location"}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="flex items-center gap-2 bg-[#3b2a1a] text-white px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase hover:bg-orange-600 transition-all"
                      onClick={() => navigate(`/templepuja/${service.id}`)}
                    >
                      Book Now <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}