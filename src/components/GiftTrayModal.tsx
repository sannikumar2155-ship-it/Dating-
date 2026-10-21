import React, { useState } from 'react';
import { Coins, Heart, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Gift } from '../types';

export const GiftTrayModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    gifts,
    user,
    sendGift,
    selectedGiftRecipient,
    setSelectedGiftRecipient,
    currentRoom,
    openModal,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedGift, setSelectedGift] = useState<Gift>(gifts[0]);
  const [comboCount, setComboCount] = useState<number>(1);
  const [isSending, setIsSending] = useState<boolean>(false);

  if (activeModal !== 'gift') return null;

  const filteredGifts = gifts.filter((g) =>
    activeCategory === 'all' ? true : g.category === activeCategory
  );

  const totalCost = selectedGift.coins * comboCount;
  const hasEnoughCoins = user.coins >= totalCost;

  const handleSend = () => {
    setIsSending(true);
    const success = sendGift(selectedGift, selectedGiftRecipient, comboCount);
    setTimeout(() => {
      setIsSending(false);
      if (success && selectedGift.coins >= 500) {
        closeModal();
      }
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={closeModal}
    >
      <div
        className="w-full sm:max-w-xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl text-white max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <h3 className="font-display font-bold text-base text-white">Gift Store</h3>
            <span className="text-xs text-rose-400 font-semibold">· Send love on stage</span>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipient Selector Strip */}
        <div className="py-3 border-b border-slate-800/80">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Sending to:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedGiftRecipient('host')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedGiftRecipient === 'host'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>👑 Host ({currentRoom?.hostName.split(' ')[0] || 'Host'})</span>
            </button>

            {currentRoom?.seats
              .filter((s) => s.userId)
              .map((seat) => (
                <button
                  key={seat.seatIndex}
                  onClick={() => setSelectedGiftRecipient(seat.seatIndex)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedGiftRecipient === seat.seatIndex
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <img
                    src={seat.userAvatar}
                    alt={seat.userName}
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span>
                    #{seat.seatIndex} {seat.userName?.split(' ')[0]}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex items-center gap-1.5 py-3 border-b border-slate-800/80">
          {[
            { id: 'all', label: 'All Gifts' },
            { id: 'popular', label: 'Popular' },
            { id: 'romance', label: 'Romance ❤️' },
            { id: 'luxury', label: 'Luxury 🏰' },
            { id: 'special', label: 'Special' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-4 gap-2.5 py-3 overflow-y-auto max-h-[260px]">
          {filteredGifts.map((gift) => {
            const isSelected = selectedGift.id === gift.id;
            return (
              <div
                key={gift.id}
                onClick={() => setSelectedGift(gift)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-between transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 ring-1 ring-rose-500 scale-102'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <span className="text-3xl my-1 select-none">{gift.icon}</span>
                <span className="text-xs font-bold text-white text-center truncate w-full">
                  {gift.name}
                </span>
                <span className="text-[11px] font-mono font-semibold text-amber-300 flex items-center gap-0.5 mt-0.5">
                  <span>🪙</span>
                  <span>{gift.coins}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Combo Multiplier & Send Action Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* User Coins & Recharge shortcut */}
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-mono font-bold text-amber-300 tabular-nums">
                {user.coins.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => openModal('recharge')}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 cursor-pointer underline underline-offset-2"
            >
              + Recharge
            </button>
          </div>

          {/* Combos & Send Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Quick Combos */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-800 rounded-xl">
              {[1, 10, 66, 99].map((num) => (
                <button
                  key={num}
                  onClick={() => setComboCount(num)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    comboCount === num
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  x{num}
                </button>
              ))}
            </div>

            {/* Send CTA */}
            <button
              onClick={handleSend}
              disabled={isSending}
              className={`px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                hasEnoughCoins
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-500/30'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold'
              }`}
            >
              {hasEnoughCoins ? (
                <>
                  <span>Send</span>
                  <span className="font-mono font-semibold">({totalCost.toLocaleString()})</span>
                </>
              ) : (
                <span>Recharge Coins</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
