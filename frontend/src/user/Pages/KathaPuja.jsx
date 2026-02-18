import { MapPin, Calendar, ArrowRight, Search, Sparkles  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const upcomingPujas = [
  { id: 101, title: "Maha Shivratri Special Rudrabhishek", date: "Feb 26, 2026", img: "https://i.pinimg.com/736x/f4/7f/a6/f47fa60b150368934020c210c8c49d0d.jpg" },
  { id: 102, title: "Grand Ayodhya Aarti Deepotsav", date: "March 15, 2026", img: "https://images.unsplash.com/photo-1605640840605-14ac1855827b" },
  { id: 103, title: "Holika Dahan Shanti Path", date: "March 24, 2026", img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b" },
];

export default function KathaPuja() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getSevices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/allServices/katha`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.log("Error", error);
      }
    };
    getSevices();
  }, []);

  const filteredServices = services.filter((service) => {
    const name = service.title || service.puja_name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#FFF4E1]">
      <section className="relative max-w-7xl mx-auto p-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-300 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-200 rounded-full blur-[150px]"></div>
        </div>

        {/* HEADER SECTION */}
        <div className="flex flex-col mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-orange-300"></div>
            <span className="text-xs tracking-[0.3em] uppercase text-orange-600 font-bold">
              Sacred Luxury Rituals
            </span>
            <div className="h-[1px] w-12 bg-orange-300"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2f1e12] mb-4">
            Divine <span className="text-orange-600 italic">Katha & Jaap</span>
          </h2>
          <p className="mt-2 text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Authentic Vedic rituals and sacred narrations by master priests,
            bringing peace and prosperity to your spiritual journey.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full max-w-2xl mx-auto mb-15">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for Katha, Jaap or Devta..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-orange-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-[#3b2a1a]"
          />
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/katha-jaap/${service.id}`)}
              className="group relative bg-white rounded-[20px] overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(234,88,12,0.15)] border border-orange-300 cursor-pointer flex flex-col hover:-translate-y-2 active:scale-[0.98]"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={`${API_BASE_URL}/uploads/${service.image_url}`}
                  alt={service.puja_name}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                />

                {/* Visible Luxury Price Badge */}
                <div className="absolute top-3 right-4 z-20">
                  <div className="bg-orange-400 text-white px-2 py-1 rounded-full flex items-center gap-2">
                    <Sparkles size={12} fill="white" className="text-white" />
                    <span className="text-[13px] font-semibold tracking-wide">
                      Trending
                    </span>
                  </div>
                </div>

                {/* Bottom Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80"></div>
              </div>

              {/* Content Section */}
              <div className="p-7 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-serif text-[#2f1e12] leading-tight group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
                    {service.title || service.puja_name}
                  </h3>
                  <div className="flex items-center text-gray-400 text-xs font-medium gap-2">
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md">
                      <Calendar size={12} className="text-orange-500" />
                      <span className="text-orange-700 font-bold">Vedic Path</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Verified Pandit</span>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-auto pt-5 border-t border-orange-50 flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.15em] mb-0.5">
                      Dakshina
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-gray-900">₹</span>
                      <span className="text-2xl font-serif font-black text-[#3D2B1D] tracking-tighter">
                        {service.standard_price}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 ml-0.5">/-</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#2f1e12] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      Book Now
                    </span>
                    <div className="w-11 h-11 rounded-2xl border border-orange-200 bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-500 shadow-sm">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Bottom Glow Line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}