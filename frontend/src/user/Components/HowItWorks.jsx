import React from 'react';
import { Copy, Share2, Gift } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Puja",
      desc: "Select from our curated list of authentic Vedic ceremonies."
    },
    {
      id: 2,
      title: "Book with E-Sankalp",
      desc: "Enter details for the sacred Sankalp. We handle all the Samagri."
    },
    {
      id: 3,
      title: "Experience Blessings",
      desc: "Our verified Pandit arrives with everything. No hidden costs."
    }
  ];

  return (
    <section className="bg-[#FFF4E1] py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* SECTION TITLE - Smaller & Tight */}
        <h2 className="text-3xl md:text-4xl font-serif text-center text-[#3b2a1a] mb-12">
          How Sri Vedic Puja Works
        </h2>

        {/* STEPS GRID - Tight gap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              {/* COMPACT ICON BOX */}
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md mb-4">
                {step.id}
              </div>
              <h3 className="text-lg font-bold text-[#3b2a1a] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 max-w-[240px] leading-snug">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* REFERRAL CARD - Slim Profile */}
        <div className="max-w-4xl mx-auto bg-[#fff8ec] border border-orange-100 rounded-3xl p-5 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* Gift Icon - Smaller */}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white shrink-0">
                    <Gift size={24} />
                </div>

                {/* Text Content - More compact */}
                <div className="flex-grow text-center md:text-left">
                    <h4 className="text-lg font-bold text-[#3b2a1a]">
                        Refer a Friend, Get Rewarded! 🙏
                    </h4>
                    <p className="text-sm mt-1">
                        <span className="text-orange-500 font-bold">They get 5% OFF</span>, 
                        <span className="text-orange-600 font-bold ml-1">You get 10% Credit</span>
                    </p>
                    
                    <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
                        <span className="text-[12px] text-gray-400">Your code:</span>
                        <span className="bg-orange-50 text-orange-600 px-3 py-0.5 rounded-lg font-bold text-[12px] tracking-widest border border-orange-100">
                            VEDIC2024
                        </span>
                    </div>
                </div>

                {/* Actions - Slimmer buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-orange-200 text-[#3b2a1a] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors">
                        <Copy size={16} />
                        Copy Link
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md">
                        <Share2 size={16} />
                        Share
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;