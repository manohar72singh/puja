import { Sparkles, Calendar, Heart } from "lucide-react";
import { useState } from "react";

export function RightFloatingMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const items = [
        { label: "Panchang", icon: <Calendar size={13} /> }, // Icon size thoda badhaya
        { label: "Kundli", icon: <Heart size={13} /> },
    ];

    return (
        <div
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
            onMouseEnter={() =>
                window.innerWidth < 1024 &&
                window.innerWidth >= 768 &&
                setIsOpen(true)
            }
            onMouseLeave={() =>
                window.innerWidth < 1024 &&
                window.innerWidth >= 768 &&
                setIsOpen(false)
            }
        >
            {/* ===== Desktop ===== */}
            <div className="hidden lg:block">
                {/* w-36 ko w-40 kiya aur padding badhayi */}
                <div className="bg-white border border-orange-100 shadow-md rounded-l-xl p-2 w-28 space-y-1.5">
                    <div className="text-[12px] font-bold gap-2 tracking-widest text-orange-600 uppercase flex items-center px-2 mb-1">
                        <Sparkles size={12} />
                        Free
                    </div>

                    {items.map(({ label, icon }) => (
                        <button
                            key={label}
                            className="flex items-center justify-between w-25 px-1 py-1 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all text-[13px] font-medium"
                        >
                            <span className="flex items-center"> {/* Exact 4px gap */}
                                {label}
                            </span>
                            <span className="text-orange-500">{icon}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ===== Tablet ===== */}
            <div className="hidden md:flex  lg:hidden items-center">

                {/* Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-orange-600 text-white gap-2 w-8 py-3 flex flex-col items-center justify-center rounded-l-lg shadow-md gap-2"
                >
                    <Sparkles size={14} />

                    <div className="flex flex-col items-center justify-center leading-[1.1]">
                        <span className="text-[10px] font-black uppercase">F</span>
                        <span className="text-[10px] font-black uppercase">R</span>
                        <span className="text-[10px] font-black uppercase">E</span>
                        <span className="text-[10px] font-black uppercase">E</span>
                    </div>
                </button>

                {/* Slide Panel */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "w-28 opacity-100" : "w-0 opacity-0"
                        }`}
                >
                    <div className="bg-white border border-orange-100 shadow-sm p-2 space-y-1">
                        {items.map(({ label, icon }) => (
                            <button
                                key={label}
                                className="flex items-center justify-between w-full px-2 py-2 rounded-md text-gray-700 hover:bg-orange-50 transition-all text-[12px] font-medium"
                            >
                                <span className="flex items-center gap-[4px]">
                                    {label}
                                </span>
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            {/* ===== Mobile ===== */}
            <div className="md:hidden flex items-center">

                {/* Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-orange-600 text-white gap-2 w-8 py-3 flex flex-col items-center justify-center rounded-l-lg shadow-md gap-2"
                >
                    <Sparkles size={14} />

                    <div className="flex flex-col items-center justify-center leading-[1.1]">
                        <span className="text-[10px] font-black uppercase">F</span>
                        <span className="text-[10px] font-black uppercase">R</span>
                        <span className="text-[10px] font-black uppercase">E</span>
                        <span className="text-[10px] font-black uppercase">E</span>
                    </div>
                </button>

                {/* Slide Panel */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "w-28 opacity-100" : "w-0 opacity-0"
                        }`}
                >
                    <div className="bg-white border border-orange-100 shadow-sm p-2 space-y-1">
                        {items.map(({ label, icon }) => (
                            <button
                                key={label}
                                className="flex items-center justify-between w-full px-2 py-2 rounded-md text-gray-700 hover:bg-orange-50 transition-all text-[12px] font-medium"
                            >
                                <span className="flex items-center gap-[4px]">
                                    {label}
                                </span>
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}