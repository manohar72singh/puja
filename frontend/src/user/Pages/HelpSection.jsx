import React, { useState, useRef } from "react";
import {
  Headphones,
  Phone,
  Mail,
  Send,
  ChevronDown,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const HelpSection = () => {
  const navigate = useNavigate();
  const submitLock = useRef(false); // 🔥 Prevent double submit

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "General Query",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Double submit protection
    if (submitLock.current) return;
    submitLock.current = true;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/puja/support-query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (response.ok && result.success) {
        alert("✅ Query submitted successfully!");
        setFormData({
          category: "General Query",
          subject: "",
          message: ""
        });
      } else {
        alert("❌ " + (result.message || "Failed to submit query"));
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("❌ Network Error: Failed to send message");
    } finally {
      setLoading(false);
      submitLock.current = false; // 🔓 Unlock
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-8 font-sans">
      <div className="max-w-xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 mb-6 font-medium hover:text-orange-500 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200 text-white">
            <Headphones size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Talk to Our Executive
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Our support team is here to help you
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-3xl border border-orange-200 flex items-center gap-4 shadow-sm">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-500">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Call Now
              </p>
              <p className="text-sm font-bold text-gray-700">
                +91 98765 43210
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-orange-200 flex items-center gap-4 shadow-sm">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-500">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Email Us
              </p>
              <p className="text-sm font-bold text-gray-700">
                support@srivedicpuja.com
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-[32px] border border-orange-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6 font-bold text-gray-800 text-lg">
            <Send
              size={18}
              className="text-orange-500 rotate-[-20deg]"
            />
            <span>Send a Message</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                Category
              </label>
              <div className="relative mt-1">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value
                    })
                  }
                  className="w-full bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-sm font-medium outline-none appearance-none focus:border-orange-400"
                >
                  <option>General Query</option>
                  <option>Booking Issue</option>
                  <option>Refund</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                Subject
              </label>
              <input
                required
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject: e.target.value
                  })
                }
                placeholder="Brief description of your issue"
                className="w-full bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-sm font-medium mt-1 outline-none focus:border-orange-400"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                Message
              </label>
              <textarea
                required
                rows="4"
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value
                  })
                }
                placeholder="Describe your issue in detail..."
                className="w-full bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-sm font-medium mt-1 outline-none focus:border-orange-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95 disabled:bg-gray-300"
            >
              {loading ? "Sending..." : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;