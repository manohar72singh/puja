import { useState } from 'react';
import { ArrowLeft, Loader2, KeyRound, Briefcase, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
const API_BASE_URL = "http://localhost:5000";


const PartnerSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // STEP 1: OTP Request bhejna (Role 'pandit' ke saath)
  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/login-request`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            phone: phoneNumber, 
            role: 'pandit' // Pandit portal se sirf pandit login ho sakein
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsOtpStep(true);
      } else {
        // Backend se aane wala message dikhayega (e.g. "User not found")
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Server connection failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: OTP Verify karke Login karna
  const handleVerifyLogin = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      // Backend route /login-verify se match kar diya
      const res = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp: otp })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        
        // Final role check redirection ke liye
        if (data.role === 'pandit') {
            navigate('/partner/dashboard');
        } else {
            setError("You don't have Acharya permissions.");
        }
      } else {
        setError(data.message || "The code does not match.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]" />

      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(194,65,12,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 border border-orange-100">

        {/* LEFT SECTION: Branding */}
        <div className="w-full md:w-[42%] bg-orange-400 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-orange-200 hover:text-white transition-all uppercase tracking-widest mb-12">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="mb-8">
              <svg className="w-16 h-16 text-orange-200 mb-5 drop-shadow-lg" viewBox="0 0 122.88 122.56" fill="currentColor">
                <path d="M117.92,122.22a34.87,34.87,0,0,1-9.47-5.81C94.13,103.65,97.07,90.13,96.42,73L71.51,71.84c-.11,6.5-.25,15.29-.56,21.52-.3,6,.24,14.7-4.41,19.12-8.4,8-39.22-2-57.2,6-2.42,1.09-4.68,3.27-7.24,3-.82-.09-1.95-.57-2.1-1.52.77-9.84,9.77-20.2,24.16-23.09l26.21-1L51.16,72c-6.69-.11-14.62-.25-21.33-.59-6-.3-13.77-.4-18.2-5.06C8.24,62.79,7.2,57.45,7.7,49.89a184.82,184.82,0,0,0,.56-21C8,21.49,7.8,16.75,4.69,9.82,3.6,7.4.82,4.36,1.1,1.81A1.58,1.58,0,0,1,2.61.31c9.48,1.85,21.76,12.52,22.71,24.33l1,25.82H50.76c.19-7.37.27-27,2.18-33.5a12.46,12.46,0,0,1,3.34-5.72c9.85-9.35,39.74.16,57.09-7.63,2.43-1.08,5.46-3.86,8-3.59a1.59,1.59,0,0,1,1.49,1.51C117.7,28.13,92.87,25.2,72,26.4V51.66c6.69.11,14.23.25,20.94.59,6,.3,13.2.31,17.62,5,7.1,7.47,4,27,4.34,37.73.23,7.42-.36,12.18,3.18,18.9.72,1.37,1.87,3,2.8,4.54,1.77,2.94,0,5-2.91,3.83ZM84.06,78.54a6,6,0,1,1-6,6,6,6,0,0,1,6-6Zm-45.28,0a6,6,0,1,1-6,6,6,6,0,0,1,6-6ZM84.06,32.15a6,6,0,1,1-6,6,6,6,0,0,1,6-6Zm-45.28,0a6,6,0,1,1-6,6,6,6,0,0,1,6-6Z" />
              </svg>
              <h1 className="text-2xl font-serif font-bold text-white italic">Pitri-Seva</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-orange-200 font-bold">Authenticated Acharya Portal</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6 text-white">Digital <br /><span className="text-orange-200 italic font-medium text-5xl">Dharmshala.</span></h2>
            <p className="text-orange-50/70 font-light text-lg max-w-xs leading-relaxed">Organize Vedic rituals, track Pind-Dan bookings, and manage Yajman records.</p>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/20 flex items-center gap-3">
            <ShieldCheck size={18} className="text-orange-200" />
            <span className="text-[10px] uppercase tracking-widest text-orange-100 font-bold">Authorized Pandit Access</span>
          </div>
        </div>

        {/* RIGHT SECTION: Form */}
        <div className="w-full md:w-[58%] p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            {error && (
               <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold rounded-r-xl animate-in slide-in-from-top-2 duration-300">
                  {error}
               </div>
            )}

            {!isOtpStep ? (
              <div className="space-y-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100">
                    <Briefcase size={12} /> Acharya Login
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#4A3728] mb-2">Pranam, Pandit Ji</h3>
                  <p className="text-[#8C7A6B] text-sm font-medium">Please enter your mobile to access the portal.</p>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-[#8C7A6B] mb-3 block ml-1 group-focus-within:text-orange-700 transition-colors">Registered Mobile</label>
                    <div className="flex items-center bg-[#FCFAF7] border-2 border-[#E8E2D9] focus-within:border-orange-700 focus-within:bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-sm">
                      <div className="px-6 py-5 bg-[#F4F1ED] border-r border-[#E8E2D9] font-bold text-[#4A3728] text-lg">+91</div>
                      <input
                        type="tel"
                        maxLength={10}
                        className="w-full px-6 py-5 bg-transparent outline-none text-xl font-bold text-[#4A3728] placeholder:text-gray-300"
                        placeholder="00000 00000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSendOtp}
                    disabled={phoneNumber.length < 10 || isLoading}
                    className="w-full py-5 bg-orange-500 text-white font-bold rounded-2xl shadow-xl hover:bg-orange-800 transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                  </button>
                </div>
                <div className="text-center pt-4">
                  <p className="text-[11px] text-[#8C7A6B] font-medium">New Acharya? <Link to="/partnerSignUp" className="text-orange-700 font-bold hover:underline">Apply for Verification</Link></p>
                </div>
              </div>
            ) : (
              <div className="space-y-10 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-orange-100 shadow-lg">
                  <KeyRound size={32} className="text-orange-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#4A3728] mb-2">Enter OTP</h3>
                  <p className="text-[#8C7A6B] text-xs font-medium">Verification code sent to <span className="text-orange-700 font-bold">+91 {phoneNumber}</span></p>
                </div>
                <div className="space-y-6">
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full py-5 bg-[#FCFAF7] border-2 border-[#E8E2D9] rounded-2xl text-center text-4xl font-black tracking-[0.5em] outline-none focus:border-orange-700 text-[#4A3728]"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <button
                    onClick={handleVerifyLogin}
                    disabled={isLoading || otp.length < 6}
                    className="w-full py-5 bg-[#4A3728] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:bg-[#2D1B0B] transition-all"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Enter Dashboard"}
                  </button>
                  <button onClick={() => setIsOtpStep(false)} className="text-[10px] font-black text-[#8C7A6B] hover:text-orange-700 uppercase tracking-widest">Try another number</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSignIn;