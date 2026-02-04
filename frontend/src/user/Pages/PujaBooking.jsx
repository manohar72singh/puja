import React, { useState } from 'react';
import { Clock, Shield, Heart, Briefcase, Users, Box, ChevronRight, Zap, House, MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: "Satyanarayan Katha",
    temple: "Ayodhya Ram Mandir",
    category: "Dosha",
    date: "Thursday",
    rating: 4.9,
    reviews: 180,
    price: 1500,
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b",
    badge: "Popular",
  },
  {
    id: 2,
    title: "Griha Pravesh Puja",
    temple: "Haridwar",
    category: "Marriage",
    date: "Auspicious Day",
    rating: 4.7,
    reviews: 92,
    price: 4100,
    image: "https://i.pinimg.com/736x/f4/7f/a6/f47fa60b150368934020c210c8c49d0d.jpg",
  },
  {
    id: 3,
    title: "Maha Mrityunjaya Jaap",
    temple: "Kashi Vishwanath",
    category: "Shiv Puja",
    date: "Monday",
    rating: 5.0,
    reviews: 256,
    price: 5100,
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b",
    badge: "Highly Rated"
  },
  {
    id: 4,
    title: "Rahu–Ketu Shanti Puja",
    temple: "Srikalahasti",
    category: "Navgraha",
    date: "Next Week",
    rating: 4.6,
    reviews: 110,
    price: 2700,
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2",
  },
  {
    id: 5,
    title: "Kaal Sarp Dosha Puja",
    temple: "Trimbakeshwar, Nashik",
    category: "Dosha",
    date: "Tomorrow",
    rating: 4.8,
    reviews: 124,
    price: 2100,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    badge: "Most Booked",
  },
  {
    id: 6,
    title: "Manglik Dosha Nivaran",
    temple: "Ujjain Mahakal",
    category: "Marriage",
    date: "Amavasya",
    rating: 4.7,
    reviews: 98,
    price: 2500,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaIc1BqS_aDmS26-3x3JSSotU2p0Dr2InktA&s",
    badge: "Recommended",
  },
  {
    id: 7,
    title: "Navgraha Shanti Puja",
    temple: "Kashi Vishwanath",
    category: "Navgraha",
    date: "This Week",
    rating: 4.9,
    reviews: 210,
    price: 3100,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN4BqbvT9jy2Jgqr3gQY-Q9bWELVO3eyyS6A&s",
  },
  {
    id: 8,
    title: "Rudrabhishek",
    temple: "Somnath Temple",
    category: "Shiv Puja",
    date: "Monday",
    rating: 4.6,
    reviews: 76,
    price: 1100,
    image: "https://static.wixstatic.com/media/6642a4_8930a82d27434739a6aeaf5fc2d4e2fe~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6642a4_8930a82d27434739a6aeaf5fc2d4e2fe~mv2.jpg",
  },

];

const PujaBooking = () => {
  const [samagriEnabled, setSamagriEnabled] = useState(true);

  const id = useParams();
  console.log(id.id)
  const findService = services.find(s => s.id == Number(id.id))

  return (
    <div className="min-h-screen bg-[#FFF4E1]
 p-4 md:p-8 font-sans text-gray-800">

      {/* IMPORTANT: 'items-start' is mandatory for sticky to work in a grid.
          It ensures the right column height is only as tall as the summary card.
      */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left Column (Scrollable Content) */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Hero Card */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-orange-50/50">
            <div className="relative h-64 md:h-80 bg-gray-200">
              <img
                src={findService.image}
                alt="Satya Narayan Katha"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-700">North Indian</span>
                <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">✨ Trending</span>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-1 drop-shadow-md">{findService.title}</h1>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-lg mb-4">Divine narrative worship for prosperity</p>
              <div className="flex items-center gap-2 text-orange-600 font-medium">
                <Clock size={18} />
                <span>3 hours</span>
              </div>
            </div>
          </div>

          {/* 2. Samagri Kit Toggle */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50/50 flex flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-lg text-orange-500 shrink-0"><Box size={24} /></div>
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-800">All-in-One Samagri Kit</h3>
                <p className="text-gray-500 text-sm mt-1"><span className="text-orange-500 font-medium">Relax.</span> We bring Flowers, Ghee & Vessels.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <button onClick={() => setSamagriEnabled(!samagriEnabled)} className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${samagriEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}>
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${samagriEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
              <span className="text-xs font-semibold text-gray-500">+₹600</span>
            </div>
          </div>

          {/* 3. Benefits Section */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-gray-800">Benefits of Satya Narayan Katha</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BenefitCard icon={<Heart size={20} />} title="Spiritual Peace" desc="Inner calm through sacred rituals" />
              <BenefitCard icon={<Shield size={20} />} title="Protection & Blessings" desc="Divine protection for family" />
              <BenefitCard icon={<Briefcase size={20} />} title="Prosperity & Success" desc="Removes obstacles in career" />
              <BenefitCard icon={<Users size={20} />} title="Family Harmony" desc="Strengthens bond between members" />
              <BenefitCard icon={<Zap size={20} />} title="Positive Energy" desc="Purify home with mantras" />
              <BenefitCard icon={<House size={20} />} title="Vastu Benefits" desc="Harmonize living space" />
            </div>
          </div>

          {/* 4. WhatsApp Card */}
          <div className="bg-[#FFF9E5] rounded-2xl p-5 border border-yellow-100 flex items-start gap-4">
            <div className="p-2 bg-[#FFEDC2] text-yellow-700 rounded-xl mt-1"><MessageCircle size={24} /></div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900">Pandit Details via WhatsApp</h3>
              <p className="text-gray-600 text-sm mt-1">Your assigned Pandit's details will be shared on <span className="font-bold text-gray-800">WhatsApp</span> on the booking date.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (FIXED STICKY)
            - lg:sticky: Active only on Desktop.
            - lg:top-28: Adjust this based on your Navbar height (e.g., if navbar is 80px, use top-24).
            - h-fit: Keeps the container height minimal so it has 'room' to slide.
        */}
        <div className="lg:col-span-1 lg:sticky lg:top-28 h-fit z-10">
          <div className="bg-white rounded-3xl shadow-lg border border-orange-50/50 p-6">
            <h2 className="text-2xl font-serif font-bold mb-6">Booking Summary</h2>
            <div className="space-y-4 mb-6 text-gray-600 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span className="font-medium text-gray-900">{findService.price}</span>
              </div>
              <div className={`flex justify-between transition-opacity ${samagriEnabled ? 'opacity-100' : 'opacity-50'}`}>
                <span>Samagri Kit</span>
                <span className="font-medium text-gray-900">+₹600</span>
              </div>
            </div>
            <div className="border-t border-dashed border-gray-200 my-4"></div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-lg font-medium text-gray-800">Total</span>
              <span className="text-3xl font-serif font-bold text-orange-500">
                ₹{samagriEnabled ? Number(findService.price) + Number(600) : findService.price}
              </span>

            </div>
            <p className="text-right text-xs text-gray-400 mb-6 italic">Fixed - No Cash Tips needed</p>
            <button className="w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
              Proceed to Book <ChevronRight size={20} />
            </button>
            <p className="text-center text-[10px] md:text-xs text-gray-400 mt-4">Free cancellation up to 24 hours before</p>
          </div>
        </div>

      </div>
    </div>
  );
};

const BenefitCard = ({ icon, title, desc }) => (
  <div className="bg-[#F9F5F0] p-4 rounded-xl flex items-start gap-4 border border-transparent hover:border-orange-100 transition-all">
    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg shrink-0">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default PujaBooking;