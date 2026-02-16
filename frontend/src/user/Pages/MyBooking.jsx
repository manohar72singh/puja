import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle, Timer, XCircle, Info } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/my-bookings`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (loading) return <div className="text-center py-20 text-orange-600 font-bold">Loading Bookings...</div>;

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif text-[#3b2a1a] mb-2">My Sacred <span className="text-orange-500 italic">Bookings</span></h2>
        <p className="text-1rem text-gray-700 mb-10">Track and manage your puja bookings.</p>

        {bookings.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm">
            <p className="text-gray-500 font-medium">Abhi tak koi booking nahi ki gayi hai.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              // --- LOGIC: Identify if it's a Temple Puja ---
              const isTemplePuja = b.address && b.address.includes("Ticket:");

              return (
                <div key={b.id} className={`relative overflow-hidden bg-white rounded-3xl p-5 shadow-sm border transition-all hover:shadow-md ${
                  isTemplePuja ? 'border-orange-300 bg-orange-50/20' : 'border-gray-100'
                } flex flex-col md:flex-row gap-6 mb-4`}>

                  {/* Category Ribbon / Badge */}
                  <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white ${
                    isTemplePuja ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {isTemplePuja ? 'Temple Ceremony' : 'Home Ritual'}
                  </div>

                  {/* Puja Image */}
                  <div className="w-full md:w-32 h-32 shrink-0">
                    <img
                      src={`${API_BASE_URL}/uploads/${b.image_url}`}
                      className="w-full h-full object-cover rounded-2xl shadow-sm"
                      alt={b.puja_name}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      {b.puja_name}
                      {isTemplePuja && <span className="text-sm">⛩️</span>}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-orange-500" />
                        {new Date(b.preferred_date).toLocaleDateString('en-IN')}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="text-orange-500" />
                        {b.preferred_time}
                      </div>

                      {/* Location Logic */}
                      <div className="flex items-start gap-2 text-sm text-gray-600 md:col-span-2">
                        <MapPin size={14} className="text-orange-500 shrink-0 mt-1" />
                        <span className="italic text-gray-500 leading-tight">
                          {isTemplePuja 
                            ? `Temple Location: ${b.city}, ${b.state}` 
                            : `Home Address: ${b.address}`}
                        </span>
                      </div>
                    </div>

                    {/* Special Details for Temple Puja (Extracting Ticket & Donations) */}
                    {isTemplePuja && (
                      <div className="mt-4 p-3 bg-white/60 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Info size={12} className="text-orange-500" />
                          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Booking Details</span>
                        </div>
                        <div className="text-xs text-gray-700 font-medium leading-relaxed">
                          {/* Humne address format rakha tha: Ticket: X | Donations: Y */}
                          {b.address}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Section */}
                  <div className="flex flex-col justify-center items-end border-l border-gray-100 pl-6 hidden md:flex min-w-[120px]">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      b.status === 'pending' ? 'bg-orange-100 text-orange-600 border border-orange-200' : b.status === 'declined'?'text-red-500 bg-red-100 border border-red-200':'bg-green-100 text-green-600 border border-green-200'
                    }`}>
                      {b.status}
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      ID: #P{b.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;