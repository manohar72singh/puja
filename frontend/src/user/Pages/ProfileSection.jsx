import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, User, Phone, Mail, CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProfileSection = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData({
          name: decoded.name || "User",
          email: decoded.email || "",
          mobile: decoded.mobile || "9696969696" 
        });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    /* Changed 'inset-0' to specific top margin to accommodate Navbar */
    /* Added z-40 to ensure it stays above common page elements but below modals */
    <div className="h-screen w-full bg-[#fff8ec] fixed top-0 left-0 right-0 flex items-center justify-center p-4 overflow-hidden font-sans z-40">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-5%] right-[-5%] w-[450px] h-[450px] bg-orange-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] bg-amber-200/30 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] relative z-10 flex flex-col mt-12 sm:mt-16">
        
        {/* Back Button - Increased margin-top to push it away from Navbar */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[#2D1B0B] hover:text-orange-700 mb-4 transition-all font-black text-xs tracking-[2px] uppercase w-fit"
        >
          <div className="bg-white p-2.5 rounded-full shadow-md group-hover:shadow-lg transition-all border border-orange-50">
            <ArrowLeft size={20} />
          </div>
          <span className="drop-shadow-sm">Back to Home</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-[45px] shadow-[0_40px_80px_rgba(45,27,11,0.18)] border border-orange-100/50 overflow-hidden flex flex-col">
          
          {/* Header Banner */}
          <div className="h-24 bg-orange-400 shrink-0 relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]"></div>
          </div>

          <div className="px-10 pb-8 -mt-14 flex flex-col items-center">
            {/* Avatar */}
            <div className="relative w-28 h-28 mb-4 shrink-0">
              <div className="w-full h-full bg-white rounded-full p-1.5 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-orange-200 via-amber-500 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl font-serif font-black border-2 border-white">
                  {userData.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
            </div>

            {/* Profile Title */}
            <div className="text-center mb-5 shrink-0">
              <h1 className="text-2xl font-serif font-black text-[#2D1B0B] tracking-tight leading-tight">{userData.name}</h1>
              <div className="flex items-center justify-center gap-2 text-orange-700 bg-orange-50 px-5 py-1.5 rounded-full mt-2 border-2 border-orange-100">
                <CheckCircle2 size={14} className="fill-orange-700 text-white" />
                <span className="text-[10px] font-black uppercase tracking-[2px]">Verified Devotee</span>
              </div>
            </div>

            {/* Form Fields - Adjusted for No-Scroll with Navbar */}
            <div className="w-full space-y-3.5">
              <div className="text-left group">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#2D1B0B]/60 uppercase tracking-[2px] mb-1.5 ml-1">
                  <User size={14} className="text-orange-500" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="w-full px-6 py-3 bg-[#fdfaf5] border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-[#2D1B0B] text-base shadow-sm" 
                />
              </div>

              <div className="text-left group">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#2D1B0B]/60 uppercase tracking-[2px] mb-1.5 ml-1">
                  <Mail size={14} className="text-orange-500" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full px-6 py-3 bg-[#fdfaf5] border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-[#2D1B0B] text-base shadow-sm" 
                />
              </div>

              <div className="text-left">
                <label className="flex items-center gap-2 text-[10px] font-black text-[#2D1B0B]/40 uppercase tracking-[2px] mb-1.5 ml-1">
                  <Phone size={14} className="text-orange-300" /> Mobile Number
                </label>
                <div className="relative flex items-center">
                  <input 
                    type="text" 
                    value={userData.mobile} 
                    readOnly 
                    className="w-full px-6 py-3 bg-gray-50/80 border-2 border-gray-100 rounded-2xl text-gray-400 font-bold text-base cursor-not-allowed" 
                  />
                  <Lock size={14} className="absolute right-6 text-gray-300" />
                </div>
              </div>

              {/* Update Button */}
             <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black text-sm tracking-[3px] uppercase rounded-[24px] shadow-[0_10px_25px_rgba(217,119,6,0.3)] hover:brightness-110 hover:shadow-[0_15px_30px_rgba(217,119,6,0.4)] transition-all active:scale-[0.97]">
  Update Profile
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;