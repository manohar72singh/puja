import React, { useState } from 'react';
import { Camera, ChevronLeft, User, Phone, Mail, Save, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'Blocked User',
    mobile: '9696969696',
    email: 'demo@srivedicpuja.com'
  });

  // Keep your original size but use a wrapping container for alignment
  const containerWidth = "max-w-md mx-auto"; 
  const mainCardStyle = "bg-white rounded-[1.6rem] border border-orange-200 shadow-sm p-7 w-full";
  
  const labelStyle = "text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block ml-1";
  const inputStyle = "w-full bg-orange-50/30 border border-orange-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-400 transition-all";
  const disabledInputStyle = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed";
  
  const primaryBtnStyle = "w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-md border border-orange-300 hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]";

  return (
    <div className="min-h-screen bg-[#FFF4E1] text-[#2D2D2D] font-sans antialiased">
      <main className="px-4 py-10">
        
        {/* The wrapper that keeps everything in one straight line */}
        <div className={containerWidth}>
          
          {/* Back Button - Now aligned with the card edge */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-orange-600 mb-6 transition-colors group"
          >
            <ChevronLeft className="group-hover:-translate-x-0.5 transition-transform" size={16} /> 
            <span>Back</span>
          </button>

          {/* Header - Now aligned with the card edge */}
          <div className="mb-6 px-1 text-left">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">My Profile</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Personal Details</p>
          </div>

          {/* Main Card */}
          <div className={mainCardStyle}>
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-white shadow-md flex items-center justify-center text-orange-600 text-xl font-bold">
                  BU
                </div>
                <button className="absolute bottom-0 right-0 bg-orange-500 p-1.5 rounded-full text-white border-2 border-white shadow hover:bg-orange-600 transition-colors">
                  <Camera size={12} />
                </button>
              </div>
              <p className='text-xs pt-2 text-gray-400 font-medium'>Tap to Change Photo</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-left">
              <div>
                <label className={labelStyle}>Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={inputStyle}
                  />
                  <User size={16} className="absolute right-4 top-3 text-orange-300" />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Mobile Number</label>
                <div className="relative">
                  <input type="text" value={formData.mobile} disabled className={disabledInputStyle} />
                  <Phone size={16} className="absolute right-4 top-3 text-gray-300" />
                </div>
              </div>

              <div>
                <label className={labelStyle}>Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={inputStyle}
                    placeholder="name@example.com"
                  />
                  <Mail size={16} className="absolute right-4 top-3 text-orange-300" />
                </div>
              </div>

              <div className="pt-4">
                <button className={primaryBtnStyle}>
                  <Save size={18} />
                  <span className="text-sm">Save Changes</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-2 opacity-60">
                <ShieldCheck size={12} className="text-green-600" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">Your data is secured</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSection;