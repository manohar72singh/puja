import {
  MapPin,
  Calendar,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
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

// ... (Imports same rahenge)

export default function TemplePuja() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/puja/temple-puja`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Server connection failed");
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      } catch (err) {
        setError("Backend connection refused. Please start your server.", err);
      } finally {
        setLoading(false);
      }
    };
    getServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF4E1]">
      {/* HERO & SLIDER SECTION (Same as before) */}
      {/* ... */}

      {/* 4. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-serif text-[#3b2a1a] mb-10">
          Sacred <span className="italic text-orange-500">Services</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
            <p className="mt-4 font-bold text-gray-500">Fetching Services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col md:flex-row bg-white rounded-[28px] overflow-hidden border border-orange-100/50 shadow-sm hover:shadow-xl transition-all h-auto min-h-[280px]"
              >
                {/* Image Section */}
                <div className="relative w-full md:w-[40%] h-52 md:h-auto shrink-0 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/uploads/${service.image_url}`}
                    alt={service.puja_name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow-sm">
                    <p className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                      <Calendar size={12} /> 
                      {/* Date Format: YYYY-MM-DD ko readable banaya */}
                      {service.dateOfStart ? new Date(service.dateOfStart).toLocaleDateString() : "Special Date"}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif text-[#3b2a1a] group-hover:text-orange-600 transition-colors">
                        {service.puja_name}
                      </h3>
                    </div>

                    {/* Address Field */}
                    <div className="flex items-start gap-2 text-gray-600 mb-3">
                      <MapPin size={16} className="text-orange-400 shrink-0 mt-0.5" />
                      <p className="text-xs leading-relaxed font-medium italic">
                        {service.address || "Varanasi, Uttar Pradesh"}
                      </p>
                    </div>

                    {/* About Field (Limited to 2 lines) */}
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {service.about || "Experience divine peace with our sacred temple rituals performed by certified priests."}
                    </p>
                  </div>

                  {/* Footer: Pricing and Button */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Starting from</span>
                      <span className="text-lg font-bold text-[#3b2a1a]">₹{service.price || "501"}</span>
                    </div>
                    
                    <button
                      className="flex items-center gap-2 bg-[#3b2a1a] text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase hover:bg-orange-600 shadow-md hover:shadow-orange-200 transition-all active:scale-95"
                      onClick={() => navigate(`/templepuja/${service.id}`)}
                    >
                      Book Ritual <ArrowRight size={14} />
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
