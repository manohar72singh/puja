import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  MessageCircle,
  Heart,
  ChevronRight,
  Shirt,
  Flame,
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  Coffee,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const KathaPujaPaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // Required to read state from previous page

  // State for API data
  const [puja, setPuja] = useState(null);
  const [loading, setLoading] = useState(true);

  const dharmicRef = useRef(null);

  // Get Samagri status from navigation state
  const isSamagriSelected = location.state?.isSamagriSelected || false;

  const generateBookingId = () => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `BK-${randomStr}`;
  };

  const bookingId = generateBookingId(); // Unique booking ID for this transaction

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    state: "", // Naya field
    city: "", // Naya field
    pincode: "",
    devoteeName: "",
    gotra: "",
  });

  const [donations, setDonations] = useState({
    vastra: false,
    annadan: false,
    deepdan: false,
    bhoj: false,
    gau: false,
    temple: false,
  });

  const contributionOptions = [
    {
      id: "vastra",
      name: "Vastra Daan",
      price: 251,
      icon: <Shirt size={18} />,
      desc: "Donate clothes to the needy",
    },
    {
      id: "annadan",
      name: "Annadan",
      price: 501,
      icon: <Coffee size={18} />,
      desc: "Provide meals to the hungry",
    },
    {
      id: "deepdan",
      name: "Deepdan",
      price: 101,
      icon: <Flame size={18} />,
      desc: "Light lamps at sacred temples",
    },
    {
      id: "bhoj",
      name: "Brahmin Bhoj",
      price: 1100,
      icon: <UtensilsCrossed size={18} />,
      desc: "Feed Brahmins after ceremony",
    },
  ];

  const handlePayment = async () => {
    // Basic validation
    if (!formData.date || !formData.devoteeName || !formData.city) {
      alert("Please fill all mandatory fields (Date, Name, City)");
      return;
    }

    const token = localStorage.getItem("token");

    const payload = {
      puja_id: id,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      devoteeName: formData.devoteeName,
      bookingId: bookingId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/puja/bookingDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          "🙏 Jai Ho! Aapki booking swikar kar li gayi hai. Booking ID: " +
            bookingId,
        );
        navigate("/my-booking"); // Home ya My Bookings page par bhejien
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Booking submission failed:", error);
      alert("Server error. Please check if backend is running.");
    }
  };

  // Button mein onClick add karein:
  // <button onClick={handlePayment} className="..."> Pay ₹{grandTotal} </button>

  useEffect(() => {
    const bookPuja = async (id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/bookPuja/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Handling both array and object response patterns
        if (Array.isArray(data)) {
          setPuja(data[0]);
        } else {
          setPuja(data);
        }
        //fetch default address and prefill form
        const addressRes = await fetch(`${API_BASE_URL}/user/default-address`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const addressData = await addressRes.json();
        console.log("Default address response:", addressData);
        if (addressData) {
          setFormData((prev) => ({
            ...prev,
            location: addressData.address_line1 || "",
            city: addressData.city || "",
            state: addressData.state || "",
            pincode: addressData.pincode || "",
          }));
        }
      } catch (error) {
        console.error("Error booking puja:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) bookPuja(id);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDonation = (id) =>
    setDonations((prev) => ({ ...prev, [id]: !prev[id] }));

  const getDharmicTotal = () => {
    let sum = contributionOptions.reduce((acc, opt) => {
      return donations[opt.id] ? acc + opt.price : acc;
    }, 0);
    if (donations.gau) sum += 100;
    return sum;
  };

  // Calculations
  const basePrice = Number(puja?.standard_price || 0);
  const samagriPrice = isSamagriSelected ? 600 : 0;
  const dharmicTotal = getDharmicTotal();
  const templeDonation = donations.temple ? 1 : 0;
  const grandTotal = basePrice + samagriPrice + dharmicTotal + templeDonation;

  // Shared Styling
  const mainCardStyle =
    "bg-white rounded-2xl border border-orange-200 shadow-sm hover:shadow-md transition-shadow duration-200";
  const innerDivStyle = "border border-orange-200 rounded-xl p-5";
  const inputBaseClass =
    "w-full bg-gray-50 border border-orange-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:border-orange-500 transition-all font-medium text-sm";
  const labelClass =
    "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-700 mb-2 ml-1";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E1] flex items-center justify-center">
        <p className="text-orange-600 font-bold animate-pulse">
          Loading Sacred Details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4E1] font-sans text-[#2D2D2D] antialiased pb-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-orange-600 mb-8 transition-colors"
        >
          <ChevronRight className="rotate-180" size={16} />
          <span>Back to Puja</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* 1. E-SANKALP FORM */}
            <div className={`${mainCardStyle} p-8`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-orange-500 p-2 rounded-full text-white shadow-md">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">E-Sankalp</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                    Complete your sacred booking
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className={labelClass}>
                      <Calendar size={13} /> Puja Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={inputBaseClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>
                      <Clock size={13} /> Preferred Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={inputBaseClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>
                    <MapPin size={13} /> Puja Location (Full Address)
                  </label>
                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter complete address with landmarks..."
                    rows="3"
                    className={inputBaseClass}
                    required
                  />
                </div>
                {/* Location Textarea ke baad ye grid insert karein */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-1">
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Uttar Pradesh"
                      className={inputBaseClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Varanasi"
                      className={inputBaseClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength="6"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6 Digit PIN"
                      className={inputBaseClass}
                      onKeyPress={(e) =>
                        !/[0-9]/.test(e.key) && e.preventDefault()
                      } // Sirf numbers allow karne ke liye
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
                    <User size={16} className="text-orange-500" /> Sankalp
                    Details
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-4 font-medium">
                    These details will be used during the sacred Sankalp (ritual
                    pledge)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className={labelClass}>Name of Devotee *</label>
                      <input
                        type="text"
                        name="devoteeName"
                        value={formData.devoteeName}
                        onChange={handleInputChange}
                        placeholder="Full name as per tradition"
                        className={inputBaseClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Gotra (Lineage)</label>
                      <input
                        type="text"
                        name="gotra"
                        value={formData.gotra}
                        onChange={handleInputChange}
                        placeholder="e.g., Kashyap, Bharadwaj"
                        className={inputBaseClass}
                      />
                      <p className="text-[10px] text-gray-500 mt-1 ml-1 italic">
                        Optional - Ask family elders if unknown
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Help Box */}
                <div
                  className={`${innerDivStyle} bg-orange-50/20 flex flex-col md:flex-row items-center justify-between border-dashed mt-8 p-4 md:p-5 gap-4`}
                >
                  {/* Left Side: Icon & Text */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 bg-white rounded-lg border border-orange-200 shrink-0">
                      <MessageCircle size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">
                        Have custom requirements?
                      </h4>
                      <p className="text-xs text-gray-700 font-medium">
                        Chat with us for special requests
                      </p>
                    </div>
                  </div>

                  {/* Right Side: WhatsApp Button */}
                  <button className="w-full md:w-auto bg-white border border-orange-200 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-95 transition-all shadow-sm">
                    <span className="text-green-600 font-black italic">W</span>
                    <span>WhatsApp Us</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. DHARMIC CONTRIBUTIONS */}
            <div
              ref={dharmicRef}
              className={`${mainCardStyle} p-8 space-y-6 scroll-mt-28`}
            >
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <div className="bg-orange-500 p-1.5 rounded-full text-white shadow-md">
                    <Heart size={14} fill="currentColor" />
                  </div>
                  Dharmic Contributions
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">
                  Complete your Sankalp with sacred donations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contributionOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => toggleDonation(option.id)}
                    className={`p-5 flex justify-between items-center transition-all cursor-pointer rounded-xl border-2 ${donations[option.id] ? "border-orange-500 bg-orange-50/30" : "border-orange-200 hover:border-orange-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${donations[option.id] ? "bg-orange-500 border-orange-500" : "border-orange-200"}`}
                      >
                        {donations[option.id] && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="text-orange-500">{option.icon}</div>
                      <div>
                        <h4 className="font-bold text-sm">{option.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {option.desc}
                        </p>
                        <span className="text-orange-600 font-black text-sm">
                          ₹{option.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gau Seva Section */}
              <div
                onClick={() => toggleDonation("gau")}
                className={`p-5 flex justify-between items-center transition-all cursor-pointer rounded-xl border ${donations.gau ? "border-orange-500 bg-orange-50/30" : "border-orange-200 hover:border-orange-200 bg-white"}`}
              >
                <div className="flex items-center gap-4">
                  {/* Fixed: Added shrink-0 and ensured equal width/height */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${donations.gau ? "bg-orange-500 border-orange-500" : "border-orange-200"}`}
                  >
                    {donations.gau && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  <span className="text-2xl shrink-0">🐄</span>

                  <div>
                    <h4 className="font-bold text-sm text-gray-900 leading-tight">
                      Complete your Sankalp with Gau Seva
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Feed a cow on your behalf — an auspicious addition to any
                      puja
                    </p>
                    <span className="inline-block bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold mt-1">
                      +₹100
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 text-orange-600/70 font-bold text-[10px] uppercase tracking-wider">
                    <CheckCircle size={12} /> 100% Moneyback Guarantee
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-600/70 font-bold text-[10px] uppercase tracking-wider">
                    <CheckCircle size={12} /> No Hidden Charges
                  </div>
                </div>
                <div className="bg-[#F8F1E7] py-2.5 rounded-lg text-center border border-orange-200/50">
                  <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                    🙏 Fee includes Dakshina — No cash tips needed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR (SUMMARY) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8">
            <div className={`${mainCardStyle} p-8 !rounded-[1.5rem] shadow-lg`}>
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Booking Summary
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-orange-200">
                  <h4 className="text-sm font-black text-gray-900">
                    {puja?.puja_name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-gray-700">
                      Samagri Kit
                    </span>
                    <span
                      className={`text-xs font-bold ${isSamagriSelected ? "text-green-600" : "text-gray-400"}`}
                    >
                      {isSamagriSelected ? "Included ✓" : "Not Selected"}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() =>
                    dharmicRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className="cursor-pointer group flex items-center justify-between p-3 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition-all"
                >
                  <div className="flex items-center gap-2 text-orange-500 font-black uppercase text-[11px] tracking-widest">
                    <Heart
                      size={14}
                      fill="currentColor"
                      className="group-hover:scale-110 transition-transform"
                    />
                    Dharmic Total
                  </div>
                  <span className="text-orange-600 font-black text-sm">
                    ₹{dharmicTotal}
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-700 uppercase">
                    <span>Base Price</span>
                    <span className="text-gray-900 font-black">
                      ₹{basePrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-700 uppercase">
                    <span>Samagri Kit</span>
                    <span className="text-gray-900 font-black">
                      +₹{samagriPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-orange-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={donations.temple}
                        onChange={() => toggleDonation("temple")}
                        className="w-3.5 h-3.5 accent-orange-500"
                      />
                      <span className="text-[10px] font-bold text-gray-700 uppercase">
                        Temple Donation
                      </span>
                    </label>
                    <span className="text-[10px] font-black text-orange-500">
                      +₹1
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-black text-orange-600">
                      ₹{grandTotal}
                    </span>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                    onClick={handlePayment}
                  >
                    <ArrowRight size={16} /> Pay ₹{grandTotal}
                  </button>

                  <div className="bg-gray-100/50 py-2 rounded-lg text-center mt-4">
                    <p className="text-[9px] font-bold text-gray-700 uppercase tracking-tighter">
                      💰 Total Fee includes Dakshina — No tips required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default KathaPujaPaymentDetails;
