import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight, ChevronLeft, Star, HelpCircle, Info, Box,
  Heart, Shield, Zap, Users, ShieldCheck, CheckCircle, MessageSquare, MapPin, Sparkles
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const KathaPujaBooking = () => {
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
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-orange-700 mb-5 hover:opacity-70 transition-all">
          <ChevronLeft size={18} /> Back to Selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
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

            {/* STICKY TAB HEADER */}
            <nav className="sticky top-[76px] z-40 bg-white border border-orange-200 rounded-xl shadow-md">
              <div className="flex overflow-x-auto no-scrollbar">
                {["about", "benefits", "faqs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => scrollToSection(tab)}
                    className={`flex-1 px-6 py-4 text-[13px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${
                      activeTab === tab ? "text-orange-600 bg-orange-50/50" : "text-gray-400"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />}
                  </button>
                ))}
              </div>
            </nav>

            {/* CONSOLIDATED MAIN BOX */}
            <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden mb-10">
              
              {/* Samagri Toggle */}
              <div className="p-6 flex items-center justify-between bg-orange-50/20 group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white text-orange-600 rounded-lg shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all border border-orange-50">
                    <Box size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-gray-800 tracking-tight">Add Complete Samagri Kit</h3>
                    <p className="text-gray-500 text-[13px]">Pure ghee, flowers, and all ritual items included.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[15px] font-bold text-orange-600">+₹600</span>
                  <button 
                    onClick={() => setSamagriEnabled(!samagriEnabled)}
                    className={`w-14 h-7 flex items-center rounded-full px-1 transition-colors ${samagriEnabled ? "bg-orange-500" : "bg-gray-300"}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow transition-transform ${samagriEnabled ? "translate-x-7" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>

              <div className="border-t border-orange-100" />

              {/* About Section */}
              <div className="p-7">
                <section ref={sections.about} className="scroll-mt-44 space-y-4">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest">
                    <Info size={20} /> About The Ritual
                  </div>
                  <p className="text-[16px] text-gray-600 leading-relaxed text-justify">
                    {service?.description}
                  </p>
                </section>
              </div>

              <div className="border-t border-orange-100" />

              {/* Benefits Section */}
              <div className="p-7 bg-[#FFFDF8]">
                <section ref={sections.benefits} className="scroll-mt-44 space-y-6">
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
              </div>

              <div className="border-t border-orange-100" />

              {/* WhatsApp Note */}
              <div className="mx-7 my-5 bg-[#FFFCEB] rounded-xl p-5 border border-yellow-200 flex items-start gap-4">
                <div className="p-2.5 bg-yellow-400 text-white rounded-lg shadow-sm">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-gray-800 leading-none">Pandit Details via WhatsApp</h4>
                  <p className="text-[14px] text-gray-600 mt-2">
                    Your assigned Pandit's contact will be shared on <span className="font-bold text-gray-900">WhatsApp</span> on the day of your booking.
                  </p>
                </div>
              </div>

              <div className="border-t border-orange-100" />

              {/* FAQ Section */}
              <div className="p-7">
                <section ref={sections.faqs} className="scroll-mt-44">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest mb-6">
                    <HelpCircle size={20} /> Frequently Asked Questions
                  </div>
                  <div className="space-y-4">
                    <FAQItem q="I don't know my Gotra, what should I do?" a="Don't worry! If you don't know your Gotra, our Pandit will use 'Kashyap' Gotra during the Sankalp, as it is traditionally accepted in such cases." />
                    <FAQItem q="Who will perform the Puja?" a="Experienced Vedic Pandits who are well-versed in Shastras and certified for performing complex rituals will conduct your puja." />
                    <FAQItem q="What will be done in this Puja?" a="The puja includes the main ritual (Katha/Havan), Ganesh Pujan, Sankalp, and Aarti. All steps are followed as per Vedic traditions." />
                    <FAQItem q="How will I know the Puja has been done in my name?" a="The Pandit will take your name and Gotra during the 'Sankalp' at the beginning of the puja, dedicated specifically to your family." />
                    <FAQItem q="What will I get after the Puja is done?" a="After completion, you will receive the divine blessings, sacred Prasad (if samagri is selected), and a peaceful spiritual environment in your home." />
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY */}
          <aside className="lg:col-span-4 lg:sticky lg:top-[100px] self-start z-30 transition-all">
            <div className="bg-white rounded-2xl border border-orange-200 p-8 shadow-sm space-y-8">
               <div>
                <h2 className="text-[15px] font-bold uppercase tracking-[0.2em] text-gray-700 mb-2">Booking Summary</h2>
                <div className="flex gap-1">
                  <div className="h-1 w-12 bg-orange-500 rounded-full" />
                  <div className="h-1 w-4 bg-orange-100 rounded-full" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between text-[16px] font-medium text-gray-500">
                  <span>Service Fee</span>
                  <span className="text-gray-900 font-bold">₹{basePrice}</span>
                </div>
                {samagriEnabled && (
                  <div className="flex justify-between text-[16px] font-medium text-orange-600 border-t border-orange-50 pt-4">
                    <span className="flex items-center gap-2"><Box size={18} /> Samagri Kit</span>
                    <span className="font-bold">+₹600</span>
                  </div>
                )}
                <div className="pt-6 border-t border-dashed border-orange-200 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase text-gray-400">Total Amount</span>
                    <span className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1"><Shield size={10} /> Safe & Secure</span>
                  </div>
                  <span className="text-4xl font-serif font-bold text-orange-600">₹{totalAmount}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={() => navigate(`/katha-jaap/payment-details/${id}`, { state: { isSamagriSelected: samagriEnabled } })}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-[13px]">
                  Book This Puja
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 uppercase bg-gray-50 py-3 rounded-lg border border-gray-100">
                  <ShieldCheck size={14} className="text-green-500" /> Secure SSL Payment
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const BenefitSmall = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-orange-200 group transition-all shadow-sm hover:border-orange-400">
    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm border border-orange-50">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="text-[15px] font-bold text-gray-800 tracking-tight leading-none">{title}</h4>
      <p className="text-[13px] text-gray-500 mt-2 leading-tight font-medium">{desc}</p>
    </div>
  </div>
);

const FAQItem = ({ q, a }) => (
  <details className="group bg-orange-50/20 rounded-xl border border-orange-200 p-5 list-none cursor-pointer transition-all hover:border-orange-300">
    <summary className="font-bold flex justify-between items-center text-[15px] text-gray-700 list-none">
      {q} <ChevronRight size={20} className="group-open:rotate-90 transition-transform text-orange-400" />
    </summary>
    <div className="overflow-hidden">
      <p className="text-[14px] text-gray-500 mt-4 pt-4 border-t border-orange-200 leading-relaxed font-medium">{a}</p>
    </div>
  </details>
);

export default KathaPujaBooking;