import React, { useState, useRef, useEffect } from 'react';
import { Clock, Shield, Heart, Briefcase, Users, Box, ChevronRight, Zap, House, MessageCircle, ChevronLeft, Star, HelpCircle, Info, ClipboardList } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

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
    },
];

const HomePujaBooking = () => {
    const [samagriEnabled, setSamagriEnabled] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const navigate = useNavigate();
    const { id } = useParams();

    const sections = {
        about: useRef(null),
        benefits: useRef(null),
        process: useRef(null),
        reviews: useRef(null),
        faqs: useRef(null),
    };

    // Auto-update active tab on scroll
    useEffect(() => {
        const handleScroll = () => {
            // 150px offset (Main Nav + Puja Nav + bit of margin)
            const scrollPosition = window.scrollY + 150;
            for (const [key, ref] of Object.entries(sections)) {
                if (ref.current && 
                    scrollPosition >= ref.current.offsetTop && 
                    scrollPosition < ref.current.offsetTop + ref.current.offsetHeight) {
                    setActiveTab(key);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = sections[sectionId].current;
        if (element) {
            // Main Nav (64px) + Puja Nav (64px) = 128px + safety margin
            const offset = 140; 
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const findService = services.find(s => s.id === Number(id)) || services[0];

    return (
        <div className="min-h-screen bg-[#FFFBF5] p-4 md:p-8 font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                
                {/* BACK BUTTON */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 mb-6 transition-colors group"
                >
                    <ChevronLeft size={18} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to All Pujas</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        
                        {/* HERO IMAGE SECTION */}
                        <div className="bg-white rounded-t-[2rem] overflow-hidden border-t border-x border-orange-200 shadow-sm">
                            <div className="relative h-64 md:h-80">
                                <img src={findService.image} alt={findService.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h1 className="text-2xl md:text-4xl font-serif font-bold mb-1">{findService.title}</h1>
                                    <p className="text-orange-200 text-sm flex items-center gap-2 font-medium">
                                        <Star size={14} fill="currentColor" /> {findService.rating} | Certified Vedic Pandits
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- PUJA STICKY NAVBAR --- */}
                        {/* top-[64px] prevents overlapping with your Main Website Header */}
                        <nav className="sticky top-[64px] z-[40] bg-white border border-orange-200 shadow-lg flex overflow-x-auto no-scrollbar rounded-b-2xl mb-8">
                            {['about', 'benefits', 'process', 'reviews', 'faqs'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => scrollToSection(tab)}
                                    className={`flex-1 px-4 py-4 text-xs md:text-sm font-extrabold capitalize whitespace-nowrap transition-all border-b-4 ${
                                        activeTab === tab 
                                        ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                                        : 'border-transparent text-gray-400 hover:text-orange-400'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>

                        {/* CONTENT SECTIONS */}
                        <div className="space-y-6">
                            
                            {/* Samagri Card */}
                            <div className="bg-white rounded-2xl p-6 border border-orange-200 hover:border-orange-500 transition-all duration-300 flex items-center justify-between shadow-sm group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-50 rounded-xl text-orange-500 border border-orange-100 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Add Complete Samagri Kit</h3>
                                        <p className="text-gray-500 text-sm">Everything from flowers to pure ghee included.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <button onClick={() => setSamagriEnabled(!samagriEnabled)} className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors ${samagriEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${samagriEnabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </button>
                                    <span className="text-[10px] font-bold text-orange-600">+₹600</span>
                                </div>
                            </div>

                            <section ref={sections.about} className="scroll-mt-32 pt-2">
                                <SectionTitle icon={<Info />} title="About the Ritual" />
                                <div className="bg-white p-6 rounded-2xl border border-orange-200 hover:border-orange-500 transition-all duration-300 text-gray-600 leading-relaxed shadow-sm">
                                    {findService.title} is a divine ritual that ensures peace, prosperity, and wealth. Our Pandits are trained to perform this according to the ancient Vedic traditions.
                                </div>
                            </section>

                            <section ref={sections.benefits} className="scroll-mt-32 pt-2">
                                <SectionTitle icon={<Zap />} title="Spiritual Benefits" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <BenefitCard icon={<Heart />} title="Peace of Mind" desc="Creates a harmonious vibe for your home." />
                                    <BenefitCard icon={<Shield />} title="Divine Shield" desc="Safeguards family from negative energy." />
                                </div>
                            </section>

                            <section ref={sections.process} className="scroll-mt-32 pt-2">
                                <SectionTitle icon={<ClipboardList />} title="Booking Process" />
                                <div className="space-y-3">
                                    {["Pandit reaches your home 15 mins early", "Sankalp and Pujan starts", "Katha path and Aarti"].map((step, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-orange-200 hover:border-orange-500 transition-all shadow-sm">
                                            <span className="text-orange-500 font-bold bg-orange-50 h-8 w-8 rounded-full flex items-center justify-center border border-orange-100">{i+1}</span>
                                            <span className="font-medium text-gray-700">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section ref={sections.reviews} className="scroll-mt-32 pt-2">
                                <SectionTitle icon={<Star />} title="User Reviews" />
                                <div className="bg-white p-6 rounded-2xl border border-orange-200 hover:border-orange-500 transition-all shadow-sm">
                                    <div className="flex items-center gap-1 text-orange-400 mb-2">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-gray-600 italic">"Highly professional service. Pandit ji explained every mantra beautifully."</p>
                                    <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">— Rajesh Mehra</p>
                                </div>
                            </section>

                            <section ref={sections.faqs} className="pb-10 scroll-mt-32 pt-2">
                                <SectionTitle icon={<HelpCircle />} title="FAQs" />
                                <div className="space-y-3">
                                    <FAQItem q="Is the Pandit provided by you?" a="Yes, all our Pandits are verified and certified by our temple board." />
                                    <FAQItem q="What if I need to reschedule?" a="You can reschedule for free up to 24 hours before the puja." />
                                </div>
                            </section>

                        </div>
                    </div>

                    {/* Right Column Summary (Sticky) */}
                    {/* top-[90px] ensures it sits below main nav and puja nav level */}
                    <div className="lg:col-span-1 lg:sticky lg:top-[90px] z-30">
                        <div className="bg-white rounded-3xl shadow-xl border border-orange-200 p-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-orange-100 pb-2">Booking Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Base Service Fee</span>
                                    <span className="text-gray-900 font-bold">₹{findService.price}</span>
                                </div>
                                {samagriEnabled && (
                                    <div className="flex justify-between text-sm text-orange-600 font-semibold">
                                        <span>Samagri Kit Charge</span>
                                        <span>+₹600</span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-dashed border-orange-200 my-4"></div>
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-gray-800 font-bold text-lg">Payable Amount</span>
                                <span className="text-3xl font-serif font-bold text-orange-500 tracking-tighter">
                                    ₹{samagriEnabled ? Number(findService.price) + 600 : findService.price}
                                </span>
                            </div>
                            <button 
                                onClick={() => navigate("/payment")}
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-orange-200 active:scale-95 transition-all uppercase tracking-wide"
                            >
                                Book This Puja
                            </button>
                        </div>
                    </div>

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
    <div className="bg-white p-5 rounded-2xl flex items-start gap-4 border border-orange-200 hover:border-orange-500 transition-all duration-300 shadow-sm group">
        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all border border-orange-100">{icon}</div>
        <div>
            <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const FAQItem = ({ q, a }) => (
    <details className="group bg-white rounded-xl border border-orange-200 hover:border-orange-500 transition-all p-4 list-none shadow-sm">
        <summary className="font-bold cursor-pointer flex justify-between items-center text-sm text-gray-700">
            {q} <ChevronRight size={16} className="group-open:rotate-90 transition-transform text-orange-400" />
        </summary>
        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-orange-50">{a}</p>
    </details>
);

export default HomePujaBooking;