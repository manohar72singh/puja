import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Bell,
  LogOut,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PartnerDashboard = () => {
  const [pujas, setPujas] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [isOnline, setIsOnline] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) {
      navigate("/partnerSignIn");
      return;
    }
    fetchMyPujas();
    fetchProfile();
  }, []);

  const fetchMyPujas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/partner/my-pujas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPujas(res.data.bookings);
    } catch (error) {
      console.error(error);
    }
  };


  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/partner/update-profile`,
        profile, // profile object me address bhi included hai
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
      alert("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
    }
  };


  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/partner/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setProfile(res.data.user);
    } catch (error) {
      console.error(error);
    }
  };



  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(new Date(date));
  };

  const totalEarnings = pujas.reduce(
    (sum, p) => sum + (Number(p.price) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FFF4E1] font-sans pb-24">

      {/* 🔶 HEADER */}
      <div className="bg-orange-400 px-4 pt-4 pb-6 shadow-lg text-white">
        <div className="flex justify-between items-center">

          {/* Left: Profile Icon + Name */}
          <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
            <button
              onClick={() => setShowProfile(true)}
              className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 bg-white/20 backdrop-blur-md 
                   border border-white/30 rounded-xl flex items-center justify-center 
                   hover:bg-white/30 transition"
            >
              <User size={18} className="sm:!w-5 sm:!h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-semibold leading-tight truncate">
                Namaste, {profile?.name || "Partner"}
              </h1>
              <p className="text-xs sm:text-sm opacity-90 truncate">
                📍 {profile?.city || "India"}
              </p>
            </div>
          </div>

          {/* Right: Notifications + Logout */}
          <div className="flex items-center gap-3 sm:gap-4 ml-2">
            <Bell size={18} />
            <LogOut
              size={18}
              className="cursor-pointer"
              onClick={() => {
                localStorage.clear();
                navigate("/partnerSignIn");
              }}
            />
          </div>
        </div>

        {/* Duty Toggle */}
        <div className="mt-4 sm:mt-6 bg-white/20 backdrop-blur-md 
                  border border-white/30 rounded-2xl p-2 flex justify-between items-center">
          <div>
            <p className="font-semibold text-white text-sm sm:text-base">
              Duty Status
            </p>
            <p className="text-xs sm:text-sm text-white/90">
              {isOnline
                ? "Receiving new puja requests"
                : "Currently not receiving requests"}
            </p>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300
        ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full shadow-md 
          transition-all duration-300 ${isOnline ? "translate-x-6 sm:translate-x-7" : ""}`}
            ></span>
          </button>
        </div>
      </div>



      {/* 🔘 Tabs */}
      <div className="px-4 sm:px-6 mt-6">
        <div className="bg-[#E6E0D4] rounded-2xl p-2 flex justify-around">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-semibold ${activeTab === "schedule"
              ? "bg-white shadow text-[#6B4F2B]"
              : "text-gray-500"
              }`}
          >
            Schedule
          </button>

          <button
            onClick={() => setActiveTab("earnings")}
            className={`px-4 sm:px-6 py-2 rounded-xl text-sm sm:text-base font-semibold ${activeTab === "earnings"
              ? "bg-white shadow text-[#6B4F2B]"
              : "text-gray-500"
              }`}
          >
            Earnings
          </button>
        </div>
      </div>

      {/* 📅 CONTENT */}
      <div className="px-4 sm:px-6 mt-6 space-y-4 sm:space-y-6">

        {/* Schedule Tab */}
        {activeTab === "schedule" &&
          pujas.map((puja) => (
            <div
              key={puja.id}
              className="bg-white border-t-4 border-orange-400 rounded-2xl p-4 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h3 className="text-base sm:text-lg font-semibold text-[#4B3A2F]">
                  {puja.puja_name}
                </h3>

                <p className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-orange-600">
                  💰 ₹{puja.price || 0}
                </p>
              </div>

              <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">

                <p className="flex items-center gap-2">
                  <Calendar size={14} />
                  {formatDate(puja.preferred_date)}
                </p>

                <p className="flex items-center gap-2">
                  <Clock size={14} />
                  {puja.preferred_time || "09:00 AM"}
                </p>

                <p className="flex items-center gap-2">
                  <MapPin size={14} />
                  {puja.address}, {puja.city}
                </p>

                <p className="flex items-center gap-2">
                  <User size={14} />
                  {puja.customer_name}
                </p>
              </div>
            </div>
          ))}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow text-center">
            <p className="text-gray-500 text-xs sm:text-sm">Total Earnings</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-600 mt-2">
              ₹{totalEarnings}
            </h2>
          </div>
        )}
      </div>

      {/* 🟣 PROFILE POPUP */}
      {showProfile && profile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-[#FFF4E1] w-full sm:w-[90%] max-w-md rounded-2xl p-6 relative shadow-xl overflow-y-auto max-h-[90vh] border-2 border-orange-400">

            {/* Close Button */}
            <X
              className="absolute top-4 right-4 cursor-pointer text-gray-700 hover:text-red-500"
              onClick={() => {
                setShowProfile(false);
                setEditing(false);
              }}
            />

            <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#6B4F2B]">
              My Profile
            </h2>

            {/* Profile Fields */}
            {["name", "phone"].map((field) => (
              <div key={field} className="mb-3">
                <label className="text-xs sm:text-sm text-[#4B3A2F] capitalize">{field}</label>
                <input
                  type="text"
                  value={profile[field] || ""}
                  disabled={true} // read-only
                  className="w-full border border-orange-300 rounded-lg p-2 mt-1 text-sm sm:text-base bg-gray-200 cursor-not-allowed"
                />
              </div>
            ))}

            {["email", "gotra"].map((field) => (
              <div key={field} className="mb-3">
                <label className="text-xs sm:text-sm text-[#4B3A2F] capitalize">{field}</label>
                <input
                  type="text"
                  value={profile[field] || ""}
                  disabled={!editing} // editable only in editing mode
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full border border-orange-300 rounded-lg p-2 mt-1 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}


            {/* Address Fields */}
            {profile.address && (
              <>
                <div className="mb-3">
                  <label className="text-xs sm:text-sm text-[#4B3A2F]">Address</label>
                  <input
                    type="text"
                    value={profile.address.address_line1}
                    disabled={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          ...profile.address,
                          address_line1: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-orange-300 rounded-lg p-2 mt-1 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs sm:text-sm text-[#4B3A2F]">City</label>
                    <input
                      type="text"
                      value={profile.address.city}
                      disabled={!editing}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          address: {
                            ...profile.address,
                            city: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-orange-300 rounded-lg p-2 mt-1 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-[#4B3A2F]">State</label>
                    <input
                      type="text"
                      value={profile.address.state}
                      disabled={!editing}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          address: {
                            ...profile.address,
                            state: e.target.value,
                          },
                        })
                      }
                      className="w-full border border-orange-300 rounded-lg p-2 mt-1 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-xs sm:text-sm text-[#4B3A2F]">Pincode</label>
                  <input
                    type="text"
                    value={profile.address.pincode}
                    disabled={!editing}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: {
                          ...profile.address,
                          pincode: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-orange-300 rounded-lg p-2 mt-1 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </>
            )}

            {/* Edit / Save Button */}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-orange-400 text-white py-2 rounded-lg mt-4 text-sm sm:text-base hover:bg-orange-500 transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 text-white py-2 rounded-lg mt-4 text-sm sm:text-base hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}



      {/* 📞 Support Button */}
      <div className="fixed bottom-4 left-0 right-0 px-4 sm:px-6">
        <button className="w-full bg-[#E6E0D4] py-3 rounded-xl text-sm sm:text-base font-semibold text-gray-700 shadow">
          🎧 Call Support
        </button>
      </div>

    </div>
  );
};

export default PartnerDashboard;
