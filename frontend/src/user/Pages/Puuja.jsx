import React, { useState, useRef } from 'react';
import {
    MapPin, Calendar, Clock, Users, CheckCircle,
    Heart, ShieldCheck, ChevronRight, Sparkles,
    ArrowRight, Shirt, Coffee, Flame, UtensilsCrossed
} from 'lucide-react';

const Puuja = () => {
    const [selectedTicket, setSelectedTicket] = useState('Single');
    const [donations, setDonations] = useState({
        temple: false, vastra: false, annadan: false, deepdan: false, brahmin: false, gau: false
    });
    const dharmicRef = useRef(null);

    const tickets = [
        { label: "Single", price: 251, persons: "1 Person" },
        { label: "Couple", price: 452, persons: "2 Persons" },
        { label: "Family", price: 628, persons: "Up to 5" }
    ];

    const dharmicItems = [
        { id: 'vastra', title: "Vastra Daan", desc: "Donate clothes to the needy", price: 251, icon: <Shirt size={18} /> },
        { id: 'annadan', title: "Annadan", desc: "Provide meals to the hungry", price: 501, icon: <Coffee size={18} /> },
        { id: 'deepdan', title: "Deepdan", desc: "Light lamps at sacred temples", price: 101, icon: <Flame size={18} /> },
        { id: 'brahmin', title: "Brahmin Bhoj", desc: "Feed Brahmins after the ceremony", price: 1100, icon: <UtensilsCrossed size={18} /> },
    ];

    const calculateTotal = () => {
        let total = tickets.find(t => t.label === selectedTicket).price;
        if (donations.temple) total += 1;
        if (donations.vastra) total += 251;
        if (donations.annadan) total += 501;
        if (donations.deepdan) total += 101;
        if (donations.brahmin) total += 1100;
        if (donations.gau) total += 100;
        return total;
    };

    const toggleDonation = (id) => setDonations(prev => ({ ...prev, [id]: !prev[id] }));

    // Reusable card style for high visibility
    const cardStyle = "bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200";

    return (
        <div className="min-h-screen bg-[#FFF4E1] text-[#2D2D2D] font-sans antialiased pb-20">

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 1. NAVIGATION & HERO */}
                        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600">
                            <ChevronRight className="rotate-180" size={16} /> All Group Pujas
                        </button>

                        {/* MAIN HERO CARD */}
                        <div className={`overflow-hidden ${cardStyle} !rounded-[1.5rem]`}>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1605640840605-14ac1855827b"
                                    className="w-full h-[300px] md:h-[400px] object-cover"
                                    alt="Puja Event"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8">
                                    <span className="bg-orange-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md text-white mb-3 inline-block shadow-lg">
                                        Featured
                                    </span>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                        Mahashivratri Grand Puja
                                    </h1>
                                </div>
                            </div>

                            {/* Event Meta Bar */}
                            <div className="p-6 bg-white flex flex-wrap items-center gap-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <MapPin size={18} className="text-orange-400" /> Varanasi
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <Calendar size={18} className="text-orange-400" /> Wed, Jan 28
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <Clock size={18} className="text-orange-400" /> 6:00 PM
                                </div>
                            </div>
                        </div>

                        {/* 2. GROUPED DIV: DESCRIPTION, BENEFITS & INCLUSIONS */}
                        <div className={`${cardStyle} p-8 space-y-8`}>
                            <div>
                                <div className="bg-[#FFF9C4] border border-[#FDD835] p-3 rounded-xl flex items-center justify-center gap-2 text-[#AF6000] font-bold text-sm mb-4">
                                    <Clock size={18} /> Event Started!
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">About the Puja</h3>
                                <p className="text-gray-600 font-medium">Night-long worship of Lord Shiva for peace, prosperity, and spiritual growth.</p>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold mb-4">Benefits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[

                                        { title: "Spiritual Upliftment", desc: "Divine energy from temples", icon: <Heart className="text-orange-500" /> },

                                        { title: "Divine Protection", desc: "Blessings for family", icon: <ShieldCheck className="text-orange-500" /> },

                                        { title: "Collective Merit", desc: "Group worship power", icon: <Users className="text-orange-500" /> },

                                        { title: "Access Anywhere", desc: "Join from home", icon: <MapPin className="text-orange-500" /> }

                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl border border-orange-100/50">
                                            <div className="bg-white p-2.5 rounded-lg shadow-sm">{benefit.icon}</div>
                                            <div>
                                                <h4 className="font-bold text-sm">{benefit.title}</h4>
                                                <p className="text-xs text-gray-500 uppercase font-bold">{benefit.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-lg font-bold mb-4">What's Included</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                                    {["Live HD streaming", "Real-time darshan", "7-day recording", "Personal Sankalp","E-Prasad (optional)","WhatsApp reminder"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                            <CheckCircle size={18} className="text-green-500" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. GROUPED DIV: DHARMIC CONTRIBUTIONS */}
                        <div ref={dharmicRef} className={`${cardStyle} p-8 space-y-6 scroll-mt-28`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <div className="bg-orange-500 p-1.5 rounded-full text-white shadow-md"><Heart size={14} fill="currentColor" /></div>
                                        Dharmic Contributions
                                    </h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Complete your Sankalp</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dharmicItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleDonation(item.id)}
                                        className={`p-5 flex justify-between items-center transition-all cursor-pointer rounded-xl border-2 ${donations[item.id] ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${donations[item.id] ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                                                {donations[item.id] && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <div className="text-orange-500">{item.icon}</div>
                                            <div>
                                                <h4 className="font-bold text-sm">{item.title}</h4>
                                                <span className="text-orange-600 font-black text-sm">₹{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Clean, Single-Container Gau Seva Section */}
                            <div
                                onClick={() => toggleDonation('gau')}
                                className={`p-5 flex justify-between items-center transition-all cursor-pointer rounded-xl border-2 ${donations.gau
                                    ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/10'
                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Selection Circle */}
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${donations.gau ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                        }`}>
                                        {donations.gau && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>

                                    {/* Emoji */}
                                    <span className="text-2xl">🐄</span>

                                    {/* Text Content */}
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 leading-tight">
                                            Complete your Sankalp with Gau Seva
                                        </h4>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                                            Feed a cow on your behalf — an auspicious addition
                                        </p>
                                    </div>
                                </div>

                                {/* Price */}
                                <span className="font-bold text-orange-600 text-sm">₹100</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="lg:col-span-4 lg:block">

                        <div className={`sticky top-24 p-8 ${cardStyle} !rounded-[1.5rem] z-10 shadow-lg`}>
                            <h3 className="text-lg font-bold mb-6 text-gray-800">Select Ticket Type</h3>
                            <div className="grid grid-cols-3 gap-2 mb-8">
                                {tickets.map((t) => (
                                    <button
                                        key={t.label}
                                        onClick={() => setSelectedTicket(t.label)}
                                        className={`flex flex-col items-center py-5 rounded-2xl transition-all border-2 ${selectedTicket === t.label ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 bg-gray-50 text-gray-400'
                                            }`}
                                    >
                                        <Users size={20} />
                                        <span className="text-[11px] font-bold mt-2">{t.label}</span>
                                        <span className="text-[9px] font-bold opacity-60 uppercase">{t.persons}</span>
                                        <span className="text-sm font-black mt-1">₹{t.price}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <p
                                    onClick={() => {
                                        dharmicRef.current?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start',
                                        });
                                    }}
                                    className="cursor-pointer inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest
                                     text-orange-500 hover:text-orange-600 transition-all
                                     hover:underline underline-offset-4
                                     animate-pulse"
                                >
                                    <Heart size={14} fill="currentColor" />
                                    Dharmic Contributions
                                </p>

                                <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{selectedTicket} Ticket</span>
                                    <span className="text-gray-900 font-black text-base tracking-tighter">₹{tickets.find(t => t.label === selectedTicket).price}</span>
                                </div>

                                <div className="flex items-center justify-between py-4 border-y border-gray-100">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={donations.temple} onChange={() => toggleDonation('temple')} className="w-4 h-4 accent-orange-500" />
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Temple Donation</span>
                                    </label>
                                    <span className="text-xs font-black text-orange-500">+₹1</span>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-4xl font-black text-orange-600 tracking-tighter">₹{calculateTotal()}</span>
                                </div>

                                <p className="text-center text-[11px] font-black text-orange-400 uppercase tracking-[0.2em]">🔥 58 spots remaining</p>

                                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-200/50 flex items-center justify-center gap-2 transition-all active:scale-[0.97]">
    <span className="text-sm tracking-wide">Pay ₹{calculateTotal()}</span>
    <ArrowRight size={18} />
</button>

                                <div className="flex justify-center gap-6 pt-6 opacity-40">
                                    <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={12} /> Secure</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Sparkles size={12} /> Best Value</span>
                                </div>
                            </div>
                        </div>

                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Puuja;