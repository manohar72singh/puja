import React, { useState, useEffect } from "react";
import { User, LogOut, Settings, Calendar, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Logout Logic
  const handleLogout = () => {
    localStorage.removeItem("token"); // Aapka token key
    navigate("/partnerSignIn");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER / NAVBAR */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-orange-600 text-white p-2 rounded-lg font-bold">P</div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Partner Portal</h1>
        </div>

        {/* PROFILE ICON & DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center border-2 border-orange-200">
              <User size={20} />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => navigate("/partnerProfile")}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2"
              >
                <Settings size={16} /> Edit Profile
              </button>
              <hr className="my-1 border-gray-100" />
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-6 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Assigned Bookings</h2>
          <p className="text-gray-500 text-sm">Manage your puja requests and schedules</p>
        </div>

        {/* BOOKINGS LIST */}
        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 font-medium">No bookings assigned yet.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 bg-orange-100 text-orange-600 rounded">
                      {booking.puja_type.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-lg">{booking.puja_name}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Calendar size={14}/> {booking.puja_date}</div>
                    <div className="flex items-center gap-2"><MapPin size={14}/> {booking.city}</div>
                    <div className="flex items-center gap-2 font-medium text-gray-900"><User size={14}/> {booking.user_name}</div>
                    <div className="flex items-center gap-2"><Phone size={14}/> {booking.user_phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50">Details</button>
                  <button className="px-5 py-2 rounded-xl text-sm font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-100">Accept</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default PartnerDashboard;