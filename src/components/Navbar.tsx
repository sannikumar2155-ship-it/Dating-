import React from 'react';
import { ArrowDownToLine, Coins, Shield, Sparkles, User, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { user, openModal, currentRoom, leaveRoom } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={leaveRoom}
          className="text-left font-display text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
        >
          HeartBeat Live
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              if (currentRoom) leaveRoom();
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Party Rooms
          </button>
          <button
            onClick={() => openModal('pk')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            1v1 PK Battles
          </button>
          <button
            onClick={() => openModal('family')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Family Clans
          </button>
          <button
            onClick={() => openModal('events')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Events & Quests
          </button>
          <button
            onClick={() => openModal('download')}
            className="text-rose-400 hover:text-rose-300 font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <ArrowDownToLine className="w-4 h-4 text-rose-400" />
            <span>Download App</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action (Recharge button + user quick access + mobile install trigger) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => openModal('download')}
            className="md:hidden p-2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all cursor-pointer text-xs font-bold flex items-center gap-1"
            title="Download App"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span className="text-[11px]">App</span>
          </button>

          <button
            onClick={() => openModal('recharge')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all cursor-pointer shadow-sm shadow-amber-500/10 active:scale-95 whitespace-nowrap shrink-0 text-xs sm:text-sm font-semibold"
          >
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="tabular-nums font-mono">{user.coins.toLocaleString()}</span>
            <span className="text-white/60 text-xs">Recharge</span>
          </button>


          <button
            onClick={() => openModal('login')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors shrink-0"
            title="Sign in with Phone, Gmail, or Facebook"
          >
            <span className="text-[11px]">🔑</span>
            <span className="hidden sm:inline">Login</span>
          </button>

          <button
            onClick={() => openModal('profile')}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors shrink-0"
            title="My Profile"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-rose-400/50"
              referrerPolicy="no-referrer"
            />
            <span className="hidden sm:inline font-medium text-slate-200 truncate max-w-[90px]">
              {user.name}
            </span>
            <span className="hidden sm:inline px-1.5 py-0.2 text-[10px] bg-rose-500/20 text-rose-300 rounded font-semibold">
              VIP {user.vipLevel}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
};
