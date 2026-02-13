import React, { useEffect, useState } from "react";
import { ChevronLeft, MapPin, Plus, ShieldCheck, Home, Briefcase, Map, Trash2, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/user/get-addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/user/set-default/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAddresses();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/user/delete-address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAddresses(addresses.filter(a => a.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-6">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 mb-8 text-[#1A2B47] font-bold">
          <ChevronLeft size={20} /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
        <p className="text-[#8E97A4] text-[10px] uppercase tracking-widest mb-10">Manage your delivery locations</p>

        {loading ? <div className="text-center py-10">Loading...</div> : (
          <div className="space-y-4 mb-8">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-white p-6 rounded-[24px] border ${addr.is_default ? "border-orange-500 shadow-md" : "border-orange-100"}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Home size={18} /></div>
                    <div>
                      <h3 className="font-bold text-[#1A2B47] capitalize">{addr.address_type}</h3>
                      {addr.is_default === 1 && <span className="text-[10px] text-emerald-600 font-bold uppercase">Default</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/savedAddresses/edit/${addr.id}`)} className="p-2 text-gray-400 hover:text-blue-500"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-800">{addr.address_line1}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                </div>
                {!addr.is_default && (
                  <button onClick={() => handleSetDefault(addr.id)} className="mt-4 text-xs font-bold text-orange-500 underline">Set as Default</button>
                )}
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate("/savedAddresses/add")} className="w-full bg-[#FF822D] text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-lg hover:bg-orange-600 transition-all">
          <Plus size={22} /> Add New Address
        </button>
      </div>
    </div>
  );
};

export default SavedAddresses;