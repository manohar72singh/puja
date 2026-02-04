import { useEffect, useState } from "react";
import ReviewSection from "../Components/ReviewSection";
import SpecialPujas from "../Components/SpecialPujas";
import DevotionalStats from "../Components/DevotionalStats";
import HowItWorks from "../Components/HowItWorks";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const rituals = [
    { img: "/img/newImage1.jpg", title: "Sacred Havan", desc: "Purifying Fire Ritual" },
    { img: "/img/newImage2.jpg", title: "Vedic Puja", desc: "Traditional Worship" },
    { img: "/img/newImage4.jpg", title: "Wedding Rituals", desc: "Sacred Union Ceremonies" },
    { img: "/img/newImage3.jpg", title: "Griha Pravesh", desc: "New Beginnings" },
  ];

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const duration = 4000;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rituals.length);
      setProgress(0);
    }, duration);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 0));
    }, duration / 100);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [index, rituals.length]);

  return (
    /* Changed bg to #FFF4E1 and applied to the entire wrapper */
    <div className="w-full overflow-x-hidden bg-[#FFF4E1]">
      
      {/* HERO SECTION - Removed local bg color */}
      <section className="relative flex justify-center px-6 md:px-12 lg:px-16 py-12">
        <div className="w-full max-w-7xl flex flex-col md:flex-row items-center gap-10 lg:gap-16">

          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 flex flex-col">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-6 w-fit">
              ✨ Your Faith Partner
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight font-serif text-[#3b2a1a]">
              Sacred Rituals, <br />
              <span className="text-orange-500">Modern Convenience</span>
            </h1>

            <p className="mt-6 text-gray-600 text-base lg:text-lg leading-relaxed max-w-md">
              Book verified Pandits for your sacred ceremonies. We handle everything — from the sacred Samagri to the final Aarti.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium px-6 lg:px-8 py-3.5 rounded-xl shadow-lg hover:-translate-y-1 transition-all active:scale-95 whitespace-nowrap"
                onClick={() => navigate("/puja")}
              >
                Book Offline Puja
              </button>
              <button className="bg-white text-orange-500 font-medium px-6 lg:px-8 py-3.5 rounded-xl border border-orange-300 shadow-md hover:bg-orange-50 transition-all active:scale-95 whitespace-nowrap"
                onClick={() => navigate("/puja")}>
                Book Online Puja
              </button>
            </div>

            <div className="flex flex-wrap gap-8 mt-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/50 p-2.5 rounded-xl">👨‍👩‍👧‍👦</div>
                <div>
                  <p className="font-semibold text-lg leading-none">5,000+</p>
                  <p className="text-sm text-gray-500 mt-1">Happy Families</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/50 p-2.5 rounded-xl">⭐</div>
                <div>
                  <p className="font-semibold text-lg leading-none">4.9★</p>
                  <p className="text-sm text-gray-500 mt-1">Average Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE CARD */}
          <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] lg:h-[580px] rounded-[30px] overflow-hidden shadow-2xl group bg-black">
            <div className="absolute top-4 left-4 z-50">
              <div className="bg-black/30 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                Live Bookings
              </div>
            </div>

            {rituals.map((item, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-[1500ms] ${i === index ? "opacity-100 z-20" : "opacity-0 z-10"}`}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-[6000ms] ${i === index ? "scale-110" : "scale-100"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
              </div>
            ))}

            <div className="absolute top-4 right-4 z-50 scale-75 md:scale-100">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <svg className="transform -rotate-90 w-12 h-12">
                  <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="2" fill="transparent" className="opacity-20" />
                  <circle
                    cx="24" cy="24" r="20" stroke="#f97316" strokeWidth="2" fill="transparent"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (125.6 * progress) / 100}
                    className="transition-all duration-100 ease-linear"
                  />
                </svg>
                <span className="absolute text-white text-[10px] font-bold font-mono">0{index + 1}</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-4 right-4 z-40">
              <div className="relative w-fit max-w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-[20px] p-3 md:p-5 overflow-hidden group-hover:border-orange-500/50 transition-colors">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-[1px] w-4 bg-orange-500"></span>
                    <span className="text-orange-500 text-[8px] md:text-[9px] font-bold uppercase tracking-wider">Featured Ritual</span>
                  </div>
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-serif text-white mb-1 leading-tight">{rituals[index].title}</h3>
                  <p className="text-white/80 text-[10px] md:text-xs lg:text-sm leading-relaxed mb-3 line-clamp-2">{rituals[index].desc}</p>
                  <button className="flex items-center gap-2 text-white group/btn">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest border-b border-orange-500 pb-0.5">Book Now</span>
                    <div className="p-1 md:p-1.5 rounded-full bg-orange-500">
                      <ChevronRight size={10} className="md:w-3 md:h-3" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
              {rituals.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`transition-all duration-500 rounded-full ${i === index ? "w-8 h-1 bg-orange-500" : "w-2 h-2 bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOWER SECTIONS - Ensure these components don't have their own 'bg-white' classes */}
      <SpecialPujas />
      <DevotionalStats />
      <HowItWorks />
      <ReviewSection />

    </div>
  );
}