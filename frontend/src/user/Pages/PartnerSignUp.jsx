import { useState, useRef, useEffect } from 'react';
import { 
    ArrowLeft, User, Mail, Loader2, ShieldCheck, 
    Fingerprint, MapPin, Globe, Search, Home, ChevronDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi"
];

const PartnerSignUp = () => {
    const navigate = useNavigate();
    const stateListRef = useRef(null);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showStateList, setShowStateList] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '', gotra: '', phone: '', email: '',
        address: '', city: '', state: '', pincode: '',
        otp: '', role: 'pandit' 
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stateListRef.current && !stateListRef.current.contains(event.target)) {
                setShowStateList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendOTP = async () => {
        if (!formData.name || !formData.phone || !formData.city || !formData.state || !formData.address || !formData.pincode) {
            setError("Kripya sabhi anivarya jankari bharein.");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE_URL}/user/signup-request`, { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) setIsOtpStep(true); 
            else {
                const data = await res.json();
                setError(data.message || "Registration process mein dikkat aayi.");
            }
        } catch (err) {
            setError("Divine connection interrupted. Try again.");
        } finally { setIsLoading(false); }
    };

    const handleFinalVerify = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/user/signup-verify`, { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData) 
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/partner/dashboard');
            } else { setError(data.message || "Invalid OTP code."); }
        } catch (error) { setError("Verification failed."); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F1] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Blurs */}
            <div className="absolute top-[-5%] left-[-5%] w-[350px] h-[350px] bg-orange-200/20 rounded-full blur-[90px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[350px] h-[350px] bg-orange-100/30 rounded-full blur-[90px]" />
            
            <div className="w-full max-w-[520px] z-10">
                <div className="flex justify-start mb-4">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors text-sm font-bold group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-[25px] shadow-xl border border-orange-50/50 p-6 flex flex-col items-center relative">
                    {/* Logo */}
                    <div className="w-18 h-18 bg-white rounded-[22px] flex items-center justify-center shadow-lg mb-4 border border-orange-50 relative z-10 overflow-hidden">
                        <img src="/img/download.jpg" alt="Logo" className="w-full h-full object-cover p-2" />
                    </div>

                    <h1 className="text-2xl font-serif font-black text-[#3D2B1D] text-center tracking-tight">Partner Onboarding</h1>
                    <p className="text-gray-400 text-[10px] text-center mt-1 mb-6 uppercase tracking-[0.2em] font-bold">Authorized Acharya Network</p>

                    {/* Tabs */}
                    <div className="w-full flex bg-[#F6F3F0] p-1.5 rounded-2xl mb-6">
                        <Link to="/partnerSignIn" className="flex-1 py-2.5 text-xs font-bold text-gray-400 text-center hover:text-gray-600">SIGN IN</Link>
                        <button className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-white text-orange-600 shadow-sm cursor-default">REGISTER</button>
                    </div>

                    {error && (
                        <div className="mb-5 w-full p-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-red-700 text-[11px] font-bold uppercase tracking-wide">{error}</p>
                        </div>
                    )}

                    {!isOtpStep ? (
                        <div className="w-full space-y-4">
                            {/* Grid 1 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">Full Name</label>
                                    <div className="flex bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl focus-within:border-orange-500 transition-all">
                                        <User className="ml-4 my-auto text-gray-300" size={18} />
                                        <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D]" placeholder="Pandit Ji" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">Gotra</label>
                                    <div className="flex bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl focus-within:border-orange-500 transition-all">
                                        <Fingerprint className="ml-4 my-auto text-gray-300" size={18} />
                                        <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D]" placeholder="Optional" value={formData.gotra} onChange={(e) => setFormData({...formData, gotra: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            {/* Grid 2 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">Mobile</label>
                                    <div className="flex bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl focus-within:border-orange-500 transition-all">
                                        <span className="pl-4 py-3 text-gray-400 font-black text-xs border-r border-[#F0EBE5] mr-3">+91</span>
                                        <input className="w-full pr-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D]" maxLength={10} placeholder="00000 00000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">Email</label>
                                    <div className="flex bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl focus-within:border-orange-500 transition-all">
                                        <Mail className="ml-4 my-auto text-gray-300" size={18} />
                                        <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D]" placeholder="acharya@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">Ritual Address</label>
                                <div className="flex bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl focus-within:border-orange-500 transition-all">
                                    <Home className="ml-4 my-auto text-gray-300" size={18} />
                                    <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D]" placeholder="Street, Landmark" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                                </div>
                            </div>

                            {/* Combined Location Row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5 relative" ref={stateListRef}>
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">State</label>
                                    <div onClick={() => setShowStateList(!showStateList)} className="flex bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl cursor-pointer py-3 px-3 justify-between items-center transition-all focus-within:border-orange-500">
                                        <span className="text-xs font-bold text-[#3D2B1D] truncate">{formData.state || 'State'}</span>
                                        <ChevronDown size={14} className={`text-gray-300 transition-transform ${showStateList ? 'rotate-180' : ''}`} />
                                    </div>
                                    {showStateList && (
                                        <div className="absolute z-[100] w-52 mt-2 bg-white border border-orange-50 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                                            {INDIAN_STATES.map(state => (
                                                <div key={state} onClick={() => {setFormData({...formData, state}); setShowStateList(false)}} className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer text-xs font-bold text-[#3D2B1D] border-b border-gray-50">{state}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">City</label>
                                    <div className="bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl px-3 py-3 flex items-center">
                                        <input className="w-full bg-transparent outline-none text-xs font-bold text-[#3D2B1D]" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-widest">Pincode</label>
                                    <div className="bg-[#FBF9F7] border border-[#F0EBE5] rounded-xl px-3 py-3 flex items-center">
                                        <input className="w-full bg-transparent outline-none text-xs font-bold text-[#3D2B1D]" maxLength={6} placeholder="Pin" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSendOTP} disabled={isLoading} className="w-full py-4.5 bg-orange-400 text-white font-black rounded-xl shadow-lg hover:bg-orange-500  transition-all flex items-center justify-center text-[11px] uppercase tracking-[0.2em] mt-2 h-14">
                                {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Verification"}
                            </button>
                        </div>
                    ) : (
                        /* OTP Step */
                        <div className="w-full space-y-6 text-center py-4">
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-[#3D2B1D]">Sacred Code</h3>
                                <p className="text-xs text-gray-400">Sent to <span className="text-orange-600 font-bold">+91 {formData.phone}</span></p>
                                <input type="text" maxLength={6} className="w-full py-5 bg-[#FBF9F7] border-2 border-[#F0EBE5] rounded-2xl text-center text-3xl font-black tracking-[0.5em] focus:border-orange-500 outline-none transition-all" placeholder="000000" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})} />
                            </div>
                            <button onClick={handleFinalVerify} disabled={isLoading || formData.otp.length < 6} className="w-full py-4.5 bg-orange-400 text-white font-bold rounded-xl shadow-xl hover:scale-[1.02] transition-all text-xs uppercase tracking-widest h-14 flex items-center justify-center">
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify & Complete"}
                            </button>
                            <button onClick={() => setIsOtpStep(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-600">Modify Details</button>
                        </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-gray-50 w-full flex justify-center">
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50/50 px-4 py-1.5 rounded-full border border-emerald-100/50">
                             <ShieldCheck size={14} strokeWidth={3} /> SECURE ONBOARDING
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerSignUp;