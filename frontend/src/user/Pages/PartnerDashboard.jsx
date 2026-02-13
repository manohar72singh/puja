import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, MapPin, Phone, User, Calendar } from "lucide-react";

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("new"); // "new" or "accepted"
  const [newRequests, setNewRequests] = useState([]);
  const [mySchedule, setMySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5000/partner";
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch New Pending Requests
      const res1 = await fetch(`${API_BASE_URL}/available-pujas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data1 = await res1.json();
      setNewRequests(data1.bookings || []);

      // 2. Fetch My Accepted Schedule
      const res2 = await fetch(`${API_BASE_URL}/my-accepted-pujas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data2 = await res2.json();
      setMySchedule(data2.bookings || []);
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
        fetchData(); // Refresh both lists
      }
    } catch (error) {
      alert("Action failed!");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pandit Dashboard</h1>

      {/* Tabs System */}
      <div className="flex gap-4 mb-6 border-b">
        <button 
          onClick={() => setActiveTab("new")}
          className={`pb-2 px-4 ${activeTab === "new" ? "border-b-2 border-orange-500 text-orange-600" : "text-gray-500"}`}
        >
          New Requests ({newRequests.length})
        </button>
        <button 
          onClick={() => setActiveTab("accepted")}
          className={`pb-2 px-4 ${activeTab === "accepted" ? "border-b-2 border-orange-500 text-orange-600" : "text-gray-500"}`}
        >
          My Schedule ({mySchedule.length})
        </button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTab === "new" ? newRequests : mySchedule).map((puja) => (
            <div key={puja.id} className="border p-4 rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-orange-700">{puja.puja_name}</h3>
                <span className="text-sm bg-orange-100 px-2 py-1 rounded text-orange-800 flex items-center gap-1">
                  <Calendar size={14} /> {new Date(puja.preferred_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="space-y-2 text-gray-600 text-sm">
                <p className="flex items-center gap-2"><Clock size={16}/> {puja.preferred_time}</p>
                <p className="flex items-center gap-2"><MapPin size={16}/> {puja.address}, {puja.city}</p>
                <p className="flex items-center gap-2"><User size={16}/> {puja.user_name}</p>
                <p className="flex items-center gap-2 text-blue-600 font-medium"><Phone size={16}/> {puja.user_phone}</p>
              </div>

              {activeTab === "new" && (
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => handleAction(puja.id, 'accepted')}
                    className="flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700"
                  >
                    <CheckCircle size={18}/> Accept
                  </button>
                  <button 
                    onClick={() => handleAction(puja.id, 'declined')}
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded flex items-center justify-center gap-2 hover:bg-red-100"
                  >
                    <XCircle size={18}/> Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;