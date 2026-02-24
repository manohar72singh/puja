import React, { useState } from "react";
import { ShieldCheck, ChevronRight, Lock, Loader2 } from "lucide-react";
import axios from "axios"; // Axios import karein
import { useNavigate } from "react-router-dom"; // Redirect ke liye
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const AdminLogin = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isMobileValid = mobileNumber.length === 10;
  const isOtpValid = otp.length === 6;

  // --- API 1: Request OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isMobileValid) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        phone: mobileNumber,
        role: "admin",
      });

      if (response.status === 200) {
        setShowOtpField(true);
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Admin access denied or Server error",
      );
    } finally {
      setLoading(false);
    }
  };

  // --- API 2: Verify OTP & Login ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!isOtpValid) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/verify-otp`, {
        phone: mobileNumber,
        otp: otp,
      });

      if (response.status === 200) {
        // Token aur Role save karein
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminRole", response.data.role);

        // Dashboard par bhejien
        navigate("/admin/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans relative">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "25px 25px",
        }}
      ></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-[#1e293b]/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-600/20">
              <ShieldCheck size={38} className="text-white" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Admin Command Center
            </h1>
            <p className="text-slate-400 text-[11px] uppercase tracking-[0.2em] mt-1 font-semibold">
              Authorized Access Only
            </p>
          </div>

          {!showOtpField ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-slate-300 text-xs font-bold uppercase ml-1">
                  Mobile Number
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold border-r border-slate-700 pr-3">
                    +91
                  </span>
                  <input
                    type="tel"
                    disabled={loading}
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="9876543210"
                    className="w-full bg-[#0f172a]/50 border border-slate-700 text-white rounded-xl pl-16 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all text-lg tracking-wider disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isMobileValid || loading}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
                  ${
                    isMobileValid && !loading
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-600/25 hover:opacity-90"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                  }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Get OTP"
                )}
                {!loading && <ChevronRight size={20} />}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-6 animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <label className="text-slate-300 text-xs font-bold uppercase">
                    Enter 6-Digit Code
                  </label>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Sent to +91 {mobileNumber}
                  </p>
                </div>

                <input
                  type="text"
                  disabled={loading}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-[#0f172a]/50 border border-slate-700 text-white rounded-xl py-4 text-center text-2xl tracking-[0.6em] font-black focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowOtpField(false);
                    setOtp("");
                  }}
                  className="text-orange-500/80 text-xs font-semibold block mx-auto hover:text-orange-400 transition-colors"
                >
                  Edit Number?
                </button>
              </div>

              <button
                type="submit"
                disabled={!isOtpValid || loading}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
                  ${
                    isOtpValid && !loading
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-600/25"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                  }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Lock size={18} />
                )}
                {loading ? "Verifying..." : "Verify Admin Access"}
              </button>
            </form>
          )}

          <div className="mt-10 pt-6 border-t border-slate-700/50">
            <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest leading-relaxed">
              System Protected by 256-bit Encryption
              <br />
              Unauthorized entry is strictly prohibited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
