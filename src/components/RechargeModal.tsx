import React, { useState } from 'react';
import { Check, Coins, Crown, Sparkles, X, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RECHARGE_PACKAGES } from '../data/mockData';

export const RechargeModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    user,
    rechargeCoins,
    dailyRewardClaimed,
    claimDailyReward,
  } = useApp();

  const [selectedPackage, setSelectedPackage] = useState(RECHARGE_PACKAGES[1]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (activeModal !== 'recharge') return null;

  const handleRecharge = () => {
    rechargeCoins(selectedPackage.coins, selectedPackage.bonus, selectedPackage.price);
    const total = selectedPackage.coins + selectedPackage.bonus;
    setSuccessToast(`Successfully recharged +${total.toLocaleString()} Coins!`);
    setTimeout(() => {
      setSuccessToast(null);
      closeModal();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Recharge Center</h3>
              <p className="text-xs text-slate-400">Top-up coins for luxury gifts & party fun</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance & Daily Bonus Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-slate-900 border border-amber-500/30 flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider">
              My Wallet Balance
            </div>
            <div className="text-2xl font-black font-mono text-amber-300 flex items-center gap-1.5 mt-0.5">
              <span>🪙</span>
              <span className="tabular-nums">{user.coins.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">VIP Level {user.vipLevel} Active</div>
          </div>

          <div className="text-right">
            <button
              onClick={claimDailyReward}
              disabled={dailyRewardClaimed}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                dailyRewardClaimed
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md active:scale-95'
              }`}
            >
              {dailyRewardClaimed ? 'Daily Claimed ✓' : '+300 Free Daily'}
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Package Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {RECHARGE_PACKAGES.map((pkg) => {
            const isSelected = selectedPackage.id === pkg.id;
            const totalCoins = pkg.coins + pkg.bonus;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/50 shadow-lg'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-bold shadow-sm">
                    {pkg.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-1 text-sm font-bold text-amber-300 font-mono">
                    <span>🪙</span>
                    <span className="tabular-nums">{pkg.coins.toLocaleString()}</span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="text-[10px] font-semibold text-rose-400 mt-0.5">
                      +{pkg.bonus.toLocaleString()} Extra
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-black text-white">{pkg.price}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-slate-950 font-bold'
                        : 'border-slate-600'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIP Tier Privileges Preview */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-300 mb-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Privilege Perks</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">★</span>
              <span>VIP 1: Golden Mic Seat Flair</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">★</span>
              <span>VIP 2: Custom Room Entrance Ride</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">★</span>
              <span>VIP 3: Full-Room Broadcast Alert</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400">★</span>
              <span>VIP 4: Dragon King Avatar Frame</span>
            </div>
          </div>
        </div>

        {/* Recharge Action Button */}
        <button
          onClick={handleRecharge}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>Pay {selectedPackage.price} · Get {(selectedPackage.coins + selectedPackage.bonus).toLocaleString()} Coins</span>
        </button>
      </div>
    </div>
  );
};
