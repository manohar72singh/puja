import { useState } from 'react';
import { 
    ArrowLeft, User, Mail, Loader2, ShieldCheck, 
    Fingerprint, MapPin, Globe, Search 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal", "Delhi"
];

const PartnerSignUp = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Form State (Restored with your full address fields + logic fields)
    const [formData, setFormData] = useState({
        name: '', 
        gotra: '', 
        phone: '', 
        email: '',
        address: '', 
        city: '', 
        state: '', 
        otp: '',
        role: 'pandit' 
    });

    const [showStateList, setShowStateList] = useState(false);

    // Validations
    const isStep1Valid = formData.name.trim().length >= 3;
    const isStep2Valid = formData.phone.length === 10;
    const isStep3Valid = formData.address.length > 5 && formData.city.length >= 2 && formData.state.length >= 2;

    // --- FUNCTIONALITY ---

    const handleSendOTP = async () => {
        if (!isStep3Valid) {
            setError("Please complete all location details.");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch("http://localhost:5000/user/signup-request", { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) setStep(4); 
            else setError(data.message || "Failed to initiate request.");
        } catch (err) {
            setError("Divine connection interrupted. Please check your network.");
        } finally { setIsLoading(false); }
    };

    
    const handleFinalVerify = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) { 
        setError("Please enter the 6-digit sacred code."); 
        return; 
    }
    setIsLoading(true);
    setError("");
    try {
        const response = await fetch("http://localhost:5000/user/signup-verify", { 
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) 
        });
        console.log(formData)
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            if(formData.role === 'pandit') {
                navigate('/partnerDashboard'); 
            } else {
                navigate('/dashboard');
            }
        } else { 
            setError(data.message || "The code does not match."); 
        }
    } catch (error) { 
        setError("Connection failed. Please try again."); 
    } finally { 
        setIsLoading(false); 
    }
};

    return (
        <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4 md:p-8 font-sans">
            {/* Background Texture */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]" />

            <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(194,65,12,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 border border-orange-100">
                
                {/* LEFT SECTION: Branding (RESTORED FULLY) */}
                <div className="w-full md:w-[38%] bg-orange-400 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
                    
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-orange-200 hover:text-white transition-all uppercase tracking-widest mb-12">
                            <ArrowLeft size={14} /> Exit Portal
                        </Link>
                        
                        <div className="mb-8">
                            <svg className="w-16 h-16 text-orange-200 mb-5 drop-shadow-lg" viewBox="0 0 122.88 122.56" fill="currentColor">
                                <path d="M117.92,122.22a34.87,34.87,0,0,1-9.47-5.81C94.13,103.65,97.07,90.13,96.42,73L71.51,71.84c-.11,6.5-.25,15.29-.56,21.52-.3,6,.24,14.7-4.41,19.12-8.4,8-39.22-2-57.2,6-2.42,1.09-4.68,3.27-7.24,3-.82-.09-1.95-.57-2.1-1.52.77-9.84,9.77-20.2,24.16-23.09l26.21-1L51.16,72c-6.69-.11-14.62-.25-21.33-.59-6-.3-13.77-.4-18.2-5.06C8.24,62.79,7.2,57.45,7.7,49.89a184.82,184.82,0,0,0,.56-21C8,21.49,7.8,16.75,4.69,9.82,3.6,7.4.82,4.36,1.1,1.81A1.58,1.58,0,0,1,2.61.31c9.48,1.85,21.76,12.52,22.71,24.33l1,25.82H50.76c.19-7.37.27-27,2.18-33.5a12.46,12.46,0,0,1,3.34-5.72c9.85-9.35,39.74.16,57.09-7.63,2.43-1.08,5.46-3.86,8-3.59a1.59,1.59,0,0,1,1.49,1.51C117.7,28.13,92.87,25.2,72,26.4V51.66c6.69.11,14.23.25,20.94.59,6,.3,13.2.31,17.62,5,7.1,7.47,4,27,4.34,37.73.23,7.42-.36,12.18,3.18,18.9.72,1.37,1.87,3,2.8,4.54,1.77,2.94,0,5-2.91,3.83ZM84.06,78.54a6,6,0,1,1-6,6,6,6,0,0,1,6-6Zm-45.28,0a6,6,0,1,1-6,6,6,6,0,0,1,6-6ZM84.06,32.15a6,6,0,1,1-6,6,6,6,0,0,1,6-6Zm-45.28,0a6,6,0,1,1-6,6,6,6,0,0,1,6-6Z"/>
                            </svg>
                            <h1 className="text-2xl font-serif font-bold text-white italic">Pitri-Seva</h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-200 font-bold">Partner Network Initiation</p>
                        </div>
                        
                        <h2 className="text-4xl font-serif leading-tight mb-6 text-white">Join the <br/><span className="text-orange-200 italic font-medium">Vedic Circle.</span></h2>
                        <p className="text-orange-50/70 font-light text-lg max-w-xs">Onboard as an authorized Acharya and manage your rituals digitally.</p>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/20 flex items-center gap-3">
                        <ShieldCheck size={18} className="text-orange-200" />
                        <span className="text-[10px] uppercase tracking-widest text-orange-100 font-bold">Secure Partner Portal</span>
                    </div>
                </div>

                {/* RIGHT SECTION: Form */}
                <div className="w-full md:w-[62%] p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-xl mx-auto w-full">
                        
                        {/* Stepper (Restored with your Part 0x style) */}
                        <div className="flex items-center gap-4 mb-12">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className="flex-1">
                                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-orange-500' : 'bg-orange-50'}`} />
                                    <span className={`text-[9px] mt-2 block uppercase tracking-widest font-black ${step === s ? 'text-orange-700' : 'text-gray-300'}`}>Part 0{s}</span>
                                </div>
                            ))}
                        </div>

                        {/* Error Alert Box (Added) */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl">
                                {error}
                            </div>
                        )}

                        {/* STEP 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-[#4A3728]">Acharya Identity</h3>
                                    <p className="text-[#8C7A6B] text-sm font-medium">Please provide your full name as per official records.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-2 block">Full Name</label>
                                        <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 rounded-2xl overflow-hidden transition-all">
                                            <User className="ml-5 text-gray-400" size={20} />
                                            <input className="w-full px-4 py-4 bg-transparent outline-none text-lg font-bold text-[#4A3728]" placeholder="Pandit Ji's Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-2 block">Gotra (Optional)</label>
                                        <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 rounded-2xl overflow-hidden transition-all">
                                            <Fingerprint className="ml-5 text-gray-400" size={20} />
                                            <input className="w-full px-4 py-4 bg-transparent outline-none text-lg font-bold text-[#4A3728]" placeholder="e.g., Vashistha" value={formData.gotra} onChange={(e) => setFormData({...formData, gotra: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setStep(2)} disabled={!isStep1Valid} className="w-full py-5 bg-orange-500 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all disabled:opacity-30">Continue Initiation</button>
                            </div>
                        )}

                        {/* STEP 2: Contact Details */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-[#4A3728]">Contact Portal</h3>
                                    <p className="text-[#8C7A6B] text-sm font-medium">How should we send you puja bookings?</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-2 block">Mobile Number</label>
                                        <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 rounded-2xl overflow-hidden transition-all">
                                            <div className="px-5 py-4 bg-[#F4F1ED] border-r border-[#E8E2D9] font-bold text-[#4A3728]">+91</div>
                                            <input className="w-full px-4 py-4 bg-transparent outline-none text-xl font-bold text-[#4A3728]" maxLength={10} placeholder="00000 00000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-2 block">Email (Optional)</label>
                                        <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 rounded-2xl overflow-hidden transition-all">
                                            <Mail className="ml-5 text-gray-400" size={20} />
                                            <input className="w-full px-4 py-4 bg-transparent outline-none text-lg font-bold text-[#4A3728]" placeholder="acharya@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="px-6 py-5 border-2 border-[#E8E2D9] rounded-2xl text-[#8C7A6B] hover:bg-gray-50 transition-all"><ArrowLeft size={20} /></button>
                                    <button onClick={() => setStep(3)} disabled={!isStep2Valid} className="flex-1 py-5 bg-orange-500 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all disabled:opacity-30">Continue</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Address (RESTORED WITH ALL AUTOCOMPLETE LOGIC) */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-[#4A3728]">Vedic Location</h3>
                                    <p className="text-[#8C7A6B] text-sm font-medium">Where is your main Dharamshala or Temple?</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-2 block">Full Address</label>
                                        <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 rounded-2xl overflow-hidden transition-all">
                                            <MapPin className="ml-5 text-gray-400" size={20} />
                                            <input className="w-full px-4 py-4 bg-transparent outline-none font-bold text-[#4A3728]" placeholder="Area, Landmark, Pincode" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                                        </div>
                                    </div>

                                    {/* STATE DROPDOWN (RESTORED) */}
                                    <div className="relative group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-2 block">State</label>
                                        <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 rounded-2xl overflow-hidden transition-all">
                                            <Globe className="ml-5 text-gray-400" size={18} />
                                            <input 
                                                className="w-full px-4 py-4 bg-transparent outline-none font-bold text-[#4A3728]" 
                                                placeholder="Select State" 
                                                value={formData.state} 
                                                onFocus={() => setShowStateList(true)}
                                                onChange={(e) => {
                                                    setFormData({...formData, state: e.target.value});
                                                    setShowStateList(true);
                                                }} 
                                            />
                                        </div>
                                        {showStateList && (
                                            <div className="absolute z-50 w-full mt-2 bg-white border border-orange-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                                                {INDIAN_STATES.filter(s => s.toLowerCase().includes(formData.state.toLowerCase())).map(state => (
                                                    <div 
                                                        key={state} 
                                                        onClick={() => {
                                                            setFormData({...formData, state: state});
                                                            setShowStateList(false);
                                                        }} 
                                                        className="px-5 py-3 hover:bg-orange-50 cursor-pointer font-bold text-[#4A3728] text-sm border-b border-orange-50 last:border-0"
                                                    >
                                                        {state}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#8C7A6B] mb-2 block">City</label>
                                        <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 rounded-2xl overflow-hidden transition-all">
                                            <Search className="ml-5 text-gray-400" size={18} />
                                            <input className="w-full px-4 py-4 bg-transparent outline-none font-bold text-[#4A3728]" placeholder="City Name" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="px-6 py-5 border-2 border-[#E8E2D9] rounded-2xl text-[#8C7A6B] hover:bg-gray-50 transition-all"><ArrowLeft size={20} /></button>
                                    <button 
                                        onClick={handleSendOTP} 
                                        disabled={isLoading || !isStep3Valid} 
                                        className="flex-1 py-5 bg-orange-600 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Register"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: OTP Verification (Integrated with your theme) */}
                        {step === 4 && (
                            <div className="space-y-8 animate-in zoom-in-95 text-center">
                                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-100">
                                    <ShieldCheck size={40} className="text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-[#4A3728]">Sacred Verification</h3>
                                    <p className="text-[#8C7A6B] text-sm font-medium mt-2">Enter the code sent to <br/><span className="text-[#4A3728] font-black">+91 {formData.phone}</span></p>
                                </div>
                                <input 
                                    className="w-full py-5 bg-[#FCFAF7] border-2 border-[#E8E2D9] rounded-2xl text-center text-4xl font-black tracking-[0.4em] outline-none focus:bg-white focus:border-orange-500 transition-all text-[#4A3728]" 
                                    maxLength={6} 
                                    placeholder="000000"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})} 
                                />
                                <button 
                                    onClick={handleFinalVerify} 
                                    disabled={isLoading || formData.otp.length !== 6}
                                    className="w-full py-5 bg-orange-600 text-white font-bold rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Complete Initiation"}
                                </button>
                                <button onClick={() => setStep(2)} className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest hover:text-orange-600 transition-colors">Change Contact Details</button>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                            <p className="text-[#8C7A6B] text-sm font-medium">Already a registered Acharya? <Link to="/partnerSignIn" className="text-orange-600 font-bold hover:underline">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnerSignUp;