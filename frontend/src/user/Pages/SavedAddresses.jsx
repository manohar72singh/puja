import React, { useEffect, useState } from "react";
import { ChevronLeft, MapPin, Plus, ShieldCheck, Home, Briefcase, Map, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- FETCH ADDRESSES ---
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/user/get-addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Database se aane wala data array hona chahiye
      setAddresses(data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // --- SET DEFAULT LOGIC ---
  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/user/set-default/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        // UI ko turant refresh karne ke liye dobara fetch karein
        await fetchAddresses();
      } else {
        alert("Failed to update default address");
      }
    } catch (error) {
      console.error("Set default error:", error);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/user/delete-address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setAddresses(addresses.filter((addr) => addr.id !== id));
      } else {
        alert("Failed to delete address.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const getAddressIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === "home") return <Home size={18} />;
    if (t === "office" || t === "work") return <Briefcase size={18} />;
    return <Map size={18} />;
  };

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-6">
      <div className="max-w-xl mx-auto">
        
        {/* Top Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 mb-8 text-[#1A2B47] font-semibold hover:text-orange-500 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
          <span className="text-sm">Back</span>
        </button>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
            Saved Address
          </h1>
          <p className="text-[#8E97A4] text-[11px] font-bold tracking-[0.15em] uppercase">
            Delivery details for sacred rituals
          </p>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="py-20 text-center text-[#1A2B47]/50 animate-pulse font-medium">
            Fetching your sacred spaces...
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-[32px] py-16 px-8 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] mb-8 border border-orange-200">
            <div className="w-20 h-20 bg-[#FFF9F2] rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} className="text-[#FFB380] opacity-60" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A2B47] mb-3">No addresses yet</h2>
            <p className="text-[#6B7280] text-[15px] leading-relaxed max-w-[260px] mx-auto">
              Add your delivery address once and reuse them for all your future puja bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`bg-white p-6 rounded-[24px] shadow-sm border transition-all group relative ${
                  addr.is_default ? "border-orange-400 ring-1 ring-orange-100" : "border-orange-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#FFF9F2] text-[#FF822D] rounded-xl">
                      {getAddressIcon(addr.address_type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1A2B47] capitalize leading-none mb-1.5">
                        {addr.address_type}
                      </h3>
                      {/* Check for both Boolean or 1/0 */}
                      {(addr.is_default === 1 || addr.is_default === true) && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                          Default Location
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/savedAddresses/edit/${addr.id}`)}
                      className="text-xs font-bold text-[#8E97A4] hover:text-[#FF822D] uppercase tracking-tighter"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 text-[#8E97A4] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* --- FIX: address_line ko address_line1 kiya gaya --- */}
                <div className="mt-5 text-[#4B5563] text-sm leading-relaxed">
                  <p className="font-medium text-[#1A2B47]">{addr.address_line1}</p>
                  {addr.address_line2 && <p className="opacity-70">{addr.address_line2}</p>}
                  <p className="opacity-70">{addr.city}, {addr.state} - {addr.pincode}</p>
                </div>

                {/* --- FIX: is_default condition match --- */}
                {!(addr.is_default === 1 || addr.is_default === true) && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="mt-4 text-[11px] font-bold text-[#FF822D] border border-[#FF822D]/20 px-3 py-1 rounded-full hover:bg-[#FF822D] hover:text-white transition-all"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => navigate("/savedAddresses/add")}
          className="w-full bg-[#FF822D] hover:bg-[#E66F1C] text-white py-4 rounded-[18px] flex justify-center items-center gap-2 font-bold text-lg shadow-[0_8px_25px_-5px_rgba(255,130,45,0.4)] transition-all active:scale-95"
        >
          <Plus size={22} strokeWidth={3} />
          Add Address
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-[#8E97A4] font-bold text-[10px] tracking-[0.15em] uppercase">
          <ShieldCheck size={14} className="text-[#10B981]" />
          100% Secure & Private
        </div>
      </div>
    </div>
  );
};

export default SavedAddresses;