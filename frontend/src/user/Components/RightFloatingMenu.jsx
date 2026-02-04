import { Sparkles } from "lucide-react";

export function RightFloatingMenu() {
    const items = [
        { label: "Panchang" },
        { label: "Kundli Match" },
    ];

    return (
        /* right-0 lagane se space khatam ho jayega */
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end space-y-1">
            
            {/* HEADER - Minimalist Side Label */}
            <div className="bg-orange-500 text-white px-2 py-1 rounded-l-md shadow-sm text-sm font-bold uppercase tracking-tighter mr-0">
                Free Services
            </div>

            {/* LIST - Edge Clinged */}
            <div className="flex flex-col items-end space-y-1">
                {items.map(({ label }) => (
                    <button
                        key={label}
                        className="
                            flex items-center justify-center
                            w-24 md:w-28 h-8
                            bg-orange-300 backdrop-blur-md
                            /* Sirf left side corners round hain taaki right se chipka rahe */
                            rounded-l-md rounded-r-none 
                            shadow-md border border-white/40 border-r-0
                            text-m md:text-sm font-medium
                            transition-all duration-200
                            hover:bg-orange-500 hover:text-white hover:pl-2 /* Hover pe thoda bahar niklega */
                            whitespace-nowrap
                        "
                    >
                        <span className="truncate w-full text-center px-1">
                            {label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}