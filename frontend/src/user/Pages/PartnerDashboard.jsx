import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Bell,
  LogOut,
  X,
  Navigation,
  ShoppingBag,
  IndianRupee,
  Star,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/* ── tiny helpers ── */
const fmtDate = (d) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(d));

const statusStyle = (s = "") => {
  const map = {
    confirmed: { bg: "bg-amber-400", text: "text-white", label: "Confirmed" },
    "in progress": { bg: "bg-orange-100", text: "text-orange-500", label: "In Progress" },
    completed: { bg: "bg-green-100", text: "text-green-600", label: "Completed" },
    cancelled: { bg: "bg-red-100", text: "text-red-500", label: "Cancelled" },
  };
  return map[s.toLowerCase()] || { bg: "bg-gray-100", text: "text-gray-500", label: s };
};

/* ── stat card ── */
const StatCard = ({ icon, value, label }) => (
  <div className="flex-1 bg-[#FDFAF4] border border-[#EDE8DC] rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm min-w-0">
    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
      {icon}
    </div>
    <p className="text-xl font-bold text-[#1a1208] tracking-tight leading-none">{value}</p>
    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a89880]">{label}</p>
  </div>
);

/* ── puja card ── */
const PujaCard = ({ puja }) => {
  const st = statusStyle(puja.status || "confirmed");
  return (
    <div className="bg-[#FDFAF4] border border-[#EDE8DC] rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] sm:text-base font-bold text-[#1a1208] leading-snug truncate">
            {puja.puja_name}
          </h3>
          <p className="text-sm text-[#7a6650] mt-0.5 truncate">{puja.customer_name}</p>
        </div>
        <span
          className={`flex-shrink-0 text-[11px] font-bold px-3 py-1 rounded-full ${st.bg} ${st.text}`}
        >
          {st.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] sm:text-[13px] text-[#6b5840]">
        <span className="flex items-center gap-1.5">
          <Clock size={13} className="text-orange-400" />
          {fmtDate(puja.preferred_date)} · {puja.preferred_time || "09:00"}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={13} className="text-orange-400" />
          {puja.city || puja.address}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-500 hover:text-orange-600 transition">
          <Navigation size={13} /> Navigate
        </button>
        <span className="text-[#d9cfc2]">·</span>
        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-500 hover:text-orange-600 transition">
          <ShoppingBag size={13} /> Samagri
        </button>
        <span className="ml-auto text-[14px] font-bold text-[#1a1208]">
          ₹{puja.price || 0}
        </span>
      </div>
    </div>
  );
};

/* ── main ── */
const PartnerDashboard = () => {
  const [pujas, setPujas] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [isOnline, setIsOnline] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate("/partnerSignIn"); return; }
    fetchMyPujas();
    fetchProfile();
  }, []);

  const fetchMyPujas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/partner/my-pujas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPujas(res.data.bookings);
    } catch (e) { console.error(e); }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/partner/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setProfile(res.data.user);
    } catch (e) { console.error(e); }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/partner/update-profile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      alert("Profile Updated Successfully");
    } catch (e) { console.log(e); }
  };

  const totalEarnings = pujas.reduce((s, p) => s + (Number(p.price) || 0), 0);
  const upcoming = pujas.filter(
    (p) => (p.status || "").toLowerCase() !== "completed" &&
      (p.status || "").toLowerCase() !== "cancelled"
  ).length;

  return (
    <div className="min-h-screen bg-[#FFF4E1] font-sans pb-28" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <div className="bg-[#FDFAF4] border-b border-[#EDE8DC] sticky top-0 px-4 sm:px-6 pt-4 pb-4">
        <div className="flex items-center justify-between gap-3">

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F0EBE1] hover:bg-[#e8e0d0] transition"
            >
              <ChevronLeft size={18} className="text-[#6b5840]" />
            </button>

            <button
              onClick={() => setShowProfile(true)}
              className="relative flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center"
            >
              <User size={18} className="text-orange-500" />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
            </button>

            <div className="min-w-0">
              <p className="text-[13px] sm:text-sm font-bold text-[#1a1208] truncate leading-tight">
                {profile?.name || "Partner"}
              </p>
              <p className="text-[11px] text-[#a89880] flex items-center gap-1 truncate">
                <MapPin size={10} /> {profile?.city || "India"}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Online toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-[12px] font-semibold ${isOnline ? "text-green-600" : "text-gray-400"}`}>
                {isOnline ? "On" : "Off"}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${isOnline ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${isOnline ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <Bell size={18} className="text-[#6b5840] cursor-pointer" />
            <LogOut
              size={18}
              className="text-[#6b5840] cursor-pointer hover:text-red-500 transition"
              onClick={() => { localStorage.clear(); navigate("/partnerSignIn"); }}
            />
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6">

        {/* ── STAT CARDS ── */}
        <div className="flex gap-3 mt-5">
          <StatCard icon={<IndianRupee size={18} />} value={`₹${totalEarnings.toLocaleString("en-IN")}`} label="Earnings" />
          <StatCard icon={<Calendar size={18} />} value={upcoming} label="Upcoming" />
          <StatCard icon={<Star size={18} />} value={profile?.rating || "4.9"} label="Rating" />
        </div>

        {/* ── TABS ── */}
        <div className="mt-5 bg-[#EDE8DC] rounded-2xl p-1 flex">
          {[
            { key: "schedule", label: "My Schedule", icon: <Calendar size={14} /> },
            { key: "earnings", label: "Earnings", icon: <IndianRupee size={14} /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${activeTab === t.key
                  ? "bg-[#FDFAF4] shadow text-[#1a1208]"
                  : "text-[#a89880] hover:text-[#6b5840]"
                }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div className="mt-5 space-y-3">

          {activeTab === "schedule" && (
            pujas.length === 0 ? (
              <div className="text-center py-16 text-[#a89880]">
                <Calendar size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No bookings yet</p>
              </div>
            ) : (
              pujas.map((puja) => <PujaCard key={puja.id} puja={puja} />)
            )
          )}

          {activeTab === "earnings" && (
            <div className="space-y-3">
              <div className="bg-[#FDFAF4] border border-[#EDE8DC] rounded-2xl p-6 flex flex-col items-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                  <IndianRupee size={24} className="text-orange-400" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#a89880]">Total Earnings</p>
                <p className="text-4xl font-bold text-[#1a1208] mt-1">
                  ₹{totalEarnings.toLocaleString("en-IN")}
                </p>
              </div>

              {pujas.length > 0 && (
                <div className="bg-[#FDFAF4] border border-[#EDE8DC] rounded-2xl p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#a89880] mb-3">Breakdown</p>
                  <div className="space-y-2">
                    {pujas.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-[13px]">
                        <span className="text-[#4b3a2f] font-medium truncate max-w-[65%]">{p.puja_name}</span>
                        <span className="font-bold text-[#1a1208]">₹{p.price || 0}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#EDE8DC] pt-2 flex justify-between text-[13px] font-bold">
                      <span className="text-[#1a1208]">Total</span>
                      <span className="text-orange-500">₹{totalEarnings.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── PROFILE POPUP ── */}
      {showProfile && profile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-[#FDFAF4] w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh] border border-[#EDE8DC]">
            <button
              onClick={() => { setShowProfile(false); setEditing(false); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F0EBE1] hover:bg-red-50 transition"
            >
              <X size={16} className="text-[#6b5840]" />
            </button>

            <h2 className="text-base font-bold text-[#1a1208] mb-5">My Profile</h2>

            {["name", "phone"].map((f) => (
              <div key={f} className="mb-3">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#a89880]">{f}</label>
                <input
                  value={profile[f] || ""}
                  disabled
                  className="w-full border border-[#EDE8DC] rounded-xl px-3 py-2.5 mt-1 text-sm bg-[#F5F0E8] text-[#6b5840] cursor-not-allowed"
                />
              </div>
            ))}

            {["email", "gotra"].map((f) => (
              <div key={f} className="mb-3">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#a89880]">{f}</label>
                <input
                  value={profile[f] || ""}
                  disabled={!editing}
                  onChange={(e) => setProfile({ ...profile, [f]: e.target.value })}
                  className="w-full border border-[#EDE8DC] rounded-xl px-3 py-2.5 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                />
              </div>
            ))}

            {profile.address && (
              <>
                <div className="mb-3">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#a89880]">Address</label>
                  <input
                    value={profile.address.address_line1}
                    disabled={!editing}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, address_line1: e.target.value } })}
                    className="w-full border border-[#EDE8DC] rounded-xl px-3 py-2.5 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {["city", "state"].map((f) => (
                    <div key={f}>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#a89880]">{f}</label>
                      <input
                        value={profile.address[f]}
                        disabled={!editing}
                        onChange={(e) => setProfile({ ...profile, address: { ...profile.address, [f]: e.target.value } })}
                        className="w-full border border-[#EDE8DC] rounded-xl px-3 py-2.5 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <label className="text-[11px] uppercase tracking-wider font-semibold text-[#a89880]">Pincode</label>
                  <input
                    value={profile.address.pincode}
                    disabled={!editing}
                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, pincode: e.target.value } })}
                    className="w-full border border-[#EDE8DC] rounded-xl px-3 py-2.5 mt-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                  />
                </div>
              </>
            )}

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-xl mt-4 text-sm transition"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl mt-4 text-sm transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── SUPPORT BUTTON ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F5F0E8] border-t border-[#EDE8DC] px-4 sm:px-6 py-3">
        <div className="w-full">
          <button className="w-full bg-[#EDE8DC] hover:bg-[#e3dcce] py-3 rounded-xl text-sm font-semibold text-[#6b5840] transition">
            🎧 Call Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;