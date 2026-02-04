import { useState } from 'react';
import { ArrowLeft, User, Mail, Loader2, ShieldCheck,Fingerprint, Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        gotra: '',
        email: '',
        phone: '',
        otp: ''
    });

    const navigate = useNavigate();

    // Validation Helpers
    const isStep1Valid = formData.name.trim().length >= 3;
    const isStep2Valid = formData.phone.length === 10;

    const handleSendOTP = async () => {
        if (!isStep2Valid) {
            setError("Please enter a valid 10-digit phone number.");
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
            if (res.ok) setStep(3); 
            else setError(data.message || "Failed to initiate request.");
        } catch (err) {
            setError("Divine connection interrupted. Please check your network.");
        } finally { setIsLoading(false); }
    };

    const handleFinalVerify = async (e) => {
        e.preventDefault();
        if(formData.otp.length !== 6) { setError("Please enter the 6-digit sacred code."); return; }
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5000/user/signup-verify", { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formData.phone, otp: formData.otp })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/'); 
            } else { setError(data.message || "The code does not match."); }
        } catch (error) { setError("Verification failed. Try again."); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#FFF4E1]
 flex items-center justify-center p-4 md:p-8 selection:bg-orange-100 font-sans">
            {/* Background Aesthetic Blur */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] right-[5%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[35%] h-[35%] bg-yellow-100/40 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_32px_80px_-20px_rgba(45,27,11,0.15)] border border-white flex flex-col md:flex-row overflow-hidden relative z-10">
                
                {/* LEFT SECTION */}
                <div className="w-full md:w-[42%] bg-[#2D1B0B] p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                        <span className="text-[45rem] font-serif -rotate-12">ॐ</span>
                    </div>

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-orange-200/50 hover:text-orange-400 transition-colors uppercase tracking-[0.2em] mb-12">
                            <ArrowLeft size={16} /> Back to Temple
                        </Link>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Flame size={24} fill="white" className="text-white" />
                            </div>
                            <h1 className="text-2xl font-serif font-bold tracking-tight">Sri Vedic Puja</h1>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">Begin Your <br/><span className="text-orange-400 italic">Devotion.</span></h2>
                        <p className="text-orange-100/60 font-light text-lg max-w-xs leading-relaxed">Join our community of seekers in the sacred digital space.</p>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-orange-200/40 font-bold">
                        <ShieldCheck size={16} />
                        <span>Secure & Sacred Gateway</span>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="w-full md:w-[58%] p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-white">
                    <div className="max-w-md mx-auto w-full">
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 mb-12">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex-1 flex flex-col gap-2">
                                    <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-orange-500 shadow-sm' : 'bg-gray-100'}`} />
                                    <span className={`text-[9px] uppercase tracking-widest font-bold ${step === s ? 'text-[#2D1B0B]' : 'text-gray-300'}`}>Part 0{s}</span>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {/* STEP 1: Personal Identity */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-[#2D1B0B] mb-2">Devotee Profile</h3>
                                    <p className="text-gray-500 text-sm">Tell us who you are in this sacred space.</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="group">
                                        <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 block ml-1">Full Name <span className="text-orange-500">*</span></label>
                                        <div className="flex items-center bg-[#F9F7F2] border-2 border-[#E8E2D9] focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100/50 rounded-2xl overflow-hidden transition-all duration-300">
                                            <User className="ml-5 text-gray-400 group-focus-within:text-orange-500" size={20} />
                                            <input 
                                                className="w-full px-4 py-4 bg-transparent outline-none text-lg font-bold text-[#2D1B0B] placeholder:text-gray-300" 
                                                placeholder="Arjun Sharma" 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                                value={formData.name} 
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 block ml-1">Gotra <span className="text-gray-300 text-[9px]">(Optional)</span></label>
                                        <div className="flex items-center bg-[#F9F7F2] border-2 border-[#E8E2D9] focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100/50 rounded-2xl overflow-hidden transition-all duration-300">
                                            <Fingerprint className="ml-5 text-gray-400 group-focus-within:text-orange-500" size={20} />
                                            <input 
                                                className="w-full px-4 py-4 bg-transparent outline-none text-lg font-bold text-[#2D1B0B] placeholder:text-gray-300" 
                                                placeholder="e.g. Kashyap" 
                                                onChange={(e) => setFormData({...formData, gotra: e.target.value})} 
                                                value={formData.gotra} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setStep(2)} 
                                    disabled={!isStep1Valid}
                                    className="w-full py-5 bg-[#2D1B0B] text-white font-bold rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
                                >
                                    Continue Journey <ArrowLeft className="rotate-180" size={18} />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Contact Details */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-[#2D1B0B] mb-2">Digital Connection</h3>
                                    <p className="text-gray-500 text-sm">Provide your mobile for secure access.</p>
                                </div>
                                <div className="space-y-5">
                                    <div className="group">
                                        <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 block ml-1">Phone Number <span className="text-orange-500">*</span></label>
                                        <div className="flex items-center bg-[#F9F7F2] border-2 border-[#E8E2D9] focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100/50 rounded-2xl overflow-hidden transition-all duration-300">
                                            <div className="px-5 py-4 bg-[#F1EDE5] border-r border-[#E8E2D9] font-bold text-[#2D1B0B] text-lg">+91</div>
                                            <input 
                                                type="tel"
                                                maxLength={10}
                                                className="w-full px-5 py-4 bg-transparent outline-none text-xl font-bold text-[#2D1B0B] placeholder:text-gray-300" 
                                                placeholder="98765 43210" 
                                                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                                                value={formData.phone} 
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2 block ml-1">Email <span className="text-gray-300 text-[9px]">(Optional)</span></label>
                                        <div className="flex items-center bg-[#F9F7F2] border-2 border-[#E8E2D9] focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100/50 rounded-2xl overflow-hidden transition-all duration-300">
                                            <Mail className="ml-5 text-gray-400 group-focus-within:text-orange-500" size={20} />
                                            <input 
                                                type="email"
                                                className="w-full px-4 py-4 bg-transparent outline-none text-lg font-bold text-[#2D1B0B] placeholder:text-gray-300" 
                                                placeholder="sharma@example.com" 
                                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                                value={formData.email} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="px-6 py-5 border-2 border-[#E8E2D9] rounded-2xl text-gray-400 hover:bg-gray-50 transition-all">
                                        <ArrowLeft size={24} />
                                    </button>
                                    <button 
                                        onClick={handleSendOTP} 
                                        disabled={isLoading || !isStep2Valid}
                                        className="flex-1 py-5 bg-orange-600 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: OTP Verification */}
                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck size={32} className="text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-[#2D1B0B] mb-2">Final Awakening</h3>
                                    <p className="text-gray-500 text-sm">Enter the code sent to <br/><span className="text-[#2D1B0B] font-bold">+91 {formData.phone}</span></p>
                                </div>
                                <input 
                                    className="w-full py-5 bg-[#F9F7F2] border-2 border-[#E8E2D9] rounded-2xl text-center text-4xl font-black tracking-[0.4em] outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100/50 transition-all text-[#2D1B0B]" 
                                    maxLength={6} 
                                    placeholder="000000"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})} 
                                />
                                <button 
                                    onClick={handleFinalVerify} 
                                    disabled={isLoading || formData.otp.length !== 6}
                                    className="w-full py-5 bg-[#2D1B0B] text-white font-bold rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:translate-y-0"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Complete Initiation"}
                                </button>
                                <button onClick={() => setStep(2)} className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors">Change Phone Number</button>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                            <p className="text-gray-400 text-sm">Already a seeker? <Link to="/signin" className="text-orange-600 font-bold hover:text-orange-700 underline underline-offset-4 decoration-orange-200">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;