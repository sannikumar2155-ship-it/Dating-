import React from 'react';
import { Coins, Crown, Edit3, Heart, Shield, Sparkles, User, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserProfileModal: React.FC = () => {
  const { activeModal, closeModal, user, followingIds, openModal } = useApp();

  if (activeModal !== 'profile') return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="font-display font-bold text-base text-white">My Profile</h3>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="text-center">
          <div className="relative inline-block mb-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-rose-500/50"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] shadow-sm">
              Lv.{user.level}
            </span>
          </div>

          <h4 className="font-display text-lg font-bold text-white flex items-center justify-center gap-1.5">
            {user.name}
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              VIP {user.vipLevel}
            </span>
          </h4>

          {user.familyBadge && (
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                Clan: {user.familyName} [{user.familyBadge}]
              </span>
            </div>
          )}

          {user.isVolunteer && (
            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>{user.volunteerRank || 'Room Guardian'}</span>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-2.5 italic max-w-xs mx-auto">"{user.bio}"</p>

          {/* Social Stats */}
          <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-base font-bold font-mono text-white">
                {user.followersCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">Followers</div>
            </div>
            <div>
              <div className="text-base font-bold font-mono text-white">
                {followingIds.length}
              </div>
              <div className="text-[10px] text-slate-400">Following</div>
            </div>
            <div>
              <div className="text-base font-bold font-mono text-amber-300">
                {user.coins.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">Coins</div>
            </div>
          </div>

          {/* Connected Login Provider */}
          <div className="my-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Connected Login:</span>
            <span className="font-semibold text-rose-300">
              {user.loginProvider === 'phone'
                ? `📱 ${user.phone || 'Phone No.'}`
                : user.loginProvider === 'google'
                ? `✨ ${user.email || 'Gmail'}`
                : user.loginProvider === 'facebook'
                ? `🌐 Facebook`
                : 'Guest Account'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => {
                closeModal();
                openModal('login');
              }}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>🔑 Switch / Login</span>
            </button>
            <button
              onClick={() => {
                closeModal();
                openModal('recharge');
              }}
              className="py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
            >
              <Coins className="w-3.5 h-3.5 fill-slate-950" />
              <span>Recharge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};
