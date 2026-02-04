import { NavLink } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight 
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    services: [
      { label: "Book a Puja", to: "/puja" },
      { label: "Vedic Katha", to: "/katha" },
      { label: "Pind Dan", to: "/pind_dan" },
      { label: "Pooja Products", to: "/products" },
    ],
    support: [
      { label: "About Us", to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "FAQs", to: "/faqs" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
    community: [
      { label: "Temple Gallery", to: "/gallery" },
      { label: "Mantra Library", to: "/mantras" },
      { label: "Panchang", to: "/panchang" },
      { label: "Volunteer", to: "/join" },
    ]
  };

  return (
    <footer className="bg-orange-200 border-t border-orange-100">
      {/* MAIN FOOTER SPACE */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* 1. BRAND SECTION (4 columns) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="flex items-center gap-3">
              <img src="/img/download.jpg" alt="Logo" className="h-12 w-12 rounded-xl shadow-md" />
              <span className="text-2xl font-serif font-bold text-[#3b2a1a]">
                Sri Vedic <span className="text-orange-500">Puja</span>
              </span>
            </div>
            <p className="text-gray-600 text-base leading-relaxed max-w-sm">
              Connecting you with divine traditions through verified Pandits and sacred rituals, 
              bringing spiritual peace to your modern lifestyle.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white rounded-full text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. LINKS SECTIONS (6 columns total) */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-[#3b2a1a] mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <NavLink to={link.to} className="text-gray-500 hover:text-orange-600 transition-colors text-sm">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#3b2a1a] mb-6">Explore</h4>
              <ul className="space-y-4">
                {footerLinks.community.map((link) => (
                  <li key={link.label}>
                    <NavLink to={link.to} className="text-gray-500 hover:text-orange-600 transition-colors text-sm">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-[#3b2a1a] mb-6">Support</h4>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <NavLink to={link.to} className="text-gray-500 hover:text-orange-600 transition-colors text-sm">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. CONTACT SECTION (3 columns) */}
          <div className="lg:col-span-3 flex flex-col space-y-6">
            <h4 className="font-bold text-[#3b2a1a] mb-2">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin size={18} className="text-orange-500 shrink-0" />
                <span>123 Spiritual Way, Vedic Valley, <br />Haridwar, Uttarakhand</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={18} className="text-orange-500 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <span>support@poojamandir.com</span>
              </div>
            </div>
            
            {/* Newsletter Input */}
            <div className="relative mt-4">
              <input 
                type="text" 
                placeholder="Subscribe to Newsletter" 
                className="w-full bg-white border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT AREA */}
        <div className="mt-20 pt-8 border-t border-orange-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2026 Pooja Mandir. All rights reserved. Made with ❤️ for the spiritual community.
          </p>
          <div className="flex gap-6">
            <button className="text-xs text-gray-400 hover:text-[#3b2a1a]">Terms of Service</button>
            <button className="text-xs text-gray-400 hover:text-[#3b2a1a]">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;