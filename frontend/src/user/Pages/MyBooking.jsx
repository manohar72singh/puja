import React from 'react';
import { ChevronLeft, Calendar, Clock, User, Package, MapPin, XCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();

  // Dynamic Data Array
  const bookings = [
    {
      id: 1,
      pujaName: "Navgrah Shanti Havan",
      date: "Tuesday, 3 February 2026",
      time: "11:50 PM",
      devotee: "mahek (singh Gotra)",
      kitIncluded: true,
      location: "jhb",
      price: "5,953",
      status: "Cancelled",
      color: "indigo"
    },
    {
      id: 2,
      pujaName: "Satyanarayan Puja",
      date: "Thursday, 5 February 2026",
      time: "09:00 AM",
      devotee: "Sankalp Sharma",
      kitIncluded: true,
      location: "Haridwar",
      price: "3,100",
      status: "Confirmed",
      color: "orange"
    }
  ];

  // Design System
  const containerWidth = "w-full max-w-6xl mx-auto";
  // Added border-orange-200 to the main wrapper div
  const mainWrapperStyle = "bg-white rounded-[2rem] border border-orange-200 shadow-sm p-6 md:p-10";
  const bookingCardStyle = "bg-white rounded-[1.5rem] border border-orange-100 shadow-sm p-6 mb-5 relative overflow-hidden hover:border-orange-300 transition-colors";
  const primaryBtnStyle = "bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-md border border-orange-300 flex items-center gap-2 active:scale-[0.98] text-sm";

  return (
    <div className="min-h-screen bg-[#FFF4E1] text-[#2D2D2D] font-sans antialiased">
      <main className="px-4 sm:px-8 py-8 md:py-12">
        
        {/* Main Div with Orange-200 Border */}
        <div className={`${containerWidth} ${mainWrapperStyle}`}>
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="text-left">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 mb-6 transition-colors group"
              >
                <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={18} /> 
                <span>Back</span>
              </button>
              
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">
                My Bookings
              </h1>
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.18em] mt-1.5">
                Track and manage your puja bookings
              </p>
            </div>

            <button className={primaryBtnStyle}>
              Book New Puja <ArrowRight size={16} />
            </button>
          </div>

          {/* Dynamic Mapping of Bookings */}
          <div className="space-y-2">
            {bookings.map((booking) => (
              <div key={booking.id} className={bookingCardStyle}>
                
                {/* Status Tag */}
                <div className="absolute top-6 right-6 md:right-8">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    booking.status === 'Cancelled' 
                    ? 'bg-red-50 text-red-500 border-red-100' 
                    : 'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {booking.status === 'Cancelled' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-wider">{booking.status}</span>
                  </div>
                </div>

                {/* Puja Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-serif text-xl ${
                    booking.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    ॐ
                  </div>
                  <h2 className="text-xl font-serif font-bold text-gray-800">{booking.pujaName}</h2>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
                  
                  {/* Column 1: Date & Time */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Calendar size={18} className="text-orange-300" />
                      <span className="text-sm font-medium">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <Clock size={18} className="text-orange-300" />
                      <span className="text-sm font-medium">{booking.time}</span>
                    </div>
                  </div>

                  {/* Column 2: Devotee & Samagri */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-500">
                      <User size={18} className="text-orange-300" />
                      <span className="text-sm font-medium">{booking.devotee}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <Package size={18} className="text-orange-300" />
                      <span className="text-sm font-medium">
                        {booking.kitIncluded ? "Samagri Kit Included" : "No Kit Included"}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Location & Price */}
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-3 text-gray-500">
                      <MapPin size={18} className="text-orange-300" />
                      <span className="text-sm font-medium uppercase">{booking.location}</span>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <span className="text-2xl font-serif font-bold text-orange-600">₹{booking.price}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default MyBookings;