import {
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function TrendingPuja() {
  const navigate = useNavigate();
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
        setServices(data.services);
      } catch (error) {
        console.log("Error", error);
      }
    };

    getSevices();
  }, []);

  const filteredServices = services
    .filter((service) => {
      const name = service.title || service.puja_name || "";
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice(0, 3); // <-- take only first 3 services

  return (
    <div className="min-h-screen bg-[#FFF4E1]">
      <section className="relative max-w-7xl mx-auto p-10">

        {/* TOP HEADER - CENTERED */}
        {/* TOP HEADER SECTION */}
        <div className="mb-12 flex flex-row items-center justify-between border-b border-orange-200 pb-6">
          {/* Left Side: Heading & Subtext */}
          <div className="flex flex-col">
            <h2 className="text-xl md:text-4xl font-serif font-bold text-[#3b2a1a] mb-1">
              Trending Pujas
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed opacity-90">
              Most booked ceremonies this month
            </p>
          </div>

          {/* Right Side: View All Button */}
          <button
            onClick={() => navigate('/homePuja')}
            className="group flex items-center gap-2 bg-white hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-300 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
          >
            <span>View All</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>



        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/homePuja/${service.id}`)}
              className="group relative bg-white rounded-[20px] overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(234,88,12,0.15)] border border-orange-300 cursor-pointer flex flex-col hover:-translate-y-2 active:scale-[0.98]"
            >
              {/* Image */}
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
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-serif text-[#2f1e12] leading-tight group-hover:text-orange-600 transition-colors line-clamp-1 mb-2">
                    {service.title || service.puja_name}
                  </h3>
                  <div className="flex items-center text-gray-400 text-xs font-medium gap-2">
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md">
                      <Calendar size={12} className="text-orange-500" />
                      <span className="text-orange-700">Available Daily</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>At Home</span>
                  </div>
                </div>

                {/* Footer */}
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

            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
