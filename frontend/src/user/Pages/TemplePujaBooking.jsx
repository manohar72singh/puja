import React, { useEffect, useState, useRef } from 'react';
import {
  MapPin, Calendar, Clock, Users, CheckCircle,
  Heart, ShieldCheck, ChevronRight, Sparkles,
  ArrowRight, Shirt, Coffee, Flame, UtensilsCrossed,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TemplePujaBooking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false); // Naya loading state saving ke liye
  const [selectedTicket, setSelectedTicket] = useState('Single');
  
  const [donations, setDonations] = useState({
    temple: false, vastra: false, annadan: false, deepdan: false, brahmin: false, gau: false
  });
  const dharmicRef = useRef(null);

  useEffect(() => {
    const bookPuja = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/bookPuja/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        setService(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) bookPuja();
  }, [id]);

  // --- NAYA FUNCTION: DATABASE MEIN SAVE KARNE KE LIYE ---
  const handleTemplePayment = async () => {
  const token = localStorage.getItem("token");
  if (!token) { alert("Please login first!"); return; }

  setIsBooking(true);

  // Donations list formatting
  const selectedDonations = Object.keys(donations)
    .filter(key => donations[key])
    .join(', ');

  const bookingData = {
    puja_id: id, // Ye aapke useParams wala id hai
    date: new Date().toISOString().split('T')[0],
    time: "Morning Slot",
    city: service?.location || "Kashi",
    state: "Uttar Pradesh",
    pincode: "221001",
    devoteeName: "Devotee User", // Aap yahan actual user name bhi bhej sakte hain
    ticket_type: selectedTicket,
    donations: selectedDonations
  };

  try {
    const response = await fetch(`${API_BASE_URL}/puja/bookingDetails`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    // Check if response is not 200/201
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server crashed");
    }

    const result = await response.json();
    if (result.success) {
      alert("🙏 Temple Booking Confirmed!");
      navigate('/my-booking');
    }
  } catch (error) {
    console.error("Booking Error:", error);
    alert("Booking failed: " + error.message);
  } finally {
    setIsBooking(false);
  }
};

  const tickets = [
    { label: "Single", price: Number(service?.single_price || 251), persons: "1 Person" },
    { label: "Couple", price: Number(service?.couple_price || 452), persons: "2 Persons" },
    { label: "Family", price: Number(service?.family_price || 628), persons: "Up to 5" }
  ];

  const dharmicItems = [
    { id: 'vastra', title: "Vastra Daan", desc: "Donate clothes to the needy", price: 251, icon: <Shirt size={18} /> },
    { id: 'annadan', title: "Annadan", desc: "Provide meals to the hungry", price: 501, icon: <Coffee size={18} /> },
    { id: 'deepdan', title: "Deepdan", desc: "Light lamps at sacred temples", price: 101, icon: <Flame size={18} /> },
    { id: 'brahmin', title: "Brahmin Bhoj", desc: "Feed Brahmins after ceremony", price: 1100, icon: <UtensilsCrossed size={18} /> },
  ];

  const calculateTotal = () => {
    let base = tickets.find(t => t.label === selectedTicket).price;
    let extra = 0;
    if (donations.vastra) extra += 251;
    if (donations.annadan) extra += 501;
    if (donations.deepdan) extra += 101;
    if (donations.brahmin) extra += 1100;
    if (donations.gau) extra += 100;
    if (donations.temple) extra += 1;
    return base + extra;
  };

  const toggleDonation = (id) => setDonations(prev => ({ ...prev, [id]: !prev[id] }));

  const mainCardStyle = "bg-white rounded-2xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow duration-200";
  const labelClass = "text-[11px] font-bold uppercase tracking-widest text-gray-700 mb-2";

  if (loading) return <div className="min-h-screen bg-[#FFF4E1] flex items-center justify-center font-bold text-orange-600">Loading Divine Details...</div>;

  return (
    <div className="min-h-screen bg-[#FFF4E1] text-[#2D2D2D] font-sans antialiased pb-20">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-orange-600 mb-8 transition-colors">
          <ChevronRight className="rotate-180" size={16} />
          <span>Back to All Pujas</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-orange-200">
              <div className="relative h-64 md:h-80 bg-gray-200">
                <img
                  src={service?.image_url ? `${API_BASE_URL}/uploads/${service.image_url}` : "https://images.unsplash.com/photo-1605640840605-14ac1855827b"}
                  className="w-full h-full object-cover"
                  alt="Puja Event"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/95 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg text-gray-700 shadow-sm">Featured Event</span>
                  <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">✨ Trending</span>
                </div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{service?.puja_name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-orange-200 text-sm font-bold">
                     <span className="flex items-center gap-1.5"><MapPin size={16} /> {service?.location || "Kashi Varanasi"}</span>
                     <span className="flex items-center gap-1.5"><Calendar size={16} /> Upcoming Ritual</span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 font-medium leading-relaxed max-w-2xl">
                  {service?.description || "Experience the divine energy of this sacred ceremony."}
                </p>
              </div>
            </div>

            <div className={`${mainCardStyle} p-8 space-y-10`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="text-orange-500" size={20} /> Benefits
                  </h3>
                  <div className="space-y-3">
                    {[{ title: "Spiritual Upliftment", desc: "Divine energy from temples", icon: <Heart size={16}/> }, { title: "Divine Protection", desc: "Blessings for family", icon: <ShieldCheck size={16}/> }].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-orange-50/30 rounded-xl border border-orange-100">
                        <div className="text-orange-600">{benefit.icon}</div>
                        <div>
                          <h4 className="font-bold text-sm">{benefit.title}</h4>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <CheckCircle className="text-orange-500" size={20} /> What's Included
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {["Live HD darshan", "Real-time sankalp", "Prasad delivery", "Personal blessings"].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 bg-gray-50 p-3 rounded-lg border border-orange-100/50">
                        <CheckCircle size={14} className="text-green-500" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div ref={dharmicRef} className={`${mainCardStyle} p-8 space-y-6 scroll-mt-28`}>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <div className="bg-orange-500 p-1.5 rounded-full text-white shadow-md"><Heart size={14} fill="currentColor" /></div>
                  Dharmic Contributions
                </h3>
                <p className={labelClass}>Complete your Sankalp with sacred donations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dharmicItems.map((item) => (
                  <div key={item.id} onClick={() => toggleDonation(item.id)} className={`p-5 flex justify-between items-center transition-all cursor-pointer rounded-xl border-2 ${donations[item.id] ? 'border-orange-500 bg-orange-50/30' : 'border-orange-200 bg-white hover:border-orange-300'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${donations[item.id] ? 'bg-orange-500 border-orange-500' : 'border-orange-200'}`}>
                        {donations[item.id] && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="text-orange-500">{item.icon}</div>
                      <div>
                        <h4 className="font-bold text-sm">{item.title}</h4>
                        <span className="text-orange-600 font-black text-sm">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div onClick={() => toggleDonation('gau')} className={`p-5 flex justify-between items-center transition-all cursor-pointer rounded-xl border-2 ${donations.gau ? 'border-orange-500 bg-orange-50/30' : 'border-orange-200 bg-white hover:border-orange-300'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${donations.gau ? 'bg-orange-500 border-orange-500' : 'border-orange-200'}`}>
                    {donations.gau && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-2xl">🐄</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 leading-tight">Complete with Gau Seva</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Feed a cow on your behalf</p>
                  </div>
                </div>
                <span className="font-black text-orange-600 text-sm">₹100</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className={`sticky top-8 p-8 ${mainCardStyle} !rounded-[1.5rem] shadow-xl`}>
              <h3 className="text-lg font-bold mb-6 text-gray-800">Booking Summary</h3>
              <p className={labelClass}>Select Ticket Type</p>
              <div className="grid grid-cols-3 gap-2 mb-8">
                {tickets.map((t) => (
                  <button key={t.label} onClick={() => setSelectedTicket(t.label)} className={`flex flex-col items-center py-4 rounded-xl transition-all border-2 ${selectedTicket === t.label ? 'border-orange-500 bg-orange-50/50 text-orange-600 shadow-sm' : 'border-orange-100 bg-gray-50/50 text-gray-400 hover:border-orange-200'}`}>
                    <Users size={16} />
                    <span className="text-[10px] font-black mt-2 uppercase tracking-tighter">{t.label}</span>
                    <span className="text-sm font-black mt-1">₹{t.price}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-orange-200">
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Base Price ({selectedTicket})</span>
                  <span className="text-gray-900 font-black">₹{tickets.find(t => t.label === selectedTicket).price}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-y border-orange-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={donations.temple} onChange={() => toggleDonation('temple')} className="w-3.5 h-3.5 accent-orange-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Temple Donation</span>
                  </label>
                  <span className="text-[10px] font-black text-orange-500">+₹1</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-orange-600 tracking-tighter">₹{calculateTotal()}</span>
                </div>

                {/* UPDATED BUTTON WITH API CALL */}
                <button 
                  onClick={handleTemplePayment}
                  disabled={isBooking}
                  className={`w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all hover:shadow-orange-200 ${isBooking ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isBooking ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <span>Pay Now & Confirm</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <p className="text-[9px] text-center font-bold text-gray-400 uppercase tracking-widest mt-4">Secure Encrypted Payment 🙏</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TemplePujaBooking;