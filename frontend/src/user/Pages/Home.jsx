import { useEffect, useState } from "react";
import ReviewSection from "../Components/ReviewSection";
import SpecialPujas from "../Components/SpecialPujas";
import DevotionalStats from "../Components/DevotionalStats";
import HowItWorks from "../Components/HowItWorks";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ShieldCheck, Box, Sparkles, Home as HomeIcon, Star, Users, Video, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const rituals = [
    { img: "/img/newImage1.jpg", title: "Sacred Havan", desc: "Purifying Fire Ritual" },
    { img: "/img/newImage2.jpg", title: "Vedic Puja", desc: "Traditional Worship" },
    { img: "/img/newImage4.jpg", title: "Wedding Rituals", desc: "Sacred Union Ceremonies" },
    { img: "/img/newImage3.jpg", title: "Griha Pravesh", desc: "New Beginnings" },
  ];

  const [index, setIndex] = useState(0);
  const duration = 4000;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rituals.length);
    }, duration);
    return () => clearInterval(timer);
  }, [index, rituals.length]);

  return (
    <div className="w-full overflow-x-hidden bg-[#FFF4E1] flex flex-col items-center">

      {/* ================= HERO SECTION ================= */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-16">
        {/* items-start ensures both boxes start at the same top line */}
        <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12 max-w-[1250px] mx-auto">

          {/* LEFT SIDE - Heading size increased */}
          <div className="w-full md:w-[50%] flex flex-col pt-2">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold mb-6 w-fit uppercase tracking-widest">
              ✨ Your Faith Partner
            </span>

            {/* Heading size increased to text-5xl/text-6xl for more impact */}
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-black leading-[1.1] font-serif text-[#3b2a1a]">
              Sacred Rituals, <br />
              <span className="text-orange-500">Modern Convenience</span>
            </h1>

            {/* Paragraph section updated for 2 lines */}
            <p className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed max-w-lg">
              Book verified Pandits for your sacred ceremonies. We handle everything — from the sacred Samagri to the final Aarti.
            </p>

            <div className="flex gap-4 mt-10">
              <button
                className="bg-orange-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-orange-600 transition-all active:scale-95 whitespace-nowrap"
                onClick={() => navigate("/homePuja")}
              >
                Book Home Puja
              </button>

              <button
                className="bg-white text-orange-500 font-bold px-8 py-3.5 rounded-xl border border-orange-200 shadow-sm hover:bg-orange-50 transition-all active:scale-95 whitespace-nowrap"
                onClick={() => navigate("/temple-puja")}
              >
                Book Temple Puja
              </button>
            </div>

            <div className="flex items-center gap-10 mt-12">
              {/* Families Stat */}
              <div className="flex items-center gap-3">
                <div className="bg-white border border-orange-300 p-2 rounded-lg text-orange-600">
                  <Users size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#3b2a1a] leading-none">5,000+</p>
                  <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest mt-1">Families</p>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-10 bg-orange-200"></div>

              {/* Rating Stat */}
              <div className="flex items-center gap-3">
                <div className="bg-white border border-orange-300 p-2 rounded-lg text-orange-600">
                  <Star size={24} fill="currentColor" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#3b2a1a] leading-none">4.9★</p>
                  <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest mt-1">Rating</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md h-[1px] bg-gray-200/60 mt-3 mb-8"></div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 rounded-full border border-orange-300 shadow-sm">
                <ShieldCheck size={16} className="text-orange-600" />
                <span className="text-xs md:text-sm font-semibold text-gray-600">Verified Pandits</span>
              </div>

              <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 rounded-full border border-orange-300 shadow-sm">
                <Box size={16} className="text-orange-600" />
                <span className="text-xs md:text-sm font-semibold text-gray-600">Samagri Included</span>
              </div>

              <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 rounded-full border border-orange-300 shadow-sm">
                <Sparkles size={16} className="text-orange-600" />
                <span className="text-xs md:text-sm font-semibold text-gray-600">Fixed Pricing</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Increased width to 50% (approx 8% up from 42%) */}
          <div className="relative w-full md:w-[45%] h-[500px] md:h-[540px] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-zinc-900 group">

            {/* Modern Floating Live Badge */}
            <div className="absolute top-6 left-6 z-50">
              <div className="bg-black/20 backdrop-blur-xl border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 tracking-widest transition-transform group-hover:scale-105">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                LIVE
              </div>
            </div>

            {/* Ken Burns Slider Logic */}
            {rituals.map((item, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${i === index ? "opacity-100 scale-100 z-20" : "opacity-0 scale-110 z-10"
                  }`}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-[6000ms] ${i === index ? "scale-110" : "scale-100"
                    }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>
            ))}

            {/* Indicators - Now at Bottom Right (Above Info Card) */}
            <div className="absolute bottom-8 right-8 z-50 flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/5">
              {rituals.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ease-out ${i === index ? "w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "w-2 bg-white/30"
                    }`}
                />
              ))}
            </div>

            {/* Premium Info Card Overlay - Width adjusted to content */}
            <div className="absolute bottom-8 left-6 z-40">
              <div className="w-fit max-w-[100%] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-[28px] transform transition-all duration-500 group-hover:-translate-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-[1px] w-4 bg-orange-500"></span>
                  <span className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">Ceremony</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-serif text-white font-bold leading-tight mb-2 whitespace-nowrap">
                  {rituals[index].title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed max-w-[300px]">
                  {rituals[index].desc}
                </p>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="w-full bg-[#FFF4E1] py-20 px-6 flex justify-center">
        <div className="max-w-6xl w-full text-center flex flex-col items-center">
          {/* HEADING - Ab margin-bottom kam kar diya hai */}
          <h2 className="text-xl md:text-4xl font-serif font-bold text-[#3b2a1a] mb-4">
            How Would You Like to Experience Puja?
          </h2>

          {/* PARAGRAPH - 2 lines balanced text */}
          <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl mb-12 opacity-90">
            Choose the perfect way to receive divine blessings —
            <br className="hidden md:block" />
            whether you prefer a personal ritual at home or joining devotees online.
          </p>

          {/* CARDS GRID */}
          <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">

            <div className="group p-8 rounded-[32px] bg-[#FFFDF8] border border-orange-200 text-left hover:shadow-2xl hover:border-orange-400 transition-all duration-300 cursor-pointer" onClick={() => navigate("/homePuja")}>
              <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                <HomeIcon size={28} />
              </div>
              <h3 className="text-2xl font-bold font-serif mb-3 text-[#1A2B47]">Book Offline Puja</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Verified Pandits visit your home with all Samagri. Experience the complete traditional ritual in person with your family.
              </p>
              <button className="text-orange-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Book Now <ArrowRight size={18} />
              </button>
            </div>

            <div className="group p-8 rounded-[32px] bg-[#FFFDF8] border border-orange-200 text-left hover:shadow-2xl hover:border-orange-400 transition-all duration-300 cursor-pointer" onClick={() => navigate("/temple-puja")}>
              <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                <Video size={28} />
              </div>
              <h3 className="text-2xl font-bold font-serif mb-3 text-[#1A2B47]">Virtual Puja</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Join live rituals and seek blessings from sacred temples globally via streaming with thousands of devotees worldwide.
              </p>
              <button className="text-orange-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Join Now <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER COMPONENTS */}
      <div className="w-full">
        <SpecialPujas />
        <DevotionalStats />
        <HowItWorks />
        <ReviewSection />
      </div>
    </div>
  );
}