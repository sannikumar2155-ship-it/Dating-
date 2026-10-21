import React, { useState } from 'react';
import { Flame, Sparkles, Swords, Trophy, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PKBattleModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    currentRoom,
    pkBattle,
    supportPKTeam,
    startPKBattle,
    endPKBattle,
  } = useApp();

  const [selectedOpponent, setSelectedOpponent] = useState('MC Marcus King');
  const [selectedPunishment, setSelectedPunishment] = useState('Face Drawing with Marker 🖌️');

  if (activeModal !== 'pk') return null;

  const isPKActive = pkBattle?.isActive;

  const redScore = pkBattle?.redTeam.score || 0;
  const blueScore = pkBattle?.blueTeam.score || 0;
  const total = redScore + blueScore || 1;
  const redPct = Math.round((redScore / total) * 100);
  const bluePct = 100 - redPct;

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
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">1v1 PK Duel Arena</h3>
              <p className="text-xs text-slate-400">Streamer vs Streamer gift battle with punishments</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Active PK Battle */}
        {isPKActive && pkBattle ? (
          <div>
            {/* Split Screen Contestants */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Red Team */}
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                  Red Team (Host)
                </span>
                <img
                  src={pkBattle.redTeam.avatar}
                  alt={pkBattle.redTeam.hostName}
                  className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-red-500 my-2"
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-bold text-sm text-white truncate">
                  {pkBattle.redTeam.hostName}
                </h4>
                <div className="text-lg font-black font-mono text-red-400 mt-1">
                  {pkBattle.redTeam.score.toLocaleString()} pts
                </div>
                {pkBattle.redTeam.topContributor && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    MVP: <span className="text-amber-300">{pkBattle.redTeam.topContributor}</span>
                  </div>
                )}
              </div>

              {/* Blue Team */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  Blue Team (Challenger)
                </span>
                <img
                  src={pkBattle.blueTeam.avatar}
                  alt={pkBattle.blueTeam.hostName}
                  className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-blue-500 my-2"
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-bold text-sm text-white truncate">
                  {pkBattle.blueTeam.hostName}
                </h4>
                <div className="text-lg font-black font-mono text-blue-400 mt-1">
                  {pkBattle.blueTeam.score.toLocaleString()} pts
                </div>
                {pkBattle.blueTeam.topContributor && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    MVP: <span className="text-amber-300">{pkBattle.blueTeam.topContributor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tug of war bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                <span className="text-red-400">{redPct}% Red</span>
                <span className="text-blue-400">{bluePct}% Blue</span>
              </div>
              <div className="h-4 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
                <div
                  className="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-500"
                  style={{ width: `${redPct}%` }}
                />
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                  style={{ width: `${bluePct}%` }}
                />
              </div>
            </div>

            {/* Quick Cheer Boosts */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="space-y-1.5">
                <button
                  onClick={() => supportPKTeam('red', 100)}
                  className="w-full py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Cheer Red (+100)
                </button>
                <button
                  onClick={() => supportPKTeam('red', 500)}
                  className="w-full py-2 rounded-xl bg-red-500/30 border border-red-500/50 hover:bg-red-500/50 text-red-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Super Cheer Red (+500)
                </button>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => supportPKTeam('blue', 100)}
                  className="w-full py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Cheer Blue (+100)
                </button>
                <button
                  onClick={() => supportPKTeam('blue', 500)}
                  className="w-full py-2 rounded-xl bg-blue-500/30 border border-blue-500/50 hover:bg-blue-500/50 text-blue-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                >
                  Super Cheer Blue (+500)
                </button>
              </div>
            </div>

            {/* End Battle Action */}
            <button
              onClick={() => {
                endPKBattle();
                closeModal();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              End Battle & Declare Winner
            </button>
          </div>
        ) : (
          /* Start New PK Battle Configuration */
          <div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-blue-950/40 border border-red-500/20 mb-4 text-center">
              <Swords className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-white">Challenge Another Streamer</h4>
              <p className="text-xs text-slate-400 mt-1">
                Start a 3-minute 1v1 gift battle. The streamer with higher score wins, loser must complete punishment!
              </p>
            </div>

            {/* Select Rival */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Select Rival Host:
              </label>
              <select
                value={selectedOpponent}
                onChange={(e) => setSelectedOpponent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="MC Marcus King">MC Marcus King (Level 18 · Rap Room)</option>
                <option value="DJ Alex Prime">DJ Alex Prime (Level 22 · EDM Live)</option>
                <option value="Queen Sophia">Queen Sophia (Level 16 · Romantic Duets)</option>
                <option value="Princess Mia">Princess Mia (Level 14 · Cupid Lounge)</option>
              </select>
            </div>

            {/* Select Punishment */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Loser's Punishment:
              </label>
              <select
                value={selectedPunishment}
                onChange={(e) => setSelectedPunishment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Face Drawing with Marker 🖌️">Face Drawing with Marker 🖌️</option>
                <option value="Singing Romantic Chorus on Stage 🎤">Singing Romantic Chorus on Stage 🎤</option>
                <option value="30 Pushups on Live Mic 💪">30 Pushups on Live Mic 💪</option>
                <option value="Confess to Random Seat ❤️">Confess to Random Seat ❤️</option>
              </select>
            </div>

            <button
              onClick={() => {
                startPKBattle(selectedOpponent);
                closeModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
            >
              Start 1v1 PK Duel Now!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
