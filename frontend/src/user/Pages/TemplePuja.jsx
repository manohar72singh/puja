import { MapPin, Calendar, ArrowRight, Search, Video, Sparkles, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function KathaPuja() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getSevices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/temple-puja`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        setServices(data.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    getSevices();
  }, []);



  return (
    <div className="min-h-screen bg-[#FFF4E1] text-[#2D1B08] selection:bg-orange-100">
      {/* Soft Ambient Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
      </div>

      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-20">

        {/* HEADER SECTION - CENTERED & LARGE TEXT */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-orange-300"></div>
            <span className="text-xs tracking-[0.3em] uppercase text-orange-600 font-bold">
              Sacred Luxury Rituals
            </span>
            <div className="h-[1px] w-12 bg-orange-300"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif leading-[1.1] mb-6 tracking-tight text-[#1A1108]">
            Divine <span className="text-orange-600 italic">Temple Puja</span>
          </h1>

          <p className="mt-2 text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Authentic Vedic rituals and sacred narrations by master priests,
            bringing peace and prosperity to your spiritual journey.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full max-w-2xl mx-auto mb-20">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services
            .filter(service =>
              service.puja_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase()))
            ).map((service) => (
              <div
                key={service.service_id}
                onClick={() => navigate(`/temple-puja/${service.service_id}`)}
                className="group relative cursor-pointer bg-white rounded-[20px] overflow-hidden border border-orange-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_-15px_rgba(251,146,60,0.25)] hover:-translate-y-3 transition-all duration-500 ease-out flex flex-col active:scale-[0.98]"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/uploads/${service.image_url}`}
                    alt={service.puja_name}
                    className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1108]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Price Badge */}
                  <div className="absolute top-5 right-5 z-20">
                    <div className="bg-white/95 backdrop-blur-md border border-orange-100 px-4 py-1.5 rounded-2xl shadow-xl flex flex-col items-end transform group-hover:scale-105 transition-transform duration-500">
                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-0.5">Starting Ticket</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-black text-[#1A1108] tracking-tighter">₹{service.single_price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex-1">
                    {/* Tagline */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                        Vedic Path
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-serif mb-2 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                      {service.title || service.puja_name}
                    </h3>

                    {/* About/Description */}
                    <p className="text-gray-800 text-[16px] leading-relaxed line-clamp-2 font-medium mb-4">
                      {service.about}
                    </p>

                    {/* Row 1: Location */}
                    <div className="flex items-center gap-3 mb-3 group/loc">
                      <div className="p-1.5 bg-orange-50 border border-orange-100 rounded-lg shrink-0">
                        <MapPin size={14} className="text-orange-600" />
                      </div>
                      <p className="text-gray-600 text-[13px] font-medium line-clamp-1">
                        {service.address}
                      </p>
                    </div>

                    {/* Row 2: Date & Time */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-1.5 bg-orange-50 border border-orange-100 rounded-lg shrink-0">
                        <Calendar size={14} className="text-orange-600" />
                      </div>
                      <div className="flex items-center gap-2 font-bold text-[13px] text-gray-700">
                        <span>
                          {new Date(service.dateOfStart).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-orange-500 mx-0.5">|</span>
                        <span className="text-gray-500 font-medium">
                          {new Date(service.dateOfStart).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="flex items-center justify-between pt-5 border-t border-orange-50 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Ritual</span>
                      <span className="text-[11px] font-bold text-green-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Booking Open
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-orange-600">
                        Book Now
                      </span>
                      <div className="w-12 h-12 rounded-2xl border border-orange-200 bg-orange-50 group-hover:bg-orange-600 flex items-center justify-center text-orange-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-orange-200 group-hover:rotate-[-45deg]">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Glow Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}