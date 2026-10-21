import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Heart, RotateCw, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LUCKY_WHEEL_SLICES, TRUTH_OR_DARE_PROMPTS } from '../data/mockData';

export const GamesModal: React.FC = () => {
  const { activeModal, closeModal, user, setUser, sendMessage } = useApp();

  const [activeTab, setActiveTab] = useState<'wheel' | 'dice' | 'truth_dare'>('wheel');

  // Lucky Wheel State
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelPrize, setWheelPrize] = useState<string | null>(null);

  // Dice Game State
  const [userDice, setUserDice] = useState<number>(4);
  const [hostDice, setHostDice] = useState<number>(3);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [diceResult, setDiceResult] = useState<string | null>(null);

  // Truth or Dare State
  const [currentPrompt, setCurrentPrompt] = useState(TRUTH_OR_DARE_PROMPTS[0]);

  if (activeModal !== 'games') return null;

  // Spin Lucky Wheel
  const handleSpinWheel = () => {
    if (user.coins < 50 || isSpinning) return;

    // Deduct cost
    setUser((prev) => ({ ...prev, coins: prev.coins - 50 }));
    setIsSpinning(true);
    setWheelPrize(null);

    // Pick random prize slice
    const sliceIndex = Math.floor(Math.random() * LUCKY_WHEEL_SLICES.length);
    const prize = LUCKY_WHEEL_SLICES[sliceIndex];

    // Compute extra rotations (5-8 full spins + slice offset)
    const extraRotations = (5 + Math.floor(Math.random() * 3)) * 360;
    const sliceAngle = 360 / LUCKY_WHEEL_SLICES.length;
    const targetAngle = extraRotations + (360 - sliceIndex * sliceAngle - sliceAngle / 2);

    setWheelRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWheelPrize(prize.label);

      // Award prize
      if (prize.type === 'coins') {
        setUser((prev) => ({ ...prev, coins: prev.coins + prize.value }));
      }
      confetti({
        particleCount: prize.value >= 500 ? 70 : 35,
        spread: 60,
        origin: { y: 0.6 },
      });
      sendMessage(`🎰 Lucky Wheel result: Won ${prize.label}! 🎉`);
    }, 3200);
  };

  // Roll Dice
  const handleRollDice = () => {
    if (user.coins < 50 || isRolling) return;

    setUser((prev) => ({ ...prev, coins: prev.coins - 50 }));
    setIsRolling(true);
    setDiceResult(null);

    let rolls = 0;
    const interval = setInterval(() => {
      setUserDice(Math.floor(Math.random() * 6) + 1);
      setHostDice(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalUser = Math.floor(Math.random() * 6) + 1;
        const finalHost = Math.floor(Math.random() * 6) + 1;
        setUserDice(finalUser);
        setHostDice(finalHost);
        setIsRolling(false);

        if (finalUser > finalHost) {
          setDiceResult('You won 100 Coins! 🎉');
          setUser((prev) => ({ ...prev, coins: prev.coins + 100 }));
          confetti({ particleCount: 30, spread: 50 });
        } else if (finalUser === finalHost) {
          setDiceResult('Draw! Coins refunded.');
          setUser((prev) => ({ ...prev, coins: prev.coins + 50 }));
        } else {
          setDiceResult('Host won this round! Try again!');
        }
      }
    }, 100);
  };

  // Draw Truth or Dare
  const handleDrawPrompt = (type?: 'Truth' | 'Dare') => {
    const list = type
      ? TRUTH_OR_DARE_PROMPTS.filter((p) => p.type === type)
      : TRUTH_OR_DARE_PROMPTS;
    const randomPick = list[Math.floor(Math.random() * list.length)];
    setCurrentPrompt(randomPick);
    sendMessage(`💌 Truth or Dare on mic: [${randomPick.type}] ${randomPick.text}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Party Mini-Games</h3>
              <p className="text-xs text-slate-400">Play with seats, win coins & break the ice!</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { id: 'wheel', label: '🎰 Lucky Wheel' },
            { id: 'dice', label: '🎲 Dice Duel' },
            { id: 'truth_dare', label: '❤️ Truth or Dare' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. LUCKY WHEEL */}
        {activeTab === 'wheel' && (
          <div className="text-center">
            {/* Wheel Container */}
            <div className="relative w-64 h-64 mx-auto my-3 flex items-center justify-center">
              {/* Top Needle Indicator */}
              <div className="absolute -top-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-md" />

              {/* Rotating Wheel graphic */}
              <div
                className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl overflow-hidden relative"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                  background:
                    'conic-gradient(#f43f5e 0deg 45deg, #ec4899 45deg 90deg, #8b5cf6 90deg 135deg, #a855f7 135deg 180deg, #06b6d4 180deg 225deg, #eab308 225deg 270deg, #f59e0b 270deg 315deg, #10b981 315deg 360deg)',
                }}
              >
                {/* Labels overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center font-bold text-xs text-amber-300 shadow-md">
                    SPIN
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Announcement */}
            {wheelPrize && (
              <div className="p-3 my-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-bounce">
                🎉 Congratulations! You won: {wheelPrize}!
              </div>
            )}

            <p className="text-xs text-slate-400 mb-3">Cost: 50 Coins per spin · Instant prizes</p>

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning || user.coins < 50}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 disabled:opacity-50 text-slate-950 font-black text-sm shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {isSpinning ? 'Spinning...' : 'Spin Wheel (50 Coins)'}
            </button>
          </div>
        )}

        {/* 2. DICE DUEL */}
        {activeTab === 'dice' && (
          <div className="text-center py-2">
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto my-4">
              {/* User Dice */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="text-xs font-semibold text-rose-300">Your Roll</span>
                <div className="text-5xl font-mono my-2 font-black text-rose-400">{userDice}</div>
                <span className="text-[10px] text-slate-400">Player</span>
              </div>

              {/* Host Dice */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="text-xs font-semibold text-blue-300">Host Roll</span>
                <div className="text-5xl font-mono my-2 font-black text-blue-400">{hostDice}</div>
                <span className="text-[10px] text-slate-400">Host</span>
              </div>
            </div>

            {diceResult && (
              <div className="p-3 my-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
                {diceResult}
              </div>
            )}

            <p className="text-xs text-slate-400 mb-3">Bet 50 Coins. Higher roll wins 100 Coins!</p>

            <button
              onClick={handleRollDice}
              disabled={isRolling || user.coins < 50}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {isRolling ? 'Rolling Dice...' : 'Roll Dice (50 Coins)'}
            </button>
          </div>
        )}

        {/* 3. TRUTH OR DARE */}
        {activeTab === 'truth_dare' && (
          <div className="text-center py-2">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/30 my-4 text-left">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  currentPrompt.type === 'Truth'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {currentPrompt.type} Card
              </span>
              <p className="text-base font-bold text-white mt-3 leading-relaxed">
                "{currentPrompt.text}"
              </p>
              <div className="text-xs text-slate-400 mt-3">
                🎙️ Read and answer on your mic seat!
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDrawPrompt('Truth')}
                className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Draw Truth Card
              </button>
              <button
                onClick={() => handleDrawPrompt('Dare')}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Draw Dare Card
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
