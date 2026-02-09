import React, { useState } from "react";
import { ChevronLeft, ShieldCheck, User, Users, Heart, Calendar, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddFamilyMemberForm = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    gotra: "",
    dob: "",
    rashi: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5000/user/add-member",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify(formData)
    })

    if(res.ok){
      navigate('/manageSankalp')
    }
    
  };

  const inputClass = "w-full bg-[#FFF9F2] border border-orange-200 focus:border-orange-500 focus:bg-white rounded-2xl p-4 text-[#1A2B47] text-sm transition-all outline-none";
  const labelClass = "text-[11px] font-bold text-[#8E97A4] uppercase ml-1 mb-2 block tracking-wider";

  return (
    <div className="min-h-screen bg-[#FFF5E9] p-6 font-sans">
      <div className="max-w-xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={()=>navigate(-1)}
          className="flex items-center gap-1 mb-8 text-[#1A2B47] font-semibold hover:text-orange-500 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
          <span className="text-sm">Back</span>
        </button>

        {/* Page Header - Address Form Style */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
            Add Family Member
          </h1>
          <p className="text-[#8E97A4] text-[11px] font-bold tracking-[0.15em] uppercase">
            Personal details for ritual accuracy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Card */}
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-orange-200">
            
            <div className="space-y-5">
              
              {/* Relation Dropdown */}
              <div>
                <label className={labelClass}>Relation *</label>
                <div className="relative">
                  <select
                    name="relation"
                    required
                    value={formData.relation}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="">Select relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Self">Self</option>
                  </select>
                  <Users size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                  <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className={labelClass}>Date of Birth</label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                </div>
              </div>

              {/* Rashi & Gotra Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Rashi (Zodiac)</label>
                  <div className="relative">
                    <select
                      name="rashi"
                      value={formData.rashi}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="">Select rashi</option>
                      <option value="Mesh">Mesh</option>
                      <option value="Vrish">Vrish</option>
                      <option value="Mithun">Mithun</option>
                      <option value="Karka">Karka</option>
                      <option value="Simha">Simha</option>
                      <option value="Kanya">Kanya</option>
                      <option value="Tula">Tula</option>
                      <option value="Vrishchik">Vrishchik</option>
                      <option value="Dhanu">Dhanu</option>
                      <option value="Makar">Makar</option>
                      <option value="Kumbh">Kumbh</option>
                      <option value="Meen">Meen</option>
                    </select>
                    <Moon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Gotra (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="gotra"
                      value={formData.gotra}
                      onChange={handleChange}
                      placeholder="e.g. Bhardwaj"
                      className={inputClass}
                    />
                    <Heart size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Submit Button - Address Form Style */}
          <button
            type="submit"
            className="w-full bg-[#FF822D] hover:bg-[#E66F1C] text-white py-4 rounded-2xl flex justify-center items-center gap-2 font-bold text-lg shadow-[0_8px_25px_-5px_rgba(255,130,45,0.4)] transition-all active:scale-95"
          >
            Save Member
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[#8E97A4] font-bold text-[10px] tracking-[0.15em] uppercase">
          <ShieldCheck size={14} className="text-[#10B981]" />
          100% Secure & Private
        </div>
      </div>
    </div>
  );
};

export default AddFamilyMemberForm;