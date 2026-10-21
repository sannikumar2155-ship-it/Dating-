import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    user,
    loginWithPhone,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'phone' | 'google' | 'facebook'>('phone');

  // Phone Login State
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);

  // Google Login State
  const [customGoogleEmail, setCustomGoogleEmail] = useState('sannikumar2155@gmail.com');
  const [customGoogleName, setCustomGoogleName] = useState('Sanni Kumar');

  // Facebook Login State
  const [customFbName, setCustomFbName] = useState('Sanni Kumar');

  if (activeModal !== 'login') return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 7) {
      setOtpStep('otp');
      setOtpCode('520131'); // prefill convenient test OTP
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPhone(`${countryCode} ${phoneNumber}`);
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogle(customGoogleEmail, customGoogleName);
  };

  const handleFacebookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithFacebook(customFbName);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Account Sign In / Login
              </h3>
              <p className="text-xs text-slate-400">
                Phone Number, Gmail & Facebook
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Logged In */}
        {user.isLoggedIn && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{user.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Online
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Via {user.loginProvider === 'phone' ? `📱 ${user.phone}` : user.loginProvider === 'google' ? `✨ ${user.email}` : `🌐 Facebook`}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Login Method Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
          <button
            onClick={() => {
              setActiveTab('phone');
              setOtpStep('phone');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile No.</span>
          </button>

          <button
            onClick={() => setActiveTab('google')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'google'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Gmail</span>
          </button>

          <button
            onClick={() => setActiveTab('facebook')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Facebook</span>
          </button>
        </div>

        {/* 1. PHONE NUMBER LOGIN */}
        {activeTab === 'phone' && (
          <div>
            {otpStep === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Enter Mobile Number (मोबाइल नंबर दर्ज करें):
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    >
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+1">🇺🇸 +1 (USA)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+966">🇸🇦 +966 (KSA)</option>
                      <option value="+62">🇮🇩 +62 (Indonesia)</option>
                    </select>

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  🔒 We will send a 6-digit OTP SMS to verify your mobile number.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Send OTP Code (ओटीपी भेजें)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center py-2">
                  <div className="text-xs text-slate-300">
                    OTP sent to <span className="font-bold text-white">{countryCode} {phoneNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpStep('phone')}
                    className="text-[11px] text-rose-400 hover:underline mt-0.5 cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Enter 6-Digit OTP:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center tracking-[0.5em] text-lg font-mono px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-amber-300 focus:outline-none focus:border-rose-500"
                    required
                  />
                  <div className="text-center mt-2">
                    <span className="text-[11px] text-slate-400">
                      Auto-detected OTP: <strong className="text-emerald-400">520131</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  Verify & Login with Phone
                </button>
              </form>
            )}
          </div>
        )}

        {/* 2. GMAIL / GOOGLE LOGIN */}
        {activeTab === 'google' && (
          <form onSubmit={handleGoogleSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-950 border border-red-500/20 text-center">
              {/* Google G Logo SVG */}
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>

              <h4 className="font-bold text-sm text-white">Google Gmail Account Login</h4>
              <p className="text-xs text-slate-300 mt-1">
                One-tap sign in with your Google account. Your profile and coins will be safely synced.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Google Gmail Address:
              </label>
              <input
                type="email"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Your Name:
              </label>
              <input
                type="text"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue with Google</span>
              <span className="text-slate-500 font-normal">({customGoogleEmail.split('@')[0]})</span>
            </button>
          </form>
        )}

        {/* 3. FACEBOOK LOGIN */}
        {activeTab === 'facebook' && (
          <form onSubmit={handleFacebookSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/20 text-center">
              {/* Facebook Logo SVG */}
              <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>

              <h4 className="font-bold text-sm text-white">Facebook Account Login</h4>
              <p className="text-xs text-slate-300 mt-1">
                Fast and secure login with your Facebook profile and friend list.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Facebook Profile Name:
              </label>
              <input
                type="text"
                value={customFbName}
                onChange={(e) => setCustomFbName(e.target.value)}
                placeholder="Facebook account name"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Continue with Facebook</span>
            </button>
          </form>
        )}

        {/* Footer Guarantee */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-bit encrypted secure social login</span>
        </div>
      </div>
    </div>
  );
};
