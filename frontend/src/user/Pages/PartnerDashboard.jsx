import React, { useState, useEffect } from "react";
import {
  CheckCircle, XCircle, Clock, MapPin, Phone, User,
  Calendar, Bell, LogOut, Headphones, Power
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [newRequests, setNewRequests] = useState([]);
  const [mySchedule, setMySchedule] = useState([]);
  const [earnings, setEarnings] = useState(0); // Optional field for tab
  const [loading, setLoading] = useState(true);
  const [dutyOn, setDutyOn] = useState(true);

  const API_BASE_URL = "http://localhost:5000/partner";
  const token = localStorage.getItem("token");

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token"); // Token delete karein
    navigate("/partnerSignIn"); // Login page par bhejein
    // Agar aap page refresh karna chahte hain toh: window.location.reload();
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    // Agar token hi nahi hai, toh seedha login pe bhejo
    if (!token) {
      handleLogout();
      return;
    }

    try {
      // 1. Fetch Available Pujas
      console.log("bookoing income ")
      const res1 = await fetch(`${API_BASE_URL}/available-pujas`, {
        headers: { Authorization: `Bearer ${token}` }
      });



      // Agar status 401 hai, matlab token expire ya invalid hai
      if (res1.status === 401) {
        handleLogout();
        return;
      }
      console.log("bookoing income2 ")

      const data1 = await res1.json();
      setNewRequests(data1.bookings || []);
      console.log("all::",data1);
      


      // 2. Fetch My Accepted Pujas
      const res2 = await fetch(`${API_BASE_URL}/my-accepted-pujas`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      console.log("bookoing income3 ")

      if (res2.status === 401) {
        handleLogout();
        return;
      }

      const data2 = await res2.json();
      setMySchedule(data2.bookings || []);

      console.log("emepty array",data2)

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (bookingId, action) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId, action })
      });
      const data = await response.json();
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      alert("Action failed!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E1] font-sans">
      {/* --- ORANGE HEADER SECTION --- */}
      <header className="bg-[#FF8A3D] p-[20.2px] text-white shadow-md"> {/* Increased to ~20px */}
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-[15.2px]"> {/* Increased gap */}
            {/* Container increased to ~51px */}
            <div className="w-[51px] h-[51px] bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <User size={31} /> {/* Increased icon size */}
            </div>

            <div>
              {/* Name heading increased to ~17.6px */}
              <p className="text-[17.6px] font-bold opacity-90 leading-tight">Namaste, Demo</p>
              {/* Sub-text increased to ~12.7px */}
              <p className="text-[12.7px] flex items-center gap-[5px] opacity-80 mt-1">
                <MapPin size={13} /> Varanasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[20.2px]">
            <Bell size={25} className="cursor-pointer hover:opacity-70 transition-opacity" />

            {/* Logout Button updated with handleLogout */}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
              title="Logout"
            >
              <LogOut size={25} />
            </button>
          </div>
        </div>

        {/* Duty Status Toggle Section */}
        <div className="max-w-7xl mx-auto mt-[20.2px] bg-black/10 p-[10.1px] px-[20.2px] rounded-xl flex justify-between items-center">
          <div>
            {/* Title increased to ~15.2px */}
            <p className="text-[15.2px] font-bold uppercase tracking-wide">Duty Status</p>
            {/* Description increased to ~12.7px */}
            <p className="text-[12.7px] opacity-80">Receiving new puja requests</p>
          </div>

          {/* Toggle width increased to ~61px, height to ~31px */}
          <div
            onClick={() => setDutyOn(!dutyOn)}
            className={`w-[61px] h-[31px] rounded-full p-[5px] cursor-pointer transition-all ${dutyOn ? 'bg-green-500 shadow-lg shadow-green-900/20' : 'bg-gray-400'}`}
          >
            {/* Knob increased to ~20.2px */}
            <div className={`w-[20.2px] h-[20.2px] bg-white rounded-full transition-all shadow-md ${dutyOn ? 'translate-x-[30.8px]' : 'translate-x-0'}`} />
          </div>
        </div>
      </header>

      {/* --- TABS SYSTEM --- */}
      <div className="bg-white shadow-sm border-b-orange-400 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex">
          {[
            { id: "new", label: "NewRequests", count: newRequests.length },
            { id: "accepted", label: "Schedule", count: mySchedule.length },
            { id: "earnings", label: "Earnings", count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? "text-orange-600" : "text-gray-400"
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                {tab.label} {tab.count > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{tab.count}</span>}
              </span>
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-lg" />}
            </button>
          ))}
        </div>
      </div>

      {/* --- DASHBOARD CONTENT --- */}
      <main className="p-4 max-w-7xl mx-auto space-y-4 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm font-bold uppercase tracking-widest text-orange-900">Fetching Details...</p>
          </div>
        ) : (
          (activeTab === "new" ? newRequests : mySchedule).map((puja) => (
            <div key={puja.id} className="bg-white border-b-4 border-orange-400 rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-4">
                {/* Puja Header & Price */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-gray-700 text-lg">{puja.puja_name}</h3>
                    <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">North Indian</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-orange-600">₹{puja.standard_price || '0'}</p>
                    <button className="text-[10px] bg-[#FFD700] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      📦 Samagri
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-3 text-gray-500">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-sm font-bold text-gray-700">{new Date(puja.preferred_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <p className="text-sm font-bold text-gray-700">{puja.preferred_time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-400" />
                    <p className="text-sm font-medium leading-tight">{puja.address}, {puja.city}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <p className="text-sm font-bold text-gray-800">{puja.user_name}</p>
                  </div>
                </div>

                {/* --- BUTTONS (Image Style) --- */}
                {activeTab === "new" && (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleAction(puja.id, 'declined')}
                      className="flex-1 py-3 px-4 border border-red-100 rounded-xl text-red-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                    >
                      <XCircle size={16} /> Decline
                    </button>
                    <button
                      onClick={() => handleAction(puja.id, 'accepted')}
                      className="flex-[2] py-3 px-4 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
                    >
                      <CheckCircle size={16} /> Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default PartnerDashboard;