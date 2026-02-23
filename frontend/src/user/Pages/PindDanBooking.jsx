import React, { useEffect, useState, useRef } from "react";
import {
    MapPin,
    Calendar,
    Heart,
    ShieldCheck,
    ChevronLeft,
    Sparkles,
    ArrowRight,
    Shirt,
    Coffee,
    Flame,
    UtensilsCrossed,
    Loader2,
    Users,
    Shield,
    Lock,
    Plus,
    CheckCircle,
    Ticket,
    Info,
    MessageSquare,
    Box,
    HelpCircle,
    ChevronRight,
    Zap,
    Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const PindDanBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState("Single");
    const [activeTab, setActiveTab] = useState("about");
    const [donations, setDonations] = useState({
        temple: false,
        vastra: false,
        annadan: false,
        deepdan: false,
        brahmin: false,
        gau: false,
    });

    const sections = {
        about: useRef(null),
        benefits: useRef(null),
        contributions: useRef(null),
        faqs: useRef(null),
    };

    useEffect(() => {
        const fetchService = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`${API_BASE_URL}/puja/pind-dan/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (data.success) setService(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handlePindDanPayment = async () => {
        const token = localStorage.getItem("token");
        const currentBookingId = `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        if (!token) {
            navigate("/signin");
            return;
        }
        setIsBooking(true);

        const selectedDonations = Object.keys(donations)
            .filter((key) => donations[key])
            .join(", ");

        const bookingData = {
            bookingId: currentBookingId,
            puja_id: id,
            date: new Date().toISOString().split("T")[0],
            time: service?.dateOfStart
                ? new Date(service.dateOfStart).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "10:00 AM",
            city: service?.location || "Kashi",
            state: "Uttar Pradesh",
            pincode: "221001",
            devoteeName: "Devotee User",
            ticket_type: selectedTicket,
            donations: selectedDonations,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/puja/bookingDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Server crashed");
            }

            const result = await response.json();

            if (result.success) {
                alert(`🙏 Temple Booking Confirmed! Booking ID: ${currentBookingId}`);
                navigate("/my-booking");
            }
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Booking failed: " + error.message);
        } finally {
            setIsBooking(false);
        }
    };

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
            window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
        }
    };

    const contributionList = [
        {
            id: "vastra",
            title: "Vastra Daan",
            price: 251,
            icon: <Shirt size={18} />,
            sub: "Holy cloth offering",
        },
        {
            id: "annadan",
            title: "Annadan",
            price: 501,
            icon: <Coffee size={18} />,
            sub: "Feed the community",
        },
        {
            id: "deepdan",
            title: "Deepdan",
            price: 101,
            icon: <Flame size={18} />,
            sub: "Light the path",
        },
        {
            id: "brahmin",
            title: "Brahmin Bhoj",
            price: 1100,
            icon: <UtensilsCrossed size={18} />,
            sub: "Blessings of Priests",
        },
        {
            id: "gau",
            title: "Gau Seva",
            price: 100,
            icon: <span className="text-xl">🐄</span>,
            sub: "Feed the Gau Mata",
        },
    ];

    const tickets = [
        {
            label: "Single",
            person: "1 person",
            price: Number(service?.single_price || 251),
            icon: <Users size={18} />,
        },
        {
            label: "Couple",
            person: "2 person",
            price: Number(service?.couple_price || 452),
            icon: <Heart size={18} />,
        },
        {
            label: "Family",
            person: "Up to 5",
            price: Number(service?.family_price || 628),
            icon: <Shield size={18} />,
        },
    ];

   const calculateTotal = () => {
    // Ticket array ki jagah ab hum direct service se price le rahe hain
    const base = Number(service?.standard_price) || 0;

    const extra = contributionList.reduce(
        (acc, item) => (donations[item.id] ? acc + item.price : acc),
        0,
    );

    // Temple donation (₹1) aur baaki extras ko base mein add kar rahe hain
    return base + extra + (donations.temple ? 1 : 0);
};

    if (loading)
        return (
            <div className="h-screen flex items-center justify-center bg-[#FFFDF5]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                    <p className="text-orange-900 font-serif italic tracking-widest uppercase text-xs">
                        Preparing Divine Experience
                    </p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#FFF4E1] p-4 md:p-6 text-gray-800">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-orange-700 mb-5 hover:opacity-70 transition-all"
                >
                    <ChevronLeft size={18} /> Back to Selection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 space-y-6">
                        {/* 1. HERO SECTION */}
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
                                    <span className="text-white text-[13px] font-bold uppercase tracking-wider">
                                        Certified Temple Ritual
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. STICKY TAB HEADER */}
                        <nav className="sticky top-[76px] z-40 bg-white border border-orange-200 rounded-xl shadow-md">
                            <div className="flex overflow-x-auto no-scrollbar">
                                {["about", "benefits", "contributions", "faqs"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => scrollToSection(tab)}
                                        className={`flex-1 px-6 py-4 text-[13px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${activeTab === tab ? "text-orange-600 bg-orange-50/50" : "text-gray-400"}`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </nav>

                        {/* 3. ABOUT & BENEFITS BLOCK (Horizontal Section 1) */}
                        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden">
                            <div className="p-7">
                                <section
                                    ref={sections.about}
                                    className="scroll-mt-44 space-y-4"
                                >
                                    <div className="flex flex-col gap-4 mb-6">
                                        <span className="flex items-center gap-2 text-[14px] font-medium text-gray-500">
                                            <MapPin size={16} className="text-orange-500" />{" "}
                                            {service?.address}
                                        </span>
                                        <span className="flex items-center gap-2 text-[13px] font-medium text-gray-500">
                                            <Calendar size={16} className="text-orange-500" />{" "}
                                            {service?.dateOfStart &&
                                                new Date(service.dateOfStart).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest">
                                        <Info size={20} /> About The Ritual
                                    </div>
                                    <p className="text-[16px] text-gray-600 leading-relaxed text-justify">
                                        {service?.description}
                                    </p>
                                </section>
                            </div>

                            <div className="border-t border-orange-100" />

                            <div className="p-7 bg-[#FFFDF8]">
                                <section
                                    ref={sections.benefits}
                                    className="scroll-mt-44 space-y-6"
                                >
                                    <h3 className="text-2xl font-serif font-bold text-gray-800">
                                        Benefits of {service?.puja_name}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <BenefitSmall
                                            icon={<Heart />}
                                            title="Spiritual Peace"
                                            desc="Inner calm through sacred rituals"
                                        />
                                        <BenefitSmall
                                            icon={<Shield />}
                                            title="Protection & Blessings"
                                            desc="Divine protection for family"
                                        />
                                        <BenefitSmall
                                            icon={<Zap />}
                                            title="Prosperity & Success"
                                            desc="Remove obstacles from your path"
                                        />
                                        <BenefitSmall
                                            icon={<Users />}
                                            title="Family Harmony"
                                            desc="Strengthen family bonds"
                                        />
                                        <BenefitSmall
                                            icon={<Sparkles />}
                                            title="Positive Energy"
                                            desc="Purify soul with mantras"
                                        />
                                        <BenefitSmall
                                            icon={<Star />}
                                            title="Karma Purification"
                                            desc="Balance your spiritual energies"
                                        />
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* 4. SACRED CONTRIBUTIONS BLOCK (Separate Horizontal Section) */}
                        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden">
                            <div className="p-7 bg-white">
                                <section
                                    ref={sections.contributions}
                                    className="scroll-mt-44 space-y-6"
                                >
                                    <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest">
                                        <Sparkles size={20} /> Sacred Contributions
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {contributionList.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() =>
                                                    setDonations((p) => ({
                                                        ...p,
                                                        [item.id]: !p[item.id],
                                                    }))
                                                }
                                                className={`flex items-center justify-between p-5 rounded-xl border transition-all shadow-sm ${donations[item.id] ? "border-orange-400 bg-orange-50" : "border-orange-200 bg-white hover:border-orange-300"}`}
                                            >
                                                <div className="flex items-center gap-4 text-left">
                                                    <div
                                                        className={`p-3 rounded-lg transition-all ${donations[item.id] ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-500"}`}
                                                    >
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[15px] font-bold text-gray-800">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-[12px] text-gray-500">
                                                            {item.sub}
                                                        </p>
                                                    </div>
                                                </div>

                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="border-t border-orange-100" />

                            {/* WHATSAPP NOTE (Included in this section) */}
                            <div className="mx-7 my-5 bg-[#FFFCEB] rounded-xl p-5 border border-yellow-200 flex items-start gap-4">
                                <div className="p-2.5 bg-yellow-400 text-white rounded-lg shadow-sm">
                                    <MessageSquare size={22} />
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-bold text-gray-800 leading-none">
                                        Temple Ritual Updates
                                    </h4>
                                    <p className="text-[14px] text-gray-600 mt-2">
                                        The photos and videos of your puja will be shared via{" "}
                                        <span className="font-bold text-gray-900">WhatsApp</span>{" "}
                                        after completion.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 5. FAQ SECTION (Separate Bottom Block) */}
                        <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-7 mb-10">
                            <section ref={sections.faqs} className="scroll-mt-44">
                                <div className="flex items-center gap-2 text-orange-600 font-bold text-[13px] uppercase tracking-widest mb-6">
                                    <HelpCircle size={20} /> Frequently Asked Questions
                                </div>
                                <div className="space-y-4">
                                    <FAQItem
                                        q="I don't know my Gotra, what should I do?"
                                        a="Don't worry! If you don't know your Gotra, our Pandit will use 'Kashyap' Gotra during the Sankalp, as it is traditionally accepted in such cases."
                                    />
                                    <FAQItem
                                        q="Who will perform the Puja?"
                                        a="Experienced Temple Priests (Pujaris) who are well-versed in Vedic traditions will conduct the ritual in your name."
                                    />
                                    <FAQItem
                                        q="How will I know the Puja has been done?"
                                        a="You will receive a video recording of the Sankalp where the priest will mention your name and Gotra clearly."
                                    />
                                    <FAQItem
                                        q="What is the significance of Dakshina?"
                                        a="Dakshina is a symbolic offering to the temple and priests to complete the spiritual exchange of the ritual."
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* SIDEBAR SUMMARY */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start z-30">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-2xl shadow-slate-200/60">

                            {/* 1. Header with Underline */}
                            <div className="mb-8">
                                <h3 className="text-[15px] font-black text-slate-700 uppercase tracking-[0.15em] mb-2">
                                    Booking Summary
                                </h3>
                                <div className="flex gap-1">
                                    <div className="h-1.5 w-12 bg-orange-500 rounded-full" />
                                    <div className="h-1.5 w-4 bg-orange-100 rounded-full" />
                                </div>
                            </div>

                            {/* 2. Pricing Section */}
                            <div className="space-y-6">
                                {/* Standard Price Row */}
                                <div className="flex justify-between items-center">
                                    <span className="text-[14px] font-bold text-slate-400 uppercase tracking-wider">
                                        Standard Booking
                                    </span>
                                    <span className="text-[16px] font-black text-slate-800">
                                        ₹{Number(service?.standard_price).toLocaleString("en-IN")}
                                    </span>
                                </div>

                                {/* Dotted Divider */}
                                <div className="border-t border-dashed border-gray-300 w-full my-2" />

                                {/* Total Amount Row */}
                                <div className="flex justify-between items-start pt-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                                            Total Amount
                                        </span>
                                        <div className="flex items-center gap-1.5 text-emerald-600">
                                            <ShieldCheck size={14} fill="currentColor" className="opacity-20" />
                                            <span className="text-[11px] font-bold">Inclusive of all taxes</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-orange-600 tracking-tighter">
                                            ₹{calculateTotal().toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Action Section */}
                            <div className="mt-10 space-y-6">
                                <button
                                    onClick={() => handlePindDanPayment()}
                                    disabled={isBooking}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-[0.98] group"
                                >
                                    <div className="flex items-center justify-center gap-3 text-[15px] uppercase tracking-[0.1em]">
                                        {isBooking ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                <span>Proceed to Book</span>
                                                <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </button>

                                {/* Footer Text */}
                                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Free cancellation up to 24 hours before
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

const BenefitSmall = ({ icon, title, desc }) => (
    <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-orange-200 group transition-all shadow-sm hover:border-orange-400">
        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div>
            <h4 className="text-[15px] font-bold text-gray-800 tracking-tight leading-none">
                {title}
            </h4>
            <p className="text-[13px] text-gray-500 mt-2 leading-tight font-medium">
                {desc}
            </p>
        </div>
    </div>
);

const FAQItem = ({ q, a }) => (
  <details className="group py-2 cursor-pointer list-none">
    <summary className="flex justify-between items-center font-bold text-[15px] text-gray-700 list-none [&::-webkit-details-marker]:hidden">
      <span className="pr-5">{q}</span>
      <ChevronRight 
        size={18} 
        className="group-open:rotate-90 transition-transform duration-300 text-orange-400 shrink-0" 
      />
    </summary>
    <div className="overflow-hidden">
      <p className="text-[14px] text-gray-500 mt-3 leading-relaxed font-medium animate-in fade-in slide-in-from-top-1">
        {a}
      </p>
    </div>
  </details>
);

export default PindDanBooking;
