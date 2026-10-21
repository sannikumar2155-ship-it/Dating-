import React, { useState } from 'react';
import {
  Flame,
  Gift,
  Heart,
  Mic,
  Plus,
  Search,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Room } from '../types';

export const RoomLobby: React.FC = () => {
  const {
    rooms,
    enterRoom,
    openModal,
    dailyRewardClaimed,
    claimDailyReward,
    followingIds,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRooms = rooms.filter((room) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'following'
        ? followingIds.includes(room.hostId)
        : room.category === activeCategory;

    const matchesSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Hero Highlight & Daily Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Main Event Showcase Banner */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-rose-500/20 bg-gradient-to-r from-rose-950/80 via-purple-950/70 to-slate-950 p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-xl">
          <div className="absolute inset-0 bg-radial from-rose-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 mb-2">
              <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
              <span>Weekend Cupid Carnival · 100,000 Diamonds Prize Pool</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-xl text-balance">
              Find Your Soulmate On Voice Stage Or Battle In 1v1 PK!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-lg">
              Jump into 8-seat audio party rooms, confess with mutual heart radar, send luxury gift combos, and cheer your clan to victory.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => enterRoom('room_cupid_dating')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              Join Dating Room
            </button>
            <button
              onClick={() => openModal('create_room')}
              className="px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-rose-400" />
              Create Voice Room
            </button>
          </div>
        </div>

        {/* Daily Bonus & Quick Actions Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Daily Check-In
              </span>
              <span className="text-xs text-slate-400">Day 4 Streak</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Claim Free Coins</h3>
            <p className="text-slate-400 text-xs mt-1">
              Check in daily to receive free coins for room gifts, lucky wheel spins, and emoji blasts!
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl">
                  🪙
                </div>
                <div>
                  <div className="text-sm font-bold text-amber-200">+300 Free Coins</div>
                  <div className="text-[11px] text-amber-400/80">Available now</div>
                </div>
              </div>
              <button
                onClick={claimDailyReward}
                disabled={dailyRewardClaimed}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  dailyRewardClaimed
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-sm active:scale-95'
                }`}
              >
                {dailyRewardClaimed ? 'Claimed ✓' : 'Claim'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => openModal('games')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>🎲 Games</span>
            </button>
            <button
              onClick={() => openModal('recharge')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>💎 Store</span>
            </button>
            <button
              onClick={() => openModal('download')}
              className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>📲 Install</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Interactive Filter Buttons (segmented control) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Rooms' },
            { id: 'dating', label: 'Dating & Match' },
            { id: 'pk', label: '1v1 PK Battles' },
            { id: 'family', label: 'Family Clans' },
            { id: 'games', label: 'Games' },
            { id: 'following', label: 'Following' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search room title, host, or clan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const occupiedSeatsCount = room.seats.filter((s) => s.userId).length;
          return (
            <div
              key={room.id}
              onClick={() => enterRoom(room.id)}
              className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-rose-500/40 transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              {/* Card Header: Host Avatar & Status */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={room.hostAvatar}
                        alt={room.hostName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500/40 group-hover:ring-rose-500 transition-all"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                        <Mic className="w-2.5 h-2.5 text-white" />
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors flex items-center gap-1.5">
                        {room.hostName}
                        {room.familyName && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                            {room.familyName.split(' ')[0]}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{room.tagline}</p>
                    </div>
                  </div>

                  {/* Online count */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-semibold text-rose-300 shrink-0">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span className="tabular-nums font-mono">{room.onlineCount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Room Title */}
                <h3 className="font-display text-base font-bold text-white tracking-tight group-hover:text-rose-100 transition-colors mb-2">
                  {room.title}
                </h3>

                {/* Special Mode Badges */}
                {room.isPKActive && room.pkBattle && (
                  <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-red-950/60 to-blue-950/60 border border-red-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-red-400 font-bold">
                      <Swords className="w-3.5 h-3.5" />
                      <span>1v1 PK Duel</span>
                    </div>
                    <div className="text-slate-300 font-mono text-[11px]">
                      {room.pkBattle.redTeam.score} vs {room.pkBattle.blueTeam.score}
                    </div>
                  </div>
                )}

                {room.isDatingMode && (
                  <div className="mb-3 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300">
                    <span className="flex items-center gap-1 font-semibold">
                      <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                      Cupid Blind Date Mode
                    </span>
                    <span className="text-[11px] text-rose-400/80">Mutual Heart Radar</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Seat Avatars & Join Button */}
              <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {room.seats
                      .filter((s) => s.userId)
                      .slice(0, 4)
                      .map((seat) => (
                        <img
                          key={seat.seatIndex}
                          src={seat.userAvatar}
                          alt={seat.userName}
                          className="w-6 h-6 rounded-full object-cover ring-2 ring-slate-900"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {occupiedSeatsCount}/8 mics
                  </span>
                </div>

                <button className="px-3.5 py-1.5 rounded-xl bg-slate-800 group-hover:bg-rose-500 text-slate-200 group-hover:text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm">
                  <span>Enter</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
          <div className="text-4xl mb-3">🎙️</div>
          <h3 className="text-lg font-bold text-white">No rooms found</h3>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};
