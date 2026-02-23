import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    MapPin,
    ArrowLeft,
    Info,
    Navigation,
    Share2,
    Clock,
    Flame,
    Utensils,
    Sun,
    Moon,
    Sparkles
} from "lucide-react";

const MandirDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mandir, setMandir] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/mandir/${id}`);
                setMandir(response.data);
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    // Timings ke liye icons decide karne ka function
    const getTimingIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes("aarti") || t.includes("deep")) return <Flame size={20} className="text-orange-500" />;
        if (t.includes("bhog") || t.includes("prasad")) return <Utensils size={20} className="text-amber-600" />;
        if (t.includes("opening") || t.includes("morning")) return <Sun size={20} className="text-yellow-500" />;
        if (t.includes("closing") || t.includes("night")) return <Moon size={20} className="text-blue-600" />;
        return <Clock size={20} className="text-orange-500" />;
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF5E9]">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
            <p className="text-orange-800 font-bold animate-pulse">Loading Divine Experience...</p>
        </div>
    );

    if (!mandir) return (
        <div className="text-center py-20 font-bold text-gray-400">Mandir ki jankari uplabdh nahi hai.</div>
    );

    return (
        <div className="bg-[#FBFCFE] min-h-screen font-sans">
            {/* STICKY NAVBAR */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 font-bold text-gray-700 hover:text-orange-600 transition-all"
                    >
                        <div className="p-2 bg-gray-50 rounded-full group-hover:bg-orange-100 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="hidden sm:inline">Vapas Jayein</span>
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="text-orange-600 font-black tracking-widest text-xl italic">SRI MANDIR</span>
                    </div>

                    <button className="p-2 bg-gray-50 rounded-full hover:bg-orange-100 transition-all">
                        <Share2 size={20} className="text-gray-700" />
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* HERO IMAGE SECTION */}
                <div className="relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl mb-12 group">
                    <img
                        src={mandir.image_url_1}
                        alt={mandir.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10 text-white">
                        <div className="flex items-center gap-2 bg-orange-600/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-4 w-fit uppercase tracking-widest">
                            <Sparkles size={14} /> Sacred Destination
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black">{mandir.name}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Summary */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-sm">
                            <div className="flex items-center gap-2 text-orange-600 font-black text-sm uppercase tracking-widest mb-4">
                                <MapPin size={18} fill="currentColor" fillOpacity={0.2} />
                                {mandir.location}
                            </div>
                            <p className="text-2xl text-gray-700 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-6">
                                "{mandir.about}"
                            </p>
                        </div>

                        {/* History Section */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                                    <Info size={28} />
                                </div>
                                Mandir ka Sampurn Itihas
                            </h2>
                            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <p className="text-gray-600 text-lg leading-[2.2] whitespace-pre-line">
                                    {mandir.description}
                                </p>
                            </div>
                        </div>

                        {/* Timings Grid */}
                        {mandir.timings && (
                            <div className="space-y-8 pb-10">
                                <h2 className="text-3xl font-black text-gray-900">Darshan & Aarti Timings</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mandir.timings.split(";").map((item, index) => {
                                        const [title, time] = item.split(":");
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-white border border-gray-100 p-6 rounded-3xl hover:border-orange-200 hover:shadow-md transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl group-hover:bg-orange-50 transition-colors">
                                                        {getTimingIcon(title || "")}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 tracking-tight">
                                                            {title?.trim()}
                                                        </h4>
                                                        <p className="text-orange-600 font-black text-sm mt-0.5">
                                                            {time?.trim()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-2 rounded-full bg-orange-200 group-hover:bg-orange-500 transition-colors" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="relative">
                        <div className="sticky top-28 space-y-6">
                            {/* Navigation Card */}
                            <div className="bg-gray-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                                
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-orange-600 rounded-2xl shadow-lg shadow-orange-900/20">
                                        <Navigation size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl">Visit Shrine</h4>
                                        <p className="text-gray-400 text-sm italic">Pavitra darshan ke liye</p>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Current Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                                            <span className="font-bold text-green-400">Open for Devotees</span>
                                        </div>
                                    </div>

                                    <a
                                        href={mandir.map_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-center bg-orange-600 text-white py-5 rounded-[1.5rem] font-black hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-600/30"
                                    >
                                        OPEN IN GOOGLE MAPS
                                    </a>
                                </div>
                            </div>

                            {/* Additional Info / CTA */}
                            <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100">
                                <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                                    <Sparkles size={18} /> Support Temple
                                </h4>
                                <p className="text-orange-800/70 text-sm leading-relaxed mb-4">
                                    Aap is mandir ki dekh-rekh ke liye sahyog de sakte hain.
                                </p>
                                <button className="w-full py-3 border-2 border-orange-200 text-orange-700 font-bold rounded-2xl hover:bg-orange-100 transition-all">
                                    Donate Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="border-t bg-white py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 font-medium">© 2026 Sri Mandir - Divine Heritage of Bharat</p>
                    <div className="flex gap-8 text-gray-400 font-bold text-sm">
                        <a href="#" className="hover:text-orange-600">Privacy</a>
                        <a href="#" className="hover:text-orange-600">Terms</a>
                        <a href="#" className="hover:text-orange-600">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MandirDetailsPage;