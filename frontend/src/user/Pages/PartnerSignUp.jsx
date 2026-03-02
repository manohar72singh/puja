import { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft, User, Mail, Loader2, ShieldCheck,
    Fingerprint, Home, ChevronDown, Plus
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
        otp: '', role: 'pandit',
        panditType: 'Standard', // Naya field dropdown ke liye
        document: null         // Naya field file ke liye
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

    // Dropdown change handle karne ke liye
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // File change handle karne ke liye
    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, document: e.target.files[0] }));
    };

    const handleSendOTP = async () => {
        // Validation mein dropdown aur file check add kar sakte hain
        if (!formData.name || !formData.phone || !formData.city || !formData.state || !formData.address || !formData.pincode || !formData.document) {
            setError("Kripya sabhi jankari bharein aur document upload karein.");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            // OTP request ke liye JSON theek hai, bas dropdown data add kar dein
            const res = await fetch(`${API_BASE_URL}/user/signup-request`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    document: null // OTP step par file ki zarurat nahi hoti
                })
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
            // 1. FormData banayein
            const dataToSend = new FormData();

            // 2. Loop karke saara text data add karein
            Object.keys(formData).forEach(key => {
                if (key !== 'document') {
                    dataToSend.append(key, formData[key]);
                }
            });

            // 3. File add karein (Multer 'document' field name dhoondega)
            if (formData.document) {
                dataToSend.append('document', formData.document);
            }

            const response = await fetch(`${API_BASE_URL}/user/signup-verify`, {
                method: "POST",
                // Note: FormData bhejte waqt 'Content-Type' header NAHI lagana chahiye
                body: dataToSend
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/partner/dashboard');
            } else {
                setError(data.message || "Invalid OTP code.");
            }
        } catch (error) {
            setError("Verification failed.");
        } finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F1] flex flex-col items-center p-4 relative overflow-x-hidden font-sans">
            {/* Background Blurs */}
            <div className="absolute top-[-5%] left-[-5%] w-[300px] h-[300px] bg-orange-200/20 rounded-full blur-[80px]" />

            <div className="w-full max-w-[500px] z-10 mt-4">
                <div className="flex justify-start mb-4">
                    <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors text-xs font-bold group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Website
                    </Link>
                </div>

                {/* Main Card with Darker Shadow */}
                <div className="bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-orange-50/50 p-5 md:p-8 flex flex-col items-center relative">

                    {/* Logo Section */}
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 border border-gray-100 overflow-hidden">
                        <img src="/img/download.jpg" alt="Logo" className="w-full h-full object-cover p-2" />
                    </div>

                    <h1 className="text-xl md:text-2xl font-serif font-black text-[#3D2B1D] text-center">Partner Onboarding</h1>
                    <p className="text-gray-400 text-[9px] md:text-[10px] text-center mt-1 mb-6 uppercase tracking-[0.2em] font-bold">Authorized Acharya Network</p>

                    {/* Tabs */}
                    <div className="w-full flex bg-[#F6F3F0] p-1 rounded-xl mb-6">
                        <Link to="/partnerSignIn" className="flex-1 py-2 text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">Sign In</Link>
                        <button className="flex-1 py-2 text-[10px] font-black rounded-lg bg-white text-orange-600 shadow-sm cursor-default uppercase tracking-widest">Register</button>
                    </div>

                    {error && (
                        <div className="mb-5 w-full p-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-red-700 text-[10px] font-bold uppercase">{error}</p>
                        </div>
                    )}

                    {!isOtpStep ? (
                        <div className="w-full space-y-4">
                            {/* Grid 1: Name & Gotra */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-wider">Full Name</label>
                                    <div className="flex bg-[#FBF9F7] border border-gray-300 rounded-xl focus-within:border-orange-500 transition-all">
                                        <User className="ml-3 my-auto text-gray-300" size={16} />
                                        <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D] placeholder:font-normal placeholder:text-gray-300" placeholder="Enter name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-wider">Gotra</label>
                                    <div className="flex bg-[#FBF9F7] border border-gray-300 rounded-xl focus-within:border-orange-500 transition-all">
                                        <Fingerprint className="ml-3 my-auto text-gray-300" size={16} />
                                        <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D] placeholder:font-normal placeholder:text-gray-300" placeholder="Optional" value={formData.gotra} onChange={(e) => setFormData({ ...formData, gotra: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Grid 2: Mobile & Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-wider">Mobile</label>
                                    <div className="flex bg-[#FBF9F7] border border-gray-300 rounded-xl focus-within:border-orange-500 transition-all overflow-hidden">
                                        <span className="pl-3 py-3 text-gray-400 font-black text-xs border-r border-gray-300 pr-2">+91</span>
                                        <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D]" maxLength={10} placeholder="00000 00000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-wider">Email</label>
                                    <div className="flex bg-[#FBF9F7] border border-gray-300 rounded-xl focus-within:border-orange-500 transition-all">
                                        <Mail className="ml-3 my-auto text-gray-300" size={16} />
                                        <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D] placeholder:font-normal placeholder:text-gray-300" placeholder="acharya@mail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* PANDIT TYPE DROPDOWN */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-wider">Select Pandit Type</label>
                                    <select
                                        name="panditType"
                                        value={formData.panditType}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:ring-1 focus:ring-orange-400 outline-none font-medium text-[14px]"
                                    >
                                        <option value="Standard">Standard Pandit</option>
                                        <option value="Senior">Senior Pandit</option>
                                        <option value="Acharya">Acharya</option>
                                    </select>
                                </div>

                                {/* FILE UPLOAD FIELD */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-wider">Upload Identity/Cert</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex items-center justify-between w-full p-3 rounded-xl border border-dashed border-gray-300 bg-orange-50/50 cursor-pointer hover:bg-orange-100 transition-all"
                                        >
                                            <span className="text-[13px] text-gray-500 font-medium truncate">
                                                {formData.document ? formData.document.name : "Choose file..."}
                                            </span>
                                            <Plus size={18} className="text-orange-500" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#8C7A6B] uppercase ml-1 tracking-wider">Ritual Address</label>
                                <div className="flex bg-[#FBF9F7] border border-gray-300 rounded-xl focus-within:border-orange-500 transition-all">
                                    <Home className="ml-3 my-auto text-gray-300" size={16} />
                                    <input className="w-full px-3 py-3 bg-transparent outline-none text-sm font-bold text-[#3D2B1D] placeholder:font-normal placeholder:text-gray-300" placeholder="Street, Landmark" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                </div>
                            </div>

                            {/* Combined Location Row: Mobile Optimized to stack on very small screens */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1 relative" ref={stateListRef}>
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase tracking-wider">State</label>
                                    <div onClick={() => setShowStateList(!showStateList)} className="flex bg-[#FBF9F7] border border-gray-300 rounded-xl cursor-pointer py-3 px-3 justify-between items-center transition-all focus-within:border-orange-500">
                                        <span className="text-xs font-bold text-[#3D2B1D] truncate">{formData.state || 'State'}</span>
                                        <ChevronDown size={14} className={`text-gray-300 transition-transform ${showStateList ? 'rotate-180' : ''}`} />
                                    </div>
                                    {showStateList && (
                                        <div className="absolute z-[100] w-full sm:w-52 mt-1 bg-white border border-gray-300 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                                            {INDIAN_STATES.map(state => (
                                                <div key={state} onClick={() => { setFormData({ ...formData, state }); setShowStateList(false) }} className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer text-xs font-bold text-[#3D2B1D] border-b border-gray-50">{state}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase tracking-wider">City</label>
                                    <div className="bg-[#FBF9F7] border border-gray-300 rounded-xl px-3 py-3 flex items-center">
                                        <input className="w-full bg-transparent outline-none text-xs font-bold text-[#3D2B1D]" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#8C7A6B] uppercase tracking-wider">Pincode</label>
                                    <div className="bg-[#FBF9F7] border border-gray-300 rounded-xl px-3 py-3 flex items-center">
                                        <input className="w-full bg-transparent outline-none text-xs font-bold text-[#3D2B1D]" maxLength={6} placeholder="Pin" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })} />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSendOTP} disabled={isLoading} className="w-full py-4 mt-6 bg-orange-400 text-white font-black rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center text-[10px] uppercase tracking-[0.2em] h-14">
                                {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Verification"}
                            </button>
                        </div>
                    ) : (
                        /* OTP Step */
                        <div className="w-full space-y-6 text-center py-4">
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-[#3D2B1D]">Sacred Code</h3>
                                <p className="text-xs text-gray-400">Sent to <span className="text-orange-600 font-bold">+91 {formData.phone}</span></p>
                                <input type="text" maxLength={6} className="w-full py-4 bg-[#FBF9F7] border-2 border-gray-300 rounded-2xl text-center text-3xl font-black tracking-[0.5em] focus:border-orange-500 outline-none transition-all" placeholder="000000" value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })} />
                            </div>
                            <button onClick={handleFinalVerify} disabled={isLoading || formData.otp.length < 6} className="w-full py-4 bg-orange-400 text-white font-bold rounded-xl shadow-xl active:scale-[0.98] transition-all text-xs uppercase tracking-widest h-14 flex items-center justify-center">
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Verify & Complete"}
                            </button>
                            <button onClick={() => setIsOtpStep(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-600">Modify Details</button>
                        </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 w-full flex justify-center">
                        <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 bg-emerald-50/50 px-4 py-1.5 rounded-full border border-emerald-100/50">
                            <ShieldCheck size={12} strokeWidth={3} /> SECURE ONBOARDING
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 mb-4 text-center">
                <p className="text-gray-400 text-xs">
                    Need help? <span className="text-orange-600 font-bold cursor-pointer">Contact Support</span>
                </p>
            </div>
        </div>
    );
};

export default PartnerSignUp;