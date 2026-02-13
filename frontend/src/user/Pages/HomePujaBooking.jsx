import React, { useState, useRef, useEffect } from "react";
import {
  Clock, Shield, Heart, Briefcase, Users, Box, ChevronRight, Zap, House,
  MessageCircle, ChevronLeft, Star, HelpCircle, Info, ClipboardList,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const HomePujaBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // FIX: Checks if we returned from payment page to keep the toggle state
  const [samagriEnabled, setSamagriEnabled] = useState(
    location.state?.isSamagriSelected !== undefined 
      ? location.state.isSamagriSelected 
      : true
  );

  const [activeTab, setActiveTab] = useState("about");
  const [service, setService] = useState(null);

  const sections = {
    about: useRef(null),
    benefits: useRef(null),
    faqs: useRef(null),
  };

  useEffect(() => {
    const bookPuja = async (id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/bookPuja/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        // Database se aksar array aata hai, isliye data[0]
        setService(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.log("Error booking puja:", error);
      }
    };
    if (id) bookPuja(id);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const [key, ref] of Object.entries(sections)) {
        if (ref.current && scrollPosition >= ref.current.offsetTop && 
            scrollPosition < ref.current.offsetTop + ref.current.offsetHeight) {
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

  // --- CALCULATION LOGIC ---
  const basePrice = Number(service?.standard_price || 0);
  const totalAmount = samagriEnabled ? basePrice + 600 : basePrice;

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 mb-6 transition-colors group">
          <ChevronLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Pujas</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-t-[2rem] overflow-hidden border-t border-x border-orange-200 shadow-sm">
              <div className="relative h-64 md:h-80">
                <img src={`${API_BASE_URL}/uploads/${service?.image_url}`} alt={service?.puja_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-2xl md:text-4xl font-serif font-bold mb-1">{service?.puja_name}</h1>
                  <p className="text-orange-200 text-sm flex items-center gap-2 font-medium">
                    <Star size={14} fill="currentColor" /> {service?.rating || "4.9"} | Certified Vedic Pandits
                  </p>
                </div>
              </div>
            </div>

            <nav className="sticky top-[64px] z-[40] bg-white border border-orange-200 shadow-lg flex overflow-x-auto no-scrollbar rounded-b-2xl mb-8">
              {["about", "benefits", "faqs"].map((tab) => (
                <button key={tab} onClick={() => scrollToSection(tab)}
                  className={`flex-1 px-4 py-4 text-xs md:text-sm font-extrabold capitalize transition-all border-b-4 ${activeTab === tab ? "border-orange-500 text-orange-600 bg-orange-50/50" : "border-transparent text-gray-400"}`}>
                  {tab}
                </button>
              ))}
            </nav>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-orange-200 hover:border-orange-500 transition-all duration-300 flex items-center justify-between shadow-sm group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors"><Box size={24} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Add Complete Samagri Kit</h3>
                    <p className="text-gray-500 text-sm">Pure ghee, flowers, and all ritual items included.</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button onClick={() => setSamagriEnabled(!samagriEnabled)}
                    className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${samagriEnabled ? "bg-orange-500" : "bg-gray-300"}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${samagriEnabled ? "translate-x-7" : "translate-x-0"}`}></div>
                  </button>
                  <span className="text-[10px] font-bold text-orange-600">+₹600</span>
                </div>
              </div>

              <section ref={sections.about} className="scroll-mt-32 pt-2">
                <SectionTitle icon={<Info />} title="About the Ritual" />
                <div className="bg-white p-6 rounded-2xl border border-orange-200 text-gray-600 leading-relaxed shadow-sm">
                  {service?.description}
                </div>
              </section>

              <section ref={sections.benefits} className="scroll-mt-32">
                <SectionTitle title="Spiritual Benefits" icon={<Zap size={18} />} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BenefitCard icon={<Heart size={20} />} title="Spiritual Upliftment" desc="Divine energy channelled from sacred temples to your home." />
                  <BenefitCard icon={<Shield size={20} />} title="Divine Protection" desc="Sought-after blessings to safeguard your family." />
                  <BenefitCard icon={<Box size={20} />} title="Prosperity & Wealth" desc="Attract abundance and success in your life." />
                  <BenefitCard icon={<Users size={20} />} title="Family Harmony" desc="Strengthens bonds and brings peace among family." />
                </div>
              </section>

              <section ref={sections.faqs} className="pb-10 scroll-mt-32 pt-2">
                <SectionTitle icon={<HelpCircle />} title="Frequently Asked Questions" />
                <div className="space-y-3">
                  <FAQItem q="Who will perform the Puja?" a="Experienced Vedic Pandits well-versed in Shastras." />
                  <FAQItem q="I don't know my Gotra?" a="You can use 'Kashyap' as it is the root Gotra for all." />
                  <FAQItem q="Will I get Prasad?" a="Yes, Prasad will be delivered to your registered address." />
                </div>
              </section>
            </div>
          </div>

          <aside className="lg:col-span-1 lg:sticky lg:top-[90px] z-30">
            <div className="bg-white rounded-3xl shadow-xl border border-orange-200 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-orange-100 pb-2">Booking Summary</h2>
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Base Service Fee</span>
                  <span className="text-gray-900 font-bold">₹{basePrice}</span>
                </div>
                {samagriEnabled && (
                  <div className="flex justify-between text-orange-600 font-semibold">
                    <span>Samagri Kit Charge</span>
                    <span>+₹600</span>
                  </div>
                )}
              </div>
              <div className="border-t border-dashed border-orange-200 my-4"></div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-800 font-bold text-lg">Payable Amount</span>
                <span className="text-3xl font-serif font-bold text-orange-500 tracking-tighter">
                  ₹{totalAmount}
                </span>
              </div>
              <button
                onClick={() => navigate(`/homePuja/payment-details/${id}`, { state: { isSamagriSelected: samagriEnabled } })}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all uppercase tracking-wide"
              >
                Book This Puja
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold text-lg uppercase tracking-tight">
    {React.cloneElement(icon, { size: 22 })}
    <h3 className="font-serif">{title}</h3>
  </div>
);

const BenefitCard = ({ icon, title, desc }) => (
  <div className="bg-white p-5 rounded-2xl flex items-start gap-4 border border-orange-200 shadow-sm group">
    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const FAQItem = ({ q, a }) => (
  <details className="group bg-white rounded-xl border border-orange-200 p-4 list-none shadow-sm">
    <summary className="font-bold cursor-pointer flex justify-between items-center text-sm text-gray-700">
      {q} <ChevronRight size={16} className="group-open:rotate-90 transition-transform text-orange-400" />
    </summary>
    <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-orange-50">{a}</p>
  </details>
);

export default HomePujaBooking;