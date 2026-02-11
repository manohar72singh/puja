import React, { useState, useEffect } from "react";
import {
  Bell,
  LogOut,
  Check,
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  IndianRupee,
  Package,
  PhoneCall,
  ArrowLeft,
  ChevronRight,
  Wallet,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import axios from "axios";
const token = localStorage.getItem("token");

const Pind_Dan = () => {
  const [dutyOn, setDutyOn] = useState(true);
  const [activeTab, setActiveTab] = useState("new");
  const [greeting, setGreeting] = useState("Namaste");
  const [bookingDetails, setBookingDetails] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Suprabhat");
    else if (hour < 17) setGreeting("Namaste");
    else setGreeting("Shubh Sandhya");

    const fetchbookingDetails = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/user/booking/partnerBookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        console.log("Booking details:", data.bookings);
        setBookingDetails(data.bookings || []);
      } catch (error) {
        console.error("Failed to load booking details", error);
      }
    };
    fetchbookingDetails();
  }, []);
  console.log("Current booking details:", bookingDetails.length);

  //upadte booking status
  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/user/booking/updateBooking/${bookingId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // update UI instantly
      setBookingDetails((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update booking");
    }
  };

  // date and time formatting functions

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const pendingBookings = bookingDetails.filter((b) => b.status === "pending");

  return (
    <div className="min-h-screen bg-[#FFF4E1] font-sans pb-24 text-[#2D1B0B]">
      {/* 1. TOP NAVIGATION / PROFILE */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4 md:px-12 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <User className="text-orange-600" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-orange-500 animate-pulse" />
            </div>
            <div>
              <p className="text-orange-100 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                {greeting === "Suprabhat" ? (
                  <Sun size={12} />
                ) : (
                  <Moon size={12} />
                )}{" "}
                {greeting}
              </p>
              <h1 className="text-white font-serif text-2xl font-bold tracking-tight">
                Acharya Demo
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all">
              <Bell size={24} />
            </button>
            <button className="p-3 bg-white/10 hover:bg-red-500 rounded-2xl text-white transition-all">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* 2. DUTY CONTROL CENTER */}
        <div className="mt-6 bg-white border border-orange-200 rounded-[30px] p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl ${dutyOn ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}
            >
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none mb-1">
                Duty Status
              </h2>
              <p className="text-xs text-[#8C7A6B] font-medium">
                {dutyOn
                  ? "Showing your profile to devotees"
                  : "Profiles is currently hidden"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDutyOn(!dutyOn)}
            className={`relative w-16 h-8 rounded-full transition-colors duration-500 ${dutyOn ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div
              className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-lg transform transition-transform duration-300 ${dutyOn ? "translate-x-8" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* 3. FLOATING STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-orange-50 border border-orange-300 p-4 rounded-[24px]">
            <p className="text-[10px] font-black uppercase text-orange-400 tracking-tighter">
              Today's Earnings
            </p>
            <h3 className="text-xl font-serif font-bold text-orange-600">
              ₹4,500
            </h3>
          </div>
          <div className="bg-blue-50 border border-blue-300 p-4 rounded-[24px]">
            <p className="text-[10px] font-black uppercase text-blue-400 tracking-tighter">
              Active Pujas
            </p>
            <h3 className="text-xl font-serif font-bold text-blue-800">03</h3>
          </div>
        </div>

        {/* 4. MAIN ACTION TABS */}
        <div className="mt-8 flex gap-2 border-b border-orange-200 pb-1">
          {["new", "schedule", "earnings"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-3 rounded-t-2xl text-sm font-bold capitalize transition-all ${
                activeTab === t
                  ? "bg-white border-x border-t border-orange-200 text-orange-600 -mb-[2px]"
                  : "text-gray-400 hover:text-orange-400"
              }`}
            >
              {/* {t === "new" ? `Pending (${bookingDetails.length})` : t} */}
              {t === "new" ? `Pending (${pendingBookings.length})` : t}
            </button>
          ))}
        </div>

        {/* 5. REQUEST CARDS */}
        <div className="mt-6 space-y-6">
          {(activeTab === "new" ? pendingBookings : bookingDetails).map(
            (req) => {
              const isDecided = req.status !== "pending";
              return (
                <div
                  key={req.id}
                  className="group bg-white rounded-[35px] border border-orange-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-500 overflow-hidden"
                >
                  <div className="p-6 md:p-10">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      {/* Left Side: Info */}
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="bg-orange-600 text-white p-2 rounded-xl">
                            <Sparkles size={16} />
                          </span>
                          <h3 className="text-2xl font-serif font-bold">
                            {req.puja_name}
                          </h3>
                          {/* <span className="text-[10px] font-black px-2 py-1 bg-orange-100 text-orange-700 rounded-md">
                        {req.status}
                      </span> */}
                          <span
                            className={`text-[10px] font-black px-2 py-1 rounded-md
    ${
      req.status === "accepted"
        ? "bg-green-100 text-green-700"
        : req.status === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-orange-100 text-orange-700"
    }
  `}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                          <div className="flex items-center gap-3 text-sm font-medium text-[#8C7A6B]">
                            <Calendar size={18} className="text-orange-400" />{" "}
                            {formatDate(req.puja_date)}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium text-[#8C7A6B]">
                            <Clock size={18} className="text-orange-400" />{" "}
                            {formatTime(req.puja_time)}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium text-[#8C7A6B]">
                            <MapPin size={18} className="text-orange-400" />{" "}
                            {req.address || "Address not available"}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium text-[#8C7A6B]">
                            <User size={18} className="text-orange-400" />{" "}
                            {req.user_name}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Pricing & Samagri */}
                      <div className="md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            Dakshina
                          </p>
                          <h4 className="text-3xl font-serif font-bold text-orange-700 flex items-center justify-end">
                            <IndianRupee size={24} strokeWidth={3} />
                            {req.price}
                          </h4>
                        </div>
                        {req.hasSamagri && (
                          <div className="flex items-center gap-2 bg-yellow-400 text-yellow-700 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest shadow-sm">
                            <Package size={14} /> SAMAGRI INCLUDED
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      {/* <button
                    onClick={() => updateStatus(req.id, "rejected")}
                    className="flex-1 py-4 px-6 border-2 border-gray-100 rounded-2xl text-gray-500 font-bold hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={20} /> Decline Request
                  </button> */}
                      <button
                        disabled={isDecided}
                        onClick={() => updateStatus(req.id, "rejected")}
                        className={`flex-1 py-4 px-6 border-2 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
    ${
      isDecided
        ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400"
        : "border-gray-100 text-gray-500 hover:bg-red-50 hover:border-red-100 hover:text-red-500"
    }
  `}
                      >
                        <X size={20} /> Decline Request
                      </button>

                      {/* <button
                    onClick={() => updateStatus(req.id, "accepted")}
                    className="flex-[2] py-4 px-6 bg-orange-400 text-white rounded-2xl font-bold shadow-xl hover:bg-orange-600 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Check size={20} className="text-green-400" /> Accept &
                    Start Preparation
                  </button> */}
                      <button
                        disabled={isDecided}
                        onClick={() => updateStatus(req.id, "accepted")}
                        className={`flex-[2] py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform
    ${
      isDecided
        ? "opacity-50 cursor-not-allowed bg-gray-300 text-white"
        : "bg-orange-400 text-white shadow-xl hover:bg-orange-600 hover:-translate-y-1"
    }
  `}
                      >
                        <Check size={20} className="text-green-400" />
                        Accept & Start Preparation
                      </button>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default Pind_Dan;
