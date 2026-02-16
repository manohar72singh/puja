import React, { useEffect, useState, useRef } from 'react';
import axios from "axios"
import {
  MapPin, Calendar, Heart, ShieldCheck, ChevronLeft, Sparkles, ArrowRight,
  Shirt, Coffee, Flame, UtensilsCrossed, Loader2, Users, Shield, Lock,
  Plus, Info, MessageSquare, Box, HelpCircle, ChevronRight, Zap, Star
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TemplePujaBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState('Single');
  const [activeTab, setActiveTab] = useState("about");
  const [donations, setDonations] = useState({
    temple: false, vastra: false, annadan: false, deepdan: false, brahmin: false, gau: false
  });

  const sections = {
    about: useRef(null),
    benefits: useRef(null),
    contributions: useRef(null),
    faqs: useRef(null)
  };

  useEffect(() => {
    const fetchService = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}/puja/temple-puja/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) setService(data.data[0]);
        // console.log(data);
        
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchService();
  }, [id]);


  const handleSubmit = async() =>{
    try{
      const token = localStorage.getItem("token")
      // fetch(`${API_BASE_URL}/puja/booking-templepuja`,{
      //   method:"POST",
      //   headers
      // })
      axios.post(`${API_BASE_URL}/puja/booking-templepuja`,{
        
      })
    }catch(error){

    }
  }



  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
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
      window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
    }
  };

  const contributionList = [
    { id: 'vastra', title: "Vastra Daan", price: 251, icon: <Shirt size={18} />, sub: "Holy cloth offering" },
    { id: 'annadan', title: "Annadan", price: 501, icon: <Coffee size={18} />, sub: "Feed the community" },
    { id: 'deepdan', title: "Deepdan", price: 101, icon: <Flame size={18} />, sub: "Light the path" },
    { id: 'brahmin', title: "Brahmin Bhoj", price: 1100, icon: <UtensilsCrossed size={18} />, sub: "Blessings of Priests" },
    { id: 'gau', title: "Gau Seva", price: 100, icon: <span className="text-xl">🐄</span>, sub: "Feed the Gau Mata" }
  ];

  const tickets = [
    { label: "Single",person:"1 person", price: Number(service?.single_price || 251), icon: <Users size={18} /> },
    { label: "Couple",person:"2 person", price: Number(service?.couple_price || 452), icon: <Heart size={18} /> },
    { label: "Family",person:"Up to 5", price: Number(service?.family_price || 628), icon: <Shield size={18} /> }
  ];

  const calculateTotal = () => {
    const base = tickets.find(t => t.label === selectedTicket)?.price || 0;
    const extra = contributionList.reduce((acc, item) => donations[item.id] ? acc + item.price : acc, 0);
    return base + extra + (donations.temple ? 1 : 0);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FFFDF5]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
        <p className="text-orange-900 font-serif italic tracking-widest uppercase text-xs">Preparing Divine Experience</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-6 text-gray-800">
      <div className="max-w-6xl mx-auto">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-orange-700 mb-5 hover:opacity-70 transition-all">
          <ChevronLeft size={18} /> Back to Selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div className="lg:col-span-8 space-y-5">

            {/* HERO SECTION */}
            <div className="bg-white rounded-2xl overflow-hidden border border-orange-200 shadow-sm">
              <div className="relative h-64 md:h-80">
                <img src={`${API_BASE_URL}/uploads/${service?.image_url}`} className="w-full h-full object-cover" alt="Puja" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">{service?.puja_name}</h1>
                  <span className="text-white text-[13px] font-bold uppercase tracking-wider">Certified Temple Ritual</span>
                </div>
              </div>
            </div>

            {/* STICKY TAB HEADER */}
            <nav className="sticky top-[76px] z-40 bg-white border border-orange-200 rounded-xl shadow-md">
              <div className="flex overflow-x-auto no-scrollbar">
                {["about", "benefits", "contributions", "faqs"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => scrollToSection(tab)}
                    className={`flex-1 px-6 py-4 text-[13px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${activeTab === tab ? "text-orange-600 bg-orange-50/50" : "text-gray-400"
                      }`}
                  >
                    {tab}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />}
                  </button>
                ))}
              </div>
            </nav>

            <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden mb-10">

              {/* ABOUT SECTION */}
              <div className="p-7">
                <section ref={sections.about} className="scroll-mt-44 space-y-4">
                  <div className="flex flex-col gap-4 mb-6">
                    <span className="flex items-center gap-2 text-[14px] font-medium text-gray-500"><MapPin size={16} className="text-orange-500" /> {service?.address}</span>
                    <span className="flex items-center gap-2 text-[13px] font-medium text-gray-500"><Calendar size={16} className="text-orange-500" /> {service?.dateOfStart && new Date(service.dateOfStart).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest">
                    <Info size={20} /> About The Ritual
                  </div>
                  <p className="text-[16px] text-gray-600 leading-relaxed text-justify">{service?.description}</p>
                </section>
              </div>

              <div className="border-t border-orange-100" />

              {/* BENEFITS SECTION */}
              <div className="p-7 bg-[#FFFDF8]">
                <section ref={sections.benefits} className="scroll-mt-44 space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-800">Benefits of {service?.puja_name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BenefitSmall icon={<Heart />} title="Spiritual Peace" desc="Inner calm through sacred rituals" />
                    <BenefitSmall icon={<Shield />} title="Protection & Blessings" desc="Divine protection for family" />
                    <BenefitSmall icon={<Zap />} title="Prosperity & Success" desc="Remove obstacles from your path" />
                    <BenefitSmall icon={<Users />} title="Family Harmony" desc="Strengthen family bonds" />
                    <BenefitSmall icon={<Sparkles />} title="Positive Energy" desc="Purify soul with mantras" />
                    <BenefitSmall icon={<Star />} title="Karma Purification" desc="Balance your spiritual energies" />
                  </div>
                </section>
              </div>

              <div className="border-t border-orange-100" />

              {/* CONTRIBUTIONS SECTION */}
              <div className="p-7 bg-white">
                <section ref={sections.contributions} className="scroll-mt-44 space-y-6">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest">
                    <Sparkles size={20} /> Sacred Contributions
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contributionList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setDonations(p => ({ ...p, [item.id]: !p[item.id] }))}
                        className={`flex items-center justify-between p-5 rounded-xl border transition-all shadow-sm ${donations[item.id] ? "border-orange-400 bg-orange-50" : "border-orange-200 bg-white hover:border-orange-300"}`}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className={`p-3 rounded-lg transition-all ${donations[item.id] ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-500"}`}>{item.icon}</div>
                          <div>
                            <h4 className="text-[15px] font-bold text-gray-800">{item.title}</h4>
                            <p className="text-[12px] text-gray-500">{item.sub}</p>
                          </div>
                        </div>
                        <span className="text-[15px] font-bold text-orange-600">₹{item.price}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="border-t border-orange-100" />

              {/* WHATSAPP NOTE */}
              <div className="mx-7 my-5 bg-[#FFFCEB] rounded-xl p-5 border border-yellow-200 flex items-start gap-4">
                <div className="p-2.5 bg-yellow-400 text-white rounded-lg shadow-sm">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-gray-800 leading-none">Temple Ritual Updates</h4>
                  <p className="text-[14px] text-gray-600 mt-2">The photos and videos of your puja will be shared via <span className="font-bold text-gray-900">WhatsApp</span> after completion.</p>
                </div>
              </div>

              <div className="border-t border-orange-100" />

              {/* FAQ SECTION */}
              <div className="p-7">
                <section ref={sections.faqs} className="scroll-mt-44">
                  <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest mb-6">
                    <HelpCircle size={20} /> Frequently Asked Questions
                  </div>
                  <div className="space-y-4">
                    <FAQItem q="I don't know my Gotra, what should I do?" a="Don't worry! If you don't know your Gotra, our Pandit will use 'Kashyap' Gotra during the Sankalp, as it is traditionally accepted in such cases." />
                    <FAQItem q="Who will perform the Puja?" a="Experienced Temple Priests (Pujaris) who are well-versed in Vedic traditions will conduct the ritual in your name." />
                    <FAQItem q="How will I know the Puja has been done?" a="You will receive a video recording of the Sankalp where the priest will mention your name and Gotra clearly." />
                    <FAQItem q="What is the significance of Dakshina?" a="Dakshina is a symbolic offering to the temple and priests to complete the spiritual exchange of the ritual." />
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY (DITTO KATHA STYLE) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-[100px] self-start z-30">
            <div className="bg-white rounded-2xl border border-orange-200 p-8 shadow-sm space-y-8">

              {/* Title Section */}
              <div>
                <h2 className="text-[15px] font-bold uppercase tracking-[0.2em] text-gray-700 mb-2">
                  Booking Summary
                </h2>
                <div className="flex gap-1">
                  <div className="h-1 w-12 bg-orange-500 rounded-full" />
                  <div className="h-1 w-4 bg-orange-100 rounded-full" />
                </div>
              </div>

              {/* Ticket Type Selection */}
              <div className="grid grid-cols-3 gap-3">
                {tickets.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSelectedTicket(t.label)}
                    className={`flex flex-col items-center py-4 rounded-xl border transition-all ${selectedTicket === t.label
                      ? "border-orange-500 bg-orange-50 shadow-sm"
                      : "border-orange-300 bg-gray-50 hover:border-orange-200"
                      }`}
                  >
                    <div className={`mb-2 p-2 rounded-lg ${selectedTicket === t.label
                      ? "bg-orange-500 text-white"
                      : "bg-white text-orange-500 border border-orange-200"
                      }`}>
                      {t.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-700">
                      {t.label}
                    </span>
                    <span className='text-[10px]'>{t.person}</span>
                    <span className="text-[11px] font-bold text-orange-600">
                      ₹{t.price}
                    </span>
                  </button>
                ))}
              </div>

              {/* DHARMIC CONTRIBUTION BUTTON */}
              <div className="space-y-4">
                <button
                  onClick={() => scrollToSection("contributions")}
                  className="w-full border border-orange-300 bg-orange-50 hover:bg-orange-100 transition-all rounded-xl py-2 font-bold text-[13px] uppercase tracking-wider text-orange-700"
                >
                  <span className="flex items-center justify-center gap-8">
                    <Heart size={16} className="text-orange-600" />
                    Dharmic Contribution
                  </span>
                </button>


                {/* Selected Contributions */}
                <div className="space-y-2">
                  {contributionList
                    .filter(item => donations[item.id])
                    .map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-[13px] bg-orange-50 px-4 py-2 rounded-lg border border-orange-200"
                      >
                        <span className="font-semibold text-gray-700">
                          {item.title}
                        </span>
                        <span className="font-bold text-orange-600">
                          +₹{item.price}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Final Calculation */}
              <div className="pt-6 border-t border-dashed border-orange-200 space-y-5">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase text-gray-400 tracking-tighter">
                      Final Dakshina
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                        Verified Secure
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-serif font-bold text-orange-600">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsBooking(true)}
                  disabled={isBooking}
                  className="group relative w-full bg-gradient-to-br from-orange-500 to-orange-700 text-white font-bold py-5 rounded-xl shadow-xl hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-[0.15em] text-[13px] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-700 -skew-x-12 -translate-x-full" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isBooking ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        Confirm Ritual <ArrowRight size={16} />
                      </>
                    )}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 py-2">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    PCI DSS Compliant
                  </span>
                </div>
              </div>
            </div>
          </aside>


        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENTS (DITTO STYLE)
const BenefitSmall = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-orange-200 group transition-all shadow-sm hover:border-orange-400">
    <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="text-[15px] font-bold text-gray-800 tracking-tight leading-none">{title}</h4>
      <p className="text-[13px] text-gray-500 mt-2 leading-tight font-medium">{desc}</p>
    </div>
  </div>
);

const FAQItem = ({ q, a }) => (
  <details className="group bg-orange-50/20 rounded-xl border border-orange-200 p-2 list-none cursor-pointer">
    <summary className="font-bold flex justify-between items-center text-[15px] text-gray-700">
      {q} <ChevronRight size={20} className="group-open:rotate-90 transition-transform text-orange-400" />
    </summary>
    <p className="text-[14px] text-gray-500 mt-2 pt-2 border-t border-orange-100 leading-relaxed font-medium">{a}</p>
  </details>
);

export default TemplePujaBooking;