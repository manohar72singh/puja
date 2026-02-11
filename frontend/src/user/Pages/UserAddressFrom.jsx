import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Home, Briefcase, Map, PenLine } from "lucide-react";

const UserAddressForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeType, setActiveType] = useState("Home");
  const [customType, setCustomType] = useState(""); // Custom tag के लिए state
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchAddress = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/user/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setFormData({
        address_line: data.address_line,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      });

      if (data.address_type === "Home" || data.address_type === "Office") {
        setActiveType(data.address_type);
      } else {
        setActiveType("Other");
        setCustomType(data.address_type);
      }
      setIsDefault(data.is_default === 1);
    };

    fetchAddress();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    let url = "http://localhost:5000/user/add-address";
    let method = "POST";

    if (id) {
      url = `http://localhost:5000/user/update-address/${id}`;
      method = "PUT";
    }


    const finalAddressType = activeType === "Other" ? customType : activeType;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        address_type: finalAddressType,
        is_default: isDefault,
      }),
    });

    if (res.ok) {
      navigate("/savedAddresses");
    }
    setLoading(false);
  };

  // Reusable input style
  const inputClass = "w-full bg-[#FFF9F2] border border-orange-200 focus:border-orange-500 focus:bg-white rounded-2xl p-4 text-[#1A2B47] text-sm transition-all outline-none";

  return (
    <div className="min-h-screen bg-[#FFF5E9] p-6 font-sans">
      <div className="max-w-xl mx-auto">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 mb-8 text-[#1A2B47] font-semibold hover:text-orange-500 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
          <span className="text-sm">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
            {id ? "Update Address" : "Add Address"}
          </h1>
          <p className="text-[#8E97A4] text-[11px] font-bold tracking-[0.15em] uppercase">
            Delivery details for sacred rituals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white p-8 rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-orange-200">
            
            <div className="space-y-4">
              {/* Address Line */}
              <div>
                <label className="text-[11px] font-bold text-[#8E97A4] uppercase ml-1 mb-2 block tracking-wider">Full Address</label>
                <textarea
                  name="address_line"
                  required
                  value={formData.address_line1}
                  onChange={handleChange}
                  placeholder="House No, Street, Landmark..."
                  className={`${inputClass} min-h-[100px] resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#8E97A4] uppercase ml-1 mb-2 block tracking-wider">City</label>
                  <input name="city" required value={formData.city} onChange={handleChange} placeholder="City" className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8E97A4] uppercase ml-1 mb-2 block tracking-wider">State</label>
                  <input name="state" required value={formData.state} onChange={handleChange} placeholder="State" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8E97A4] uppercase ml-1 mb-2 block tracking-wider">Pincode</label>
                <input name="pincode" required maxLength={6} value={formData.pincode} onChange={handleChange} placeholder="6-digit Pincode" className={inputClass} />
              </div>

              {/* Address Type Selector */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-[#8E97A4] uppercase ml-1 mb-3 block tracking-wider">Tag this location</label>
                <div className="flex gap-3 mb-4">
                  {[
                    { label: "Home", icon: <Home size={16} /> },
                    { label: "Office", icon: <Briefcase size={16} /> },
                    { label: "Other", icon: <Map size={16} /> }
                  ].map((type) => (
                    <button
                      type="button"
                      key={type.label}
                      onClick={() => setActiveType(type.label)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-bold transition-all border-2 ${
                        activeType === type.label
                          ? "bg-[#1A2B47] border-[#1A2B47] text-white shadow-lg shadow-orange-200"
                          : "bg-white border-orange-100 text-[#8E97A4] hover:bg-orange-50"
                      }`}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Conditional Input for "Other" */}
                {activeType === "Other" && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        placeholder="e.g. Temple, Friend's House"
                        className={`${inputClass} pl-11`}
                      />
                      <PenLine size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center gap-3 ml-1">
                <input
                  type="checkbox"
                  id="default-check"
                  checked={isDefault}
                  onChange={() => setIsDefault(!isDefault)}
                  className="w-5 h-5 accent-[#FF822D] rounded-md cursor-pointer border-orange-200"
                />
                <label htmlFor="default-check" className="text-sm font-bold text-[#1A2B47] cursor-pointer select-none">
                  Set as default delivery address
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF822D] hover:bg-[#E66F1C] text-white py-4 rounded-2xl flex justify-center items-center gap-2 font-bold text-lg shadow-[0_8px_25px_-5px_rgba(255,130,45,0.4)] transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Saving..." : id ? "Update Address" : "Save Address"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-[#8E97A4] font-bold text-[10px] tracking-[0.15em] uppercase">
          <ShieldCheck size={14} className="text-[#10B981]" />
          100% Secure & Private
        </div>
      </div>
    </div>
  );
};

export default UserAddressForm;