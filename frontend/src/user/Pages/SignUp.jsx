import { useState } from 'react';
import { ArrowLeft, User, Mail, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: '',
        gotra: '',
        email: '',
        phone: '',
        otp: '',
        role: 'user'
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
            const res = await fetch(`${API_BASE_URL}/user/signup-request`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) setStep(3);
            else setError(data.message || "Failed to initiate request.");
        } catch (err) {
            setError("Network error. Please try again.");
        } finally { setIsLoading(false); }
    };

    const handleFinalVerify = async (e) => {
        if (e) e.preventDefault();
        if (formData.otp.length !== 6) {
            setError("Please enter 6-digit code.");
            return;
        }
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/user/signup-verify`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.message || "Incorrect OTP.");
            }
        } catch (error) {
            setError("Verification failed.");
        } finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#FFFCF5] font-sans flex flex-col items-center">
            
            {/* Header: Back Button & Logo */}
            <div className="w-full p-6 flex flex-col items-center relative">
                <Link to="/" className="absolute left-6 top-8 flex items-center gap-2 text-[#E79A37] hover:text-orange-600 transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Home
                </Link>

                <div className="flex flex-col items-center mt-2">
                    <img 
                        src="/img/download.jpg" 
                        alt="logo" 
                        className="w-16 h-16 bg-orange-400 p-3 rounded-2xl mb-3 shadow-sm"
                    />
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Join Sri Vedic Puja</h1>
                    <p className="text-sm text-gray-500 mt-1">Begin your spiritual journey with us</p>
                </div>
            </div>

            {/* STEPPER & LABELS CONTAINER - Aligned Correctly */}
            <div className="flex flex-col items-center my-4 w-full max-w-sm">
                {/* 1 2 3 Circles */}
                <div className="flex items-center justify-between w-full px-4 mb-2 relative">
                    {/* Connecting Lines in Background */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -z-10 -translate-y-1/2 px-12">
                        <div className={`h-full transition-all duration-500 ${step === 2 ? 'w-1/2' : step === 3 ? 'w-full' : 'w-0'} bg-[#FFB347]`} />
                    </div>
                    
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all z-10 ${step >= s ? 'bg-orange-400 text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                {/* Stepper Labels - Properly Spaced */}
                <div className="flex justify-between w-full text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    <span className={`w-24 text-center  ${step === 1 ? "text-orange-400" : ""}`}>Personal Info</span>
                    <span className={`w-24 text-center ${step === 2 ? "text-orange-400" : ""}`}>Contact</span>
                    <span className={`w-24 text-center pl-5 ${step === 3 ? "text-orange-400" : ""}`}>Verify</span>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="w-full max-w-xl px-4 pb-6">
                <div className="bg-white rounded-[32px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.18)]
 border border-gray-100 p-8 md:p-12">
                    
                    {error && <p className="mb-4 text-red-500 text-center text-sm font-medium">{error}</p>}

                    {/* STEP 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <div className="text-center">
                                <h2 className="text-2xl font-serif font-bold text-gray-800">Tell us about yourself</h2>
                                <p className="text-gray-500 text-sm mt-1">This helps us personalize your Sankalp</p>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                        <User size={14} className="text-[#E79A37]" /> Name <span className="text-red-400">*</span>
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-5 py-4 bg-[#FFFCF5]/50 border border-gray-200 rounded-xl outline-none focus:border-[#FFB347] transition-all text-gray-700"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                        <span className="text-lg">ॐ</span> Gotra <span className="text-red-400">*</span>
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="e.g., Kashyap, Bharadwaj, Vatsa"
                                        className="w-full px-5 py-4 bg-[#FFFCF5]/50 border border-gray-200 rounded-xl outline-none focus:border-[#FFB347] transition-all text-gray-700"
                                        value={formData.gotra}
                                        onChange={(e) => setFormData({...formData, gotra: e.target.value})}
                                    />
                                    <p className="text-[10px] text-gray-400 italic">Your Gotra is essential for Sankalp during pujas</p>
                                </div>

                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!isStep1Valid}
                                    className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    Continue <span className="text-xl">→</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Contact */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="text-center">
                                <h2 className="text-2xl font-serif font-bold text-gray-800">Contact Details</h2>
                                <p className="text-gray-500 text-sm mt-1">Secure your account with your mobile</p>
                            </div>

                            <div className="space-y-6">
                                {/* Mobile Number */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700">Mobile Number <span className="text-red-400">*</span></label>
                                    <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#FFB347] transition-all">
                                        <span className="bg-gray-50 px-4 py-4 text-gray-500 border-r border-gray-100 font-medium">+91</span>
                                        <input 
                                            type="tel"
                                            maxLength={10}
                                            className="w-full px-4 py-4 outline-none text-gray-700 bg-[#FFFCF5]/50"
                                            placeholder="9876543210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                        />
                                    </div>
                                </div>

                                {/* Email Field Added Back */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                        <Mail size={14} className="text-[#E79A37]" /> Email Address <span className="text-gray-300 text-[9px]">(Optional)</span>
                                    </label>
                                    <input 
                                        type="email"
                                        placeholder="sharma@example.com"
                                        className="w-full px-5 py-4 bg-[#FFFCF5]/50 border border-gray-200 rounded-xl outline-none focus:border-[#FFB347] transition-all text-gray-700"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>

                                <button 
                                    onClick={handleSendOTP}
                                    disabled={isLoading || !isStep2Valid}
                                    className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Send Verification Code"}
                                </button>
                                
                                <button onClick={() => setStep(1)} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#E79A37] transition-colors">Back to Profile</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: OTP Verify */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="text-center">
                                <h2 className="text-2xl font-serif font-bold text-gray-800">Verify OTP</h2>
                                <p className="text-gray-500 text-sm mt-1">Enter the 6-digit code sent to <span className="font-bold text-gray-800">+91 {formData.phone}</span></p>
                            </div>

                            <div className="space-y-6">
                                <input 
                                    type="text"
                                    maxLength={6}
                                    className="w-full px-4 py-5 border border-gray-200 rounded-xl text-center text-3xl font-bold tracking-[0.5em] focus:border-[#FFB347] outline-none transition-all bg-[#FFFCF5]/50"
                                    placeholder="000000"
                                    value={formData.otp}
                                    onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                                />

                                <button 
                                    onClick={handleFinalVerify}
                                    disabled={isLoading || formData.otp.length !== 6}
                                    className="w-full py-4 bg-[#2D1B0B] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Complete Registration"}
                                </button>
                                
                                <button onClick={() => setStep(2)} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#E79A37] transition-colors">Change Phone Number</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mt-4">
                    <p className="text-gray-500 text-sm">
                        Already have an account? <Link to="/signin" className="text-[#E79A37] font-bold hover:underline ml-1">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;