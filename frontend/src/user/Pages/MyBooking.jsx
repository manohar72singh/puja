import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/booking/allbookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setBookings(data); // 👈 DIRECT backend data
      
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF4E1] text-[#2D2D2D] font-sans">
      <main className="px-4 sm:px-8 py-8 md:py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 mb-6"
            >
              <ChevronLeft size={18} /> Back
            </button>

            <h1 className="text-3xl font-serif font-bold text-gray-900">
              My Bookings
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">
              All your puja bookings
            </p>
          </div>

          <button className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center gap-2 text-sm">
            Book New Puja <ArrowRight size={16} />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400 font-medium">
            Loading bookings...
          </p>
        )}

        {/* Empty */}
        {!loading && bookings.length === 0 && (
          <p className="text-center text-gray-400 font-medium">
            No bookings found
          </p>
        )}

        {/* BOOKINGS LIST */}
        <div className="space-y-5">
          {bookings.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6 hover:border-orange-300 transition"
            >
              {/* Puja Name */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-serif text-xl">
                  ॐ
                </div>
                <h2 className="text-xl font-serif font-bold">
                  {item.puja_name}
                </h2>
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-10">
                {/* Date */}
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={18} className="text-orange-300" />
                  <span className="text-sm font-medium">
                    {new Date(item.puja_date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock size={18} className="text-orange-300" />
                  <span className="text-sm font-medium">
                    {item.puja_time}
                  </span>
                </div>

                {/* Devotee */}
                <div className="flex items-center gap-3 text-gray-600">
                  <User size={18} className="text-orange-300" />
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-center gap-3 text-gray-600 md:col-span-2">
                  <MapPin size={18} className="text-orange-300" />
                  <span className="text-sm font-medium">
                    {item.address_line}, {item.city}, {item.state} -{" "}
                    {item.pincode}
                  </span>
                </div>

                {/* Price */}
                <div className="text-right md:text-left">
                  <span className="text-2xl font-serif font-bold text-orange-600">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyBookings;
