import React, { useState } from 'react';
import {
  ArrowDownToLine,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Laptop,
  QrCode,
  Share2,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const DownloadAppModal: React.FC = () => {
  const { activeModal, closeModal } = useApp();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'phone' | 'ios' | 'pc' | 'code'>('phone');
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'download') return null;

  // Real production shared URL
  const SHARED_APP_URL = 'https://ais-pre-eutnjy4t4s7p5diaxewqk7-755091834811.asia-northeast1.run.app';
  const currentUrl =
    typeof window !== 'undefined' && window.location.href.startsWith('http')
      ? window.location.href
      : SHARED_APP_URL;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(SHARED_APP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectInstall = async () => {
    await install();
  };


  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Download & Install HeartBeat Live
              </h3>
              <p className="text-xs text-rose-300">
                ऐप को अपने फोन (Android / iPhone) या कंप्यूटर में डाउनलोड करें
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

        {/* Official Direct Download Link Card */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Official App Link (मोबाइल में खोलने या डाउनलोड के लिए):</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">Active & Live</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={SHARED_APP_URL}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-rose-300 truncate focus:outline-none select-all"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
              </button>
              <a
                href={SHARED_APP_URL}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>


        {/* 1-Click Direct Install Button if supported */}
        {isInstallable && !isInstalled && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white mb-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-extrabold text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 fill-white" />
                <span>One-Click App Install Ready!</span>
              </div>
              <div className="text-xs text-rose-100 mt-0.5">
                सीधे 1-क्लिक में अपने डिवाइस पर इंस्टॉल करें (No Play Store needed)
              </div>
            </div>
            <button
              onClick={handleDirectInstall}
              className="px-5 py-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              📲 Install App Now
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-4 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>App is already installed as a Standalone App on this device! ✓</span>
          </div>
        )}

        {/* Device Selection Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
          {[
            { id: 'phone', label: 'Android Phone', icon: Smartphone },
            { id: 'ios', label: 'iPhone / iPad', icon: Smartphone },
            { id: 'pc', label: 'Computer / PC', icon: Laptop },
            { id: 'code', label: 'Source Code', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] truncate w-full text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Android Instructions */}
        {activeTab === 'phone' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                <span>📱 Android मोबाइल में ऐप डाउनलोड करने के 3 आसान स्टेप्स:</span>
              </h4>
              <ol className="space-y-3 text-xs text-slate-300 pl-4 list-decimal leading-relaxed">
                <li>
                  <strong className="text-white">स्टेप 1:</strong> अपने फोन के Google Chrome या Browser में यह लिंक खोलें:
                  <div className="mt-1.5 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={currentUrl}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono truncate"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </li>
                <li>
                  <strong className="text-white">स्टेप 2:</strong> Chrome ब्राउज़र के ऊपर दाईं ओर{' '}
                  <span className="px-1.5 py-0.5 rounded bg-slate-700 text-white font-bold">
                    तीन डॉट्स (⋮)
                  </span>{' '}
                  मेनू पर टैप करें।
                </li>
                <li>
                  <strong className="text-white">स्टेप 3:</strong> मेनू में{' '}
                  <span className="text-amber-300 font-bold">
                    "Install app"
                  </span>{' '}
                  या{' '}
                  <span className="text-amber-300 font-bold">
                    "Add to Home screen" (होम स्क्रीन पर जोड़ें)
                  </span>{' '}
                  पर क्लिक करें।
                </li>
              </ol>

              <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-300">
                ✨ ऐप आपके मोबाइल स्क्रीन पर किसी भी Play Store ऐप की तरह एक अलग आइकन के रूप में आ जाएगा!
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: iOS iPhone Instructions */}
        {activeTab === 'ios' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                <span>🍎 iPhone या iPad में ऐप डाउनलोड / इंस्टॉल कैसे करें:</span>
              </h4>
              <ol className="space-y-3 text-xs text-slate-300 pl-4 list-decimal leading-relaxed">
                <li>
                  <strong className="text-white">स्टेप 1:</strong> iPhone के{' '}
                  <strong className="text-rose-300">Safari Browser</strong> में यह लिंक खोलें।
                </li>
                <li>
                  <strong className="text-white">स्टेप 2:</strong> स्क्रीन के नीचे बीच में बने{' '}
                  <span className="px-1.5 py-0.5 rounded bg-slate-700 text-white font-bold">
                    Share बटन (📤)
                  </span>{' '}
                  पर टैप करें।
                </li>
                <li>
                  <strong className="text-white">स्टेप 3:</strong> नीचे स्क्रॉल करें और{' '}
                  <span className="text-amber-300 font-bold">
                    "Add to Home Screen" (होम स्क्रीन में जोड़ें)
                  </span>{' '}
                  चुनें और ऊपर 'Add' दबाएं।
                </li>
              </ol>

              <div className="mt-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">
                🚀 अब आप सीधे अपने iPhone होमस्क्रीन से इस ऐप को फुल स्क्रीन में बिना किसी सफारी बार के चला सकेंगे!
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PC Instructions */}
        {activeTab === 'pc' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                <span>💻 Windows PC / Mac / Laptop में इंस्टॉल करें:</span>
              </h4>
              <ol className="space-y-3 text-xs text-slate-300 pl-4 list-decimal leading-relaxed">
                <li>
                  <strong className="text-white">स्टेप 1:</strong> Google Chrome या Microsoft Edge ब्राउज़र खोलें।
                </li>
                <li>
                  <strong className="text-white">स्टेप 2:</strong> ऊपर URL एड्रेस बार के दाईं तरफ बने{' '}
                  <span className="px-1.5 py-0.5 rounded bg-slate-700 text-white font-bold">
                    Install App (⊕)
                  </span>{' '}
                  आइकन पर क्लिक करें।
                </li>
                <li>
                  <strong className="text-white">स्टेप 3:</strong> "Install" बटन पर क्लिक करें। ऐप आपके डेस्कटॉप और स्टार्ट मेनू में आ जाएगा।
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 4: Source Code Instructions */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                <span>💻 Source Code / Project फाइल्स कैसे लें:</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                अगर आप इस पूरे ऐप का कोड (React + TypeScript + Tailwind) डाउनलोड करना चाहते हैं:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-rose-400"># 1. AI Studio UI से:</div>
                <div>ऊपर मेनू में 'Export / Download ZIP' या 'Push to GitHub' पर क्लिक करें।</div>
                <div className="pt-2 text-rose-400"># 2. Local Machine में चलाने के लिए:</div>
                <div>npm install</div>
                <div>npm run dev</div>
              </div>
            </div>
          </div>
        )}

        {/* Share Link Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Share2 className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">WhatsApp या दोस्तों के साथ लिंक शेयर करें:</span>
            <span className="sm:hidden">शेयर लिंक:</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'लिंक कॉपी हो गया!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
