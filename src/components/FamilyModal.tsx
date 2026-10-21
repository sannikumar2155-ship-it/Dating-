import React, { useState } from 'react';
import { Award, ChevronRight, Crown, Shield, Sparkles, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_FAMILIES } from '../data/mockData';
import { FamilyClan } from '../types';

export const FamilyModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    user,
    myFamilyId,
    joinFamily,
    enterRoom,
  } = useApp();

  const [selectedFamily, setSelectedFamily] = useState<FamilyClan>(
    INITIAL_FAMILIES.find((f) => f.id === myFamilyId) || INITIAL_FAMILIES[0]
  );
  const [donateSuccess, setDonateSuccess] = useState<boolean>(false);

  if (activeModal !== 'family') return null;

  const isMyFamily = user.familyId === selectedFamily.id;

  const handleDonate = () => {
    setDonateSuccess(true);
    setTimeout(() => setDonateSuccess(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Family Clans & Guilds</h3>
              <p className="text-xs text-slate-400">Join a clan, battle in clan wars & earn 2x EXP</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Family Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 p-5 mb-5 bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 font-mono font-bold text-xs">
                  [{selectedFamily.badge}]
                </span>
                <span className="text-xs font-semibold text-amber-300">
                  Rank #{selectedFamily.rank} Clan
                </span>
              </div>
              <h4 className="font-display text-xl font-bold text-white mt-1">
                {selectedFamily.name}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md">{selectedFamily.description}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Level {selectedFamily.level}</span>
              <div className="text-sm font-bold text-purple-300">
                {selectedFamily.memberCount}/{selectedFamily.maxMembers} Members
              </div>
            </div>
          </div>

          {/* Daily EXP Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Clan Daily Activity EXP</span>
              <span className="font-mono text-purple-300 font-bold">
                {selectedFamily.dailyExp.toLocaleString()} / {selectedFamily.maxDailyExp.toLocaleString()}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{
                  width: `${Math.round(
                    (selectedFamily.dailyExp / selectedFamily.maxDailyExp) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4">
            {isMyFamily ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDonate}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  {donateSuccess ? 'Donated 100 EXP! ✓' : '🪙 Donate +100 Coins to Clan'}
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    enterRoom('room_family_clan');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                >
                  Enter Family Room
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  joinFamily(selectedFamily.id, selectedFamily.name, selectedFamily.badge)
                }
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Join {selectedFamily.name}
              </button>
            )}
          </div>
        </div>

        {/* Clan Perks */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 mb-5">
          <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clan Member Perks</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {selectedFamily.perks.map((perk, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 font-medium flex items-center gap-1.5"
              >
                <span className="text-purple-400">⚡</span>
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clan Rankings List */}
        <div>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Top Family Clans Ranking
          </h5>
          <div className="space-y-2">
            {INITIAL_FAMILIES.map((fam) => {
              const isSelected = selectedFamily.id === fam.id;
              return (
                <div
                  key={fam.id}
                  onClick={() => setSelectedFamily(fam)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-500/15 border-purple-500'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-400 text-sm w-5">
                      #{fam.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{fam.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                          [{fam.badge}]
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Leader: {fam.leaderName} · {fam.memberCount} Members
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-300 font-mono font-bold">
                      Lv.{fam.level}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
