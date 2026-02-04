import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Menu, X, Home, Globe, User, Settings, 
  ShieldCheck, ChevronDown, LogOut, MapPin, HelpCircle 
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded)
        setUser({
          name: decoded.name,
          email: decoded.email || "user@srivedicpuja.com"
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setProfileOpen(false);
    navigate('/');
    window.location.reload();
  };

  const navItems = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/puja", label: "Puja", icon: <Globe size={18} /> },
    { to: "/katha", label: "Katha", icon: <User size={18} /> },
    { to: "/products", label: "Products", icon: <Settings size={18} /> },
    { to: "/pind_dan", label: "Pind Dan", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        scrolled ? "bg-white/90 shadow-lg backdrop-blur-md py-0" : "bg-white/40 backdrop-blur-xl border-b border-white/20 py-1"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[72px]">
          
          {/* LOGO */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/img/download.jpg" alt="Logo" className="h-10 w-10 rounded-lg shadow-sm" />
            <div className="flex flex-col text-left">
              <span className="text-[18px] font-serif font-bold text-[#3b2a1a] leading-tight">Sri Vedic Puja</span>
              <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Your Faith Partner</span>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => 
                `font-bold text-[15px] transition-colors ${isActive ? "text-orange-600" : "text-black hover:text-orange-600"}`
              }>
                {item.label}
              </NavLink>
            ))}
            <li className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
              <div className="flex items-center gap-1 font-bold text-[15px] cursor-pointer hover:text-orange-600">
                Gallery <ChevronDown size={14} className={dropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </div>
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-2 mt-0">
                   {["Temple", "Events", "Aarti"].map(i => <button key={i} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-orange-50">{i}</button>)}
                </div>
              )}
            </li>
          </ul>

          {/* DESKTOP PROFILE / AUTH */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="h-10 w-10 bg-[#F3E5D8] cursor-pointer text-[#D97706] rounded-full flex items-center justify-center font-bold text-lg border-2 border-orange-300 shadow-sm active:scale-95 transition-all"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 text-left">
                      <h4 className="font-bold text-[#2D1B0B] text-[16px]">{user.name}</h4>
                      <p className="text-[13px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2 text-left">
                      {/* MY PROFILE */}
                      <button 
                        onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <User size={18} className="text-gray-400" /> <span className="text-sm font-semibold">My Profile</span>
                      </button>
                      
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors">
                        <ShieldCheck size={18} className="text-gray-400" /> <span className="text-sm font-semibold">Manage Sankalp</span>
                      </button>
                      
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors">
                        <MapPin size={18} className="text-gray-400" /> <span className="text-sm font-semibold">Saved Addresses</span>
                      </button>

                      {/* HELP & SUPPORT */}
                      <button 
                        onClick={() => { navigate('/help'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <HelpCircle size={18} className="text-gray-400" /> <span className="text-sm font-semibold">Help & Support</span>
                      </button>
                    </div>
                    <div className="border-t border-gray-100">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={18} /> <span className="font-bold text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => navigate('/signin')} className="px-6 py-2 rounded-xl border-2 border-orange-500 text-orange-600 font-bold text-sm hover:bg-orange-500 hover:text-white transition-all">Sign In</button>
                <button className="px-6 py-2 rounded-xl bg-[#2D1B0B] text-white font-bold text-sm shadow-md">Partner Login</button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden p-2 text-orange-600 bg-orange-50 rounded-lg" onClick={() => setMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[110] transition-all ${menuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMenuOpen(false)} />
        <div className={`absolute right-0 h-full w-[80%] bg-white shadow-2xl transition-transform duration-500 flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 flex justify-between items-center border-b">
            <span className="font-bold text-[#3b2a1a]">Sri Vedic Puja</span>
            <X onClick={() => setMenuOpen(false)} className="text-gray-400 cursor-pointer" />
          </div>
          
          <div className="flex-1 p-4 space-y-2 text-left">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-4 font-bold text-gray-600 hover:bg-orange-50 rounded-xl">
                {item.icon} {item.label}
              </NavLink>
            ))}
            
            {/* Mobile Profile & Help Links */}
            {user && (
              <>
                <div className="border-t my-2"></div>
                <button onClick={() => { navigate('/profile'); setMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 font-bold text-gray-600 hover:bg-orange-50 rounded-xl">
                  <User size={18} /> My Profile
                </button>
                <button onClick={() => { navigate('/help'); setMenuOpen(false); }} className="w-full flex items-center gap-4 p-4 font-bold text-gray-600 hover:bg-orange-50 rounded-xl">
                  <HelpCircle size={18} /> Help & Support
                </button>
              </>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50">
            {user ? (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
                <div className="flex items-center gap-3 mb-4 text-left">
                  <div className="h-10 w-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">{user.name?.charAt(0)}</div>
                  <div className="overflow-hidden"><p className="font-bold truncate">{user.name}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
                </div>
                <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button onClick={() => {navigate('/signin'); setMenuOpen(false)}} className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200">Sign In</button>
            )}
          </div>
        </div>
      </div>

      <div className="h-[72px] w-full relative -z-10"></div>
    </>
  );
};

export default Navbar;