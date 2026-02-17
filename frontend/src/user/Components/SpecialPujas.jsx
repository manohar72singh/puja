import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function SpecialPujas() {
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
    <div className="min-h-screen bg-[#FFF4E1] text-[#2D1B08] pt-20 selection:bg-orange-100">
      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-20">
        {/* TOP HEADER - CENTERED */}
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-4xl font-serif font-bold text-[#3b2a1a] mb-4">
            Upcoming Group Pujas
          </h2>

          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mx-auto opacity-90">
            Join thousands of devotees in collective worship — book your ticket and<br className="hidden md:block" />
            receive blessings from anywhere
          </p>
        </div>

        {/* SERVICES GRID - CARDS LEFT-ALIGNED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-start">
          {services
            .filter(service =>
              service.puja_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .slice(0, 3)
            .map((service) => (
              <div
                key={service.service_id}
                onClick={() => navigate(`/temple-puja/${service.service_id}`)}
                className="group relative cursor-pointer bg-white rounded-[20px] overflow-hidden border border-orange-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_-15px_rgba(251,146,60,0.25)] hover:-translate-y-3 transition-all duration-500 ease-out flex flex-col active:scale-[0.98] w-full max-w-sm"
              >
                {/* IMAGE */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/uploads/${service.image_url}`}
                    alt={service.puja_name}
                    className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1108]/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* PRICE BADGE */}
                  <div className="absolute top-5 left-5 z-20">
                    <div className="bg-white/95 backdrop-blur-md border border-orange-100 px-4 py-1.5 rounded-2xl shadow-xl flex flex-col items-start transform group-hover:scale-105 transition-transform duration-500">
                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-0.5">
                        Starting Ticket
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-black text-[#1A1108] tracking-tighter">
                          ₹{service.single_price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8 flex flex-col flex-1 text-left">
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

                    {/* About */}
                    <p className="text-gray-800 text-[16px] leading-relaxed line-clamp-2 font-medium mb-4">
                      {service.about}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-1.5 bg-orange-50 border border-orange-100 rounded-lg shrink-0">
                        <MapPin size={14} className="text-orange-600" />
                      </div>
                      <p className="text-gray-600 text-[13px] font-medium line-clamp-1">
                        {service.address}
                      </p>
                    </div>

                    {/* Date & Time */}
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
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                        Ritual
                      </span>
                      <span className="text-[11px] font-bold text-green-600 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Booking Open
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-orange-600">
                        Enroll Now
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


        <div className="flex pt-10 justify-center">
          <button
            onClick={() => navigate('/all-events')}
            className="group relative flex items-center gap-3 bg-orange-400 text-white px-10 py-4 rounded-2xl font-bold  tracking-widest text-[12px] shadow-[0_20px_40px_-10px_rgba(234,88,12,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(234,88,12,0.5)] hover:-translate-y-1 transition-all duration-300 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">View All Group Pujas</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>


      </section>
    </div>
  );
}
