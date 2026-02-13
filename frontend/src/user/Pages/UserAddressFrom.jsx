import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin } from "lucide-react";

const UserAddressForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    address_type: "Home",
    is_default: false
  });

  useEffect(() => {
    if (id) {
      const fetchSingle = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/user/address/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setFormData({ ...data, is_default: data.is_default === 1 });
      };
      fetchSingle();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = id ? `http://localhost:5000/user/update-address/${id}` : `http://localhost:5000/user/add-address`;
    
    const res = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData)
    });

    if (res.ok) navigate("/savedAddresses");
    else alert("Error saving address");
    setLoading(false);
  };

  const inputClass = "w-full bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm outline-none focus:border-orange-500 transition-all";

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-6">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 mb-8 font-bold"><ChevronLeft size={20} /> Back</button>
        
        <h1 className="text-3xl font-bold mb-6">{id ? "Edit Address" : "Add New Address"}</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm space-y-5">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Full Address</label>
            <textarea 
              required
              className={`${inputClass} h-24`} 
              value={formData.address_line1} 
              onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input placeholder="City" required className={inputClass} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            <input placeholder="State" required className={inputClass} value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
          </div>

          <input placeholder="Pincode" required maxLength={6} className={inputClass} value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />

          <div className="flex gap-4">
            {["Home", "Office", "Other"].map(t => (
              <button 
                key={t} type="button"
                onClick={() => setFormData({...formData, address_type: t})}
                className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 ${formData.address_type === t ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-orange-50 text-gray-400"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.is_default} onChange={(e) => setFormData({...formData, is_default: e.target.checked})} className="w-5 h-5 accent-orange-500" />
            <span className="text-sm font-bold text-gray-700">Set as default address</span>
          </label>

          <button disabled={loading} className="w-full bg-[#FF822D] text-white py-4 rounded-xl font-bold shadow-lg mt-4">
            {loading ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAddressForm;