import React, { useState } from 'react';
import { ArrowLeft, Loader2, KeyRound, Flame } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const SignIn = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleAction = async () => {
        if (phoneNumber.length !== 10) {
            setError("Please enter a valid 10-digit number");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/user/login-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber }),
            });
            const data = await response.json();
            if (response.ok) setIsOtpStep(true);
            else setError(data.message || "Account not found. Please join us first.");
        } catch (err) {
            setError("Divine connection interrupted. Check your network.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        if (otp.length !== 6) {
            setError("Please enter the 6-digit sacred code.");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber, otp: otp }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate(from, { replace: true })
            } else {
                setError(data.message || "The code entered is incorrect.");
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF4E1]
            flex items-center justify-center p-4 md:p-8 font-sans">
            {/* Background Aesthetic Blur */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[15%] right-[5%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[35%] h-[35%] bg-yellow-100/40 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_32px_80px_-20px_rgba(45,27,11,0.15)] border border-white flex flex-col md:flex-row overflow-hidden relative z-10">

                {/* LEFT SECTION: Branding */}
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

                        <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">Welcome <br /><span className="text-orange-400 italic">Back Home.</span></h2>
                        <p className="text-orange-100/60 font-light text-lg max-w-xs leading-relaxed">Enter the gateway to authentic Vedic rituals and spiritual growth.</p>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-4 text-xs uppercase tracking-widest text-orange-200/40">
                        <span>Sanatana Dharma • Authenticity • Peace</span>
                    </div>
                </div>

                {/* RIGHT SECTION: Form */}
                <div className="w-full md:w-[58%] p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
                    <div className="max-w-sm mx-auto w-full">

                        {error && (
                            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl animate-bounce-in">
                                {error}
                            </div>
                        )}

                        {!isOtpStep ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-[#2D1B0B] mb-2">Sign In</h3>
                                    <p className="text-gray-500 text-sm">Access your spiritual dashboard via phone.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[11px] uppercase tracking-[0.15em] font-bold text-gray-400 mb-2 block ml-1 group-focus-within:text-orange-600 transition-colors">
                                            Mobile Number
                                        </label>
                                        <div className="flex items-center bg-[#F9F7F2] border-2 border-[#E8E2D9] focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100/50 rounded-2xl overflow-hidden transition-all duration-300">
                                            <div className="px-5 py-4 bg-[#F1EDE5] border-r border-[#E8E2D9] font-bold text-[#2D1B0B] text-lg">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                maxLength={10}
                                                className="w-full px-5 py-4 bg-transparent outline-none text-xl font-bold text-[#2D1B0B] placeholder:text-gray-300"
                                                placeholder="98765 43210"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAction}
                                        disabled={phoneNumber.length < 10 || isLoading}
                                        className="w-full py-5 bg-[#2D1B0B] text-white font-bold rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 disabled:translate-y-0 disabled:shadow-none"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Request Access Code"}
                                    </button>
                                </div>

                                <p className="text-center text-sm text-gray-500">
                                    New here? <Link to="/signup" className="text-orange-600 font-bold hover:text-orange-700 underline underline-offset-4 decoration-orange-200">Create Account</Link>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <KeyRound size={28} className="text-orange-600" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-[#2D1B0B] mb-2">Verify Phone</h3>
                                    <p className="text-gray-500 text-sm">Enter the code sent to <span className="text-[#2D1B0B] font-bold">+91 {phoneNumber}</span></p>
                                </div>

                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        className="w-full py-5 bg-[#F9F7F2] border-2 border-[#E8E2D9] rounded-2xl text-center text-3xl font-black tracking-[0.4em] outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100/50 transition-all text-[#2D1B0B]"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />

                                    <button
                                        onClick={handleLogin}
                                        disabled={isLoading || otp.length < 6}
                                        className="w-full py-5 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Sign In"}
                                    </button>

                                    <button
                                        onClick={() => setIsOtpStep(false)}
                                        className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
                                    >
                                        Change Phone Number
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;