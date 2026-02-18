import React, { useState, useRef, useEffect } from "react";

import {
  ChevronRight, ChevronLeft, Star, HelpCircle, Info, Box,
  Heart, Shield, Zap, Users, Download , CheckCircle, MessageSquare, MapPin, Sparkles
} from "lucide-react";

import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const HomePujaBooking = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [samagriEnabled, setSamagriEnabled] = useState(
    location.state?.isSamagriSelected !== undefined ? location.state.isSamagriSelected : true
  );

  const [activeTab, setActiveTab] = useState("about");
  const [service, setService] = useState(null);

  const sections = {
    about: useRef(null),
    benefits: useRef(null),
    faqs: useRef(null)
  };

  useEffect(() => {
    const bookPuja = async (id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/bookPuja/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        setService(Array.isArray(data) ? data[0] : data);
      } catch (error) { console.log("Error:", error); }
    };
    if (id) bookPuja(id);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const [key, ref] of Object.entries(sections)) {
        if (
          ref.current &&
          scrollPosition >= ref.current.offsetTop &&
          scrollPosition < ref.current.offsetTop + ref.current.offsetHeight
        ) {
          setActiveTab(key);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sections[sectionId].current;
    if (element) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  const basePrice = Number(service?.standard_price || 0);
  const totalAmount = samagriEnabled ? basePrice + 600 : basePrice;

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-6 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-orange-700 mb-5 hover:opacity-70 transition-all"
        >
          <ChevronLeft size={18} /> Back to Selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8 space-y-5">

            {/* HERO SECTION */}
            <div className="bg-white rounded-2xl overflow-hidden border border-orange-200 shadow-sm">
              <div className="relative h-64 md:h-80">
                <img
                  src={`${API_BASE_URL}/uploads/${service?.image_url}`}
                  className="w-full h-full object-cover"
                  alt="Puja"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                    {service?.puja_name}
                  </h1>
                  <div className="flex items-center">
                    <span className="text-white text-[13px] font-bold uppercase tracking-wider">
                      Certified Vedic Ritual
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ FIXED STICKY TAB HEADER */}
            <nav className="sticky top-[76px] z-40 bg-white border border-orange-200 rounded-xl shadow-md mb-4">
              <div className="flex overflow-x-auto no-scrollbar">
                {["about", "benefits", "faqs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => scrollToSection(tab)}
                    className={`flex-1 px-6 py-4 text-[13px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${activeTab === tab
                      ? "text-orange-600 bg-orange-50/50"
                      : "text-gray-400"
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* SAMAGRI TOGGLE SECTION */}
            <div className={`bg-white rounded-xl p-5 border transition-all duration-300 shadow-sm ${samagriEnabled ? 'border-orange-400' : 'border-orange-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg transition-all ${samagriEnabled ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'}`}>
                    <Box size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-[16px] text-gray-800 tracking-tight">All-in-One Samagri Kit</h3>

                    {samagriEnabled ? (
                      /* ON State Text */
                      <p className="text-gray-500 text-[13px]">
                        <span className="text-orange-600 font-bold">Relax.</span> We bring Flowers, Ghee & Vessels.
                      </p>
                    ) : (
                      /* OFF State Content */
                      <div className="space-y-3">
                        <p className="text-gray-500 text-[13px]">
                          You'll need to buy <span className="text-red-500 font-bold">30+ items.</span>
                        </p>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-orange-200 rounded-lg text-[12px] font-bold text-gray-700 hover:bg-orange-50 transition-colors">
                          <Download size={14} /> Download Checklist
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => setSamagriEnabled(!samagriEnabled)}
                    className={`w-14 h-7 flex items-center rounded-full px-1 transition-colors ${samagriEnabled ? "bg-orange-500 shadow-inner" : "bg-gray-200"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${samagriEnabled ? "translate-x-7" : "translate-x-0"}`} />
                  </button>
                  <span className="text-[11px] font-bold text-gray-400 mt-1">
                    {samagriEnabled ? "+₹600" : "Not included"}
                  </span>
                </div>
              </div>
            </div>

            {/* CONTENT CONTAINER */}
            <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-sm">
              <div className="p-7 space-y-4">

                {/* SECTION: About */}
                <section ref={sections.about} className="scroll-mt-32 space-y-5">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest">
                    <Info size={20} /> About The Ritual
                  </div>
                  <p className="text-[15px] text-gray-600 leading-relaxed text-justify">
                    {service?.description}
                  </p>
                </section>

                <div className="border-t border-orange-50" />

                {/* SECTION: Benefits (Image-style Layout) */}
                <section ref={sections.benefits} className="scroll-mt-32 space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-800">Benefits of {service?.puja_name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BenefitSmall icon={<Heart />} title="Spiritual Peace" desc="Inner calm through sacred rituals" />
                    <BenefitSmall icon={<Shield />} title="Protection & Blessings" desc="Divine protection for family" />
                    <BenefitSmall icon={<Zap />} title="Prosperity & Success" desc="Remove obstacles from your path" />
                    <BenefitSmall icon={<Users />} title="Family Harmony" desc="Strengthen family bonds" />
                    <BenefitSmall icon={<Sparkles />} title="Positive Energy" desc="Purify home with mantras" />
                    <BenefitSmall icon={<MapPin />} title="Vastu Benefits" desc="Harmonize living space" />
                  </div>
                </section>

                <div className="border-t border-orange-50" />



              </div>

            </div>

            {/* WhatsApp Highlighting (Image Style) */}
            <div className="bg-white rounded-xl p-6 border border-yellow-200 flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-yellow-400 text-white rounded-lg shadow-sm"><MessageSquare size={22} /></div>
              <div>
                <h4 className="text-[16px] font-bold text-gray-800">Pandit Details via WhatsApp</h4>
                <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">Your assigned Pandit's contact and details will be shared on <span className="font-bold text-gray-900 underline decoration-yellow-400">WhatsApp</span> on the day of your booking.</p>
              </div>
            </div>

            {/* SECTION: FAQs */}
            <section ref={sections.faqs} className="bg-white p-7 rounded-2xl border border-orange-200 shadow-sm scroll-mt-32">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest mb-6">
                <HelpCircle size={20} /> Frequently Asked Questions
              </div>
              <div className="space-y-4">
                <FAQItem q="Who will perform the Puja?" a="Experienced Vedic Pandits well-versed in Shastras will be assigned to your home." />
                <FAQItem q="I don't know my Gotra, what should I do?" a="Don't worry! If you don't know your Gotra, our Pandit will use 'Kashyap' Gotra during the Sankalp, as it is traditionally accepted in such cases." />
                <FAQItem q="Who will perform the Puja?" a="Experienced Vedic Pandits who are well-versed in Shastras and certified for performing complex rituals will conduct your puja." />
                <FAQItem q="What will be done in this Puja?" a="The puja includes the main ritual (Katha/Havan), Ganesh Pujan, Sankalp, and Aarti. All steps are followed as per Vedic traditions." />
                <FAQItem q="How will I know the Puja has been done in my name?" a="The Pandit will take your name and Gotra during the 'Sankalp' at the beginning of the puja, dedicated specifically to your family." />
                <FAQItem q="What will I get after the Puja is done?" a="After completion, you will receive the divine blessings, sacred Prasad (if samagri is selected), and a peaceful spiritual environment in your home." />
                <FAQItem q="Do I need to arrange any utensils?" a="Just basic household utensils (Kalash, Plates) are needed. All ritual items are provided if Samagri kit is selected." />
              </div>
            </section>

          </div>

          {/* SIDEBAR SUMMARY */}
          <aside className="lg:col-span-4 lg:sticky lg:top-[100px] self-start">
            <div className="bg-white rounded-2xl border border-orange-200 p-8 shadow-sm space-y-8">
              {/* Header with Progress Line */}
              <div>
                <h2 className="text-[15px] font-bold uppercase tracking-[0.2em] text-gray-700 mb-2">
                  Booking Summary
                </h2>
                <div className="flex gap-1">
                  <div className="h-1 w-12 bg-orange-500 rounded-full" />
                  <div className="h-1 w-4 bg-orange-100 rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Base Price Row */}
                <div className="flex justify-between items-center text-[15px] font-bold">
                  <span className="text-gray-500 uppercase tracking-wider">Base Price</span>
                  <span className="text-gray-800 tracking-tight">₹{basePrice}</span>
                </div>

                {/* Samagri Kit Row - Tabhi dikhega jab enabled ho */}
                {samagriEnabled && (
                  <div className="flex justify-between items-center text-[15px] font-bold pt-4 border-t border-orange-50">
                    <span className="text-gray-500 uppercase tracking-wider">Samagri Kit</span>
                    <span className=" tracking-tight">+₹600</span>
                  </div>
                )}

                {/* Total Amount Section */}
                <div className="pt-6 mt-2 border-t border-dashed border-orange-200">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase text-gray-400 tracking-[0.15em] leading-none">
                        Total Amount
                      </span>
                      <span className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1.5">
                        <Shield size={10} className="stroke-[3]" /> Inclusive of all taxes
                      </span>
                    </div>

                    {/* Price Alignment: Right Side */}
                    <div className="text-right">
                      <span className="text-4xl font-serif font-bold text-orange-600 tracking-tighter">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button & Security Badge */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate(`/homePuja/payment-details/${id}`, { state: { isSamagriSelected: samagriEnabled } })}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white font-bold py-5 rounded-xl shadow-xl shadow-orange-100 hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-[0.2em] text-[13px] active:scale-95 flex items-center justify-center gap-2"
                >
                  Proceed to Book <ChevronRight size={18} strokeWidth={3} />
                </button>

                <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-wides py-3 rounded-lg">
                  Free cancellation up to 24 hours before.
                </div>
              </div>
            </div>

            {/* Helpful Note Below Sidebar */}
            <p className="mt-4 px-4 text-[11px] text-gray-400 leading-relaxed text-center italic">
              *Booking confirms your slot with our certified Vedic Pandits. You can reschedule up to 24 hours before the ritual.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

// --- HELPER: BENEFIT CARD ---
const BenefitSmall = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 bg-[#FFFDF8] p-2 rounded-xl border border-orange-50 group border-orange-200 transition-all shadow-sm">
    <div className="p-3 bg-white text-orange-500 rounded-xl shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="text-[15px] font-bold text-gray-800 tracking-tight leading-none">{title}</h4>
      <p className="text-[13px] text-gray-500 mt-2 leading-tight font-medium">{desc}</p>
    </div>
  </div>
);

// --- HELPER: FAQ ITEM ---
const FAQItem = ({ q, a }) => (
  <details className="group bg-orange-50/20 rounded-xl border border-orange-200 p-2 list-none cursor-pointer">
    <summary className="font-bold flex justify-between items-center text-[15px] text-gray-700">
      {q} <ChevronRight size={20} className="group-open:rotate-90 transition-transform text-orange-400" />
    </summary>
    <p className="text-[14px] text-gray-500 mt-2 pt-2 border-t border-orange-100 leading-relaxed font-medium">{a}</p>
  </details>
);

export default HomePujaBooking;
