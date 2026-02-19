import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, User, Phone, LogOut, Flower2, ChevronRight } from 'lucide-react';

const PartnerDashboard = () => {
  const [pujas, setPujas] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyPujas();
    fetchProfile();
  }, []);

  const fetchMyPujas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/partner/my-pujas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPujas(res.data.bookings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/partner/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setProfile(res.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/partnerSignIn");
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 font-sans pb-10">
      
      {/* 🟠 Saffron Navbar */}
      <nav className="bg-[#1c1917] border-b border-orange-900/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-600/30">
              <Flower2 className="text-white" size={24} />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">
              Pandit<span className="text-orange-500">Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            {profile && (
              <div className="text-right hidden sm:block">
                <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">Aacharya</p>
                <p className="text-sm font-bold text-white leading-tight">{profile.name}</p>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-600/10 text-stone-500 hover:text-red-500 rounded-full transition-all"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* 🟠 Body Content */}
      <main className="max-w-5xl mx-auto px-4 mt-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Upcoming Services</h2>
            <p className="text-stone-500 text-sm mt-1">Today's assigned spiritual duties</p>
          </div>
          <div className="bg-orange-600/10 border border-orange-600/20 px-4 py-2 rounded-full">
            <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Total: {pujas.length} Assignments</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center">
             <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Pujas Loading...</p>
          </div>
        ) : pujas.length === 0 ? (
          <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-20 text-center">
            <p className="text-stone-600 font-bold uppercase tracking-widest">Shubh Din! No Pujas Assigned Yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pujas.map((puja) => (
              <div 
                key={puja.id}
                className="bg-[#1c1917] border border-stone-800 hover:border-orange-600/40 rounded-2xl overflow-hidden transition-all group flex flex-col md:flex-row"
              >
                {/* Left Side: Service Info */}
                <div className="p-6 md:w-1/3 bg-stone-900/50 flex flex-col justify-center border-b md:border-b-0 md:border-r border-stone-800">
                  <div className="bg-orange-600 w-10 h-1 text-[10px] mb-3 rounded-full"></div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
                    {puja.puja_name}
                  </h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-stone-400 text-sm">
                      <Calendar size={14} className="text-orange-600" />
                      {new Date(puja.preferred_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long' })}
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-sm">
                      <Clock size={14} className="text-orange-600" />
                      {puja.preferred_time || "Morning"}
                    </div>
                  </div>
                </div>

                {/* Middle: Location & Customer */}
                <div className="p-6 flex-1 flex flex-col justify-center gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-orange-600 mt-1 shrink-0" size={18} />
                    <p className="text-stone-300 text-sm leading-relaxed">
                      {puja.address}, {puja.city}, <span className="text-orange-500/80 font-bold uppercase text-[10px]">{puja.state}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                    <div className="h-8 w-8 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-500 font-bold text-xs uppercase">
                      {puja.customer_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-500 font-bold uppercase tracking-tighter">Customer Name</p>
                      <p className="text-sm font-bold text-stone-200">{puja.customer_name}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action */}
                <div className="p-6 md:w-48 flex items-center justify-center bg-stone-900/30">
                  <a 
                    href={`tel:${puja.customer_phone}`}
                    className="flex items-center justify-center gap-3 w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all active:scale-95"
                  >
                    <Phone size={18} />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="mt-20 text-center opacity-20 text-[10px] font-bold uppercase tracking-[0.5em]">
        Devotional Service Excellence
      </div>
    </div>
  );
};

export default PartnerDashboard;