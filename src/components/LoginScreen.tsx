import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Phone, Lock, ChevronRight, ShoppingBag, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginUser } = useApp();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Simulate OTP generation
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(randomOtp);
      setIsLoading(false);
      setStep('otp');
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the 4-digit code');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      setError('Invalid OTP code. Please try again or use 1234');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser(phone, name || 'Karthik Goud');
    }, 1000);
  };

  return (
    <div id="login-screen" className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header Decorative Curve */}
      <div className="relative bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white pt-12 pb-16 px-6 rounded-b-[2.5rem] shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_40%)]" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-md">
            <ShoppingBag className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-xl font-bold tracking-tight">QuickBite Delivery</span>
        </div>

        <h2 className="text-2xl font-extrabold mb-1">Welcome to QuickBite</h2>
        <p className="text-purple-50 text-sm font-light">Verify your number to start ordering fresh meals & daily essentials</p>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 px-6 -mt-8 z-10 max-w-md w-full mx-auto">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-xl flex items-center font-medium">
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Karthik Goud"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-600 text-sm font-semibold">Change phone number</span>
              </div>

              <div className="text-center space-y-1">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                  Verification Code Sent
                </p>
                <p className="text-slate-800 text-sm font-bold">{phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</p>
                
                {/* Auto Generated OTP tip */}
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 mt-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs text-amber-800 font-semibold">
                    Simulated OTP code: <span className="underline font-mono text-sm tracking-widest">{generatedOtp}</span>
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 rounded-2xl text-center text-xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/15 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Verify & Login</span>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
                    setGeneratedOtp(randomOtp);
                  }}
                  className="text-purple-600 hover:text-purple-700 text-xs font-semibold cursor-pointer"
                >
                  Resend Verification Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Trust Badges Footer */}
      <div className="p-6 text-center text-slate-400 space-y-2 mt-auto">
        <p className="text-xs font-medium">By continuing, you agree to our Terms of Service & Privacy Policy</p>
        <div className="flex justify-center gap-4 text-[10px] font-mono text-slate-400/80">
          <span>🔒 SECURE 256-BIT SSL</span>
          <span>🛡️ GDPR COMPLIANT</span>
        </div>
      </div>
    </div>
  );
};
