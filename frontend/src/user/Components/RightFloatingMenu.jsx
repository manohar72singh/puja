import { Sparkles, Calendar, Heart } from "lucide-react";
import { useState } from "react";

export function RightFloatingMenu() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const items = [
        { label: "Panchang", icon: <Calendar size={16} /> },
        { label: "Kundli", icon: <Heart size={16} /> },
    ];

    // Sabki width yahan se control hogi (Desktop ke liye)
    const fixedWidth = "w-32"; 

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end">
            
            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:flex flex-col items-end">
                {/* Header - Same width as buttons */}
                <div className={`${fixedWidth} bg-orange-600 text-white px-3 py-1.5 rounded-tl-lg border-b border-orange-500 shadow-sm flex items-center justify-between`}>
                    <span className="text-[11px] font-black uppercase tracking-widest">Free</span>
                    <Sparkles size={14} className="animate-pulse" />
                </div>

                {/* Buttons List */}
                <div className="flex flex-col items-end space-y-[2px]">
                    {items.map(({ label, icon }, index) => (
                        <button
                            key={label}
                            className={`
                                flex items-center justify-between 
                                bg-white/95 backdrop-blur-md text-gray-700 
                                border-l border-orange-200 
                                ${fixedWidth} h-11 px-4
                                hover:bg-orange-50 hover:text-orange-600
                                transition-all duration-200 shadow-sm
                                ${index === items.length - 1 ? 'rounded-bl-lg border-b' : 'border-b border-orange-50'}
                            `}
                        >
                            <span className="text-[12px] font-bold tracking-tight">{label}</span>
                            <span className="text-orange-500">{icon}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MOBILE VIEW --- */}
            <div className="md:hidden flex flex-col items-end">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className={`p-3 shadow-2xl transition-all ${
                        isMobileOpen ? "bg-orange-700 rounded-l-none" : "bg-orange-500 rounded-l-full"
                    } text-white`}
                >
                    <Sparkles size={20} />
                </button>

                <div className={`flex flex-col items-end gap-1 mt-1 transition-all duration-300 ${
                    isMobileOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
                }`}>
                    {items.map(({ label, icon }) => (
                        <button
                            key={label}
                            className={`flex items-center justify-between bg-white text-orange-600 border border-orange-200 shadow-lg rounded-l-full h-11 ${fixedWidth} px-4`}
                        >
                            <span className="text-[12px] font-bold">{label}</span>
                            {icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}