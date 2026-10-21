import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  Flame,
  Gift,
  Heart,
  Mic,
  MicOff,
  MoreVertical,
  Plus,
  Send,
  Share2,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Seat } from '../types';

export const LivePartyRoom: React.FC = () => {
  const {
    currentRoom,
    leaveRoom,
    user,
    mySeatIndex,
    takeSeat,
    leaveSeat,
    isMicMuted,
    toggleMic,
    isUserSpeaking,
    sendCupidHeart,
    volunteerMuteSeat,
    volunteerKickSeat,
    openModal,
    setSelectedGiftRecipient,
    recentGiftEvent,
    floatingEmojis,
    triggerFloatingEmoji,
    messages,
    sendMessage,
    pkBattle,
    supportPKTeam,
    startPKBattle,
    isFollowing,
    toggleFollow,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedSeatAction, setSelectedSeatAction] = useState<Seat | null>(null);
  const [targetHeartSeat, setTargetHeartSeat] = useState<number>(1);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentRoom) return null;

  const isHostFollowed = isFollowing(currentRoom.hostId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // PK Battle Tug-of-war calculations
  const redScore = pkBattle?.redTeam.score || 1;
  const blueScore = pkBattle?.blueTeam.score || 1;
  const totalPK = redScore + blueScore;
  const redPercent = Math.max(15, Math.min(85, Math.round((redScore / totalPK) * 100)));
  const bluePercent = 100 - redPercent;

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 filter blur-2xl pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${currentRoom.bgImage || currentRoom.hostAvatar})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950 pointer-events-none" />

      {/* Floating Emojis Canvas Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-24 text-3xl sm:text-4xl animate-float-emoji select-none"
            style={{ left: `${item.leftPercent}%` }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Luxury Gift Animation Fly-In Banner */}
      {recentGiftEvent && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-600/95 via-purple-600/95 to-amber-500/95 shadow-2xl border border-white/30 backdrop-blur-md flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce">{recentGiftEvent.gift.icon}</span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Luxury Gift Alert!
                </div>
                <div className="text-sm font-bold truncate">
                  <span className="text-white font-extrabold">{recentGiftEvent.senderName}</span>{' '}
                  <span className="text-white/80">sent</span>{' '}
                  <span className="text-amber-200 font-extrabold">{recentGiftEvent.gift.name}</span>
                </div>
                <div className="text-xs text-rose-100">to {recentGiftEvent.receiverName}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black italic text-amber-300 animate-pulse font-mono">
                x{recentGiftEvent.comboCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 1. ROOM TOP HEADER */}
      <div className="relative z-20 px-4 py-3 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md flex items-center justify-between gap-3">
        {/* Left: Host Info & Follow */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={leaveRoom}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Leave room"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-900/90 border border-slate-800">
            <img
              src={currentRoom.hostAvatar}
              alt={currentRoom.hostName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {currentRoom.hostName}
                </span>
                {currentRoom.familyName && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                    {currentRoom.familyName.split(' ')[0]}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-0.5 text-rose-400 font-semibold">
                  <Flame className="w-3 h-3 fill-rose-400" />
                  {currentRoom.onlineCount.toLocaleString()}
                </span>
                <span>ID: {currentRoom.id.slice(0, 8)}</span>
              </div>
            </div>

            <button
              onClick={() => toggleFollow(currentRoom.hostId)}
              className={`ml-2 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isHostFollowed
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
              }`}
            >
              {isHostFollowed ? (
                <>
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Room Badges & Actions */}
        <div className="flex items-center gap-2">
          {/* Volunteer / Guardian Status */}
          <button
            onClick={() => openModal('volunteers')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-pointer hover:bg-emerald-500/20 transition-colors"
            title="Volunteer Moderation Active"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Guardian Duty</span>
          </button>

          {/* Quick Gift to Host button */}
          <button
            onClick={() => {
              setSelectedGiftRecipient('host');
              openModal('gift');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Gift Host</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              sendMessage(`🔗 Room link copied! Share with friends to join the party!`);
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Share Room"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 1v1 PK BATTLE HEADER (IF ACTIVE) */}
      {currentRoom.isPKActive && pkBattle && (
        <div className="relative z-20 px-4 py-3 bg-gradient-to-r from-red-950/90 via-slate-900/90 to-blue-950/90 border-b border-red-500/30 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {/* Top PK Status & Countdown */}
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <div className="flex items-center gap-2 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-bold">RED TEAM: {pkBattle.redTeam.hostName}</span>
              </div>
              <div className="px-3 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-amber-300 font-mono font-bold flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-rose-400" />
                <span>PK 02:28</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <span className="font-bold">BLUE TEAM: {pkBattle.blueTeam.hostName}</span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </div>

            {/* Tug of war bar */}
            <div className="h-4 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800 relative shadow-inner">
              <div
                className="bg-gradient-to-r from-red-600 to-rose-500 h-full flex items-center px-2 text-[10px] font-black text-white transition-all duration-500"
                style={{ width: `${redPercent}%` }}
              >
                {redScore.toLocaleString()} pts
              </div>
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full flex items-center justify-end px-2 text-[10px] font-black text-white transition-all duration-500"
                style={{ width: `${bluePercent}%` }}
              >
                {blueScore.toLocaleString()} pts
              </div>
            </div>

            {/* PK Quick Support Buttons & Punishment info */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <button
                onClick={() => supportPKTeam('red', 200)}
                className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>🔥 Support Red (+200)</span>
              </button>

              <div className="text-[11px] text-slate-300 text-center truncate px-2 font-medium">
                Punishment: <span className="text-amber-300">{pkBattle.punishment}</span>
              </div>

              <button
                onClick={() => supportPKTeam('blue', 200)}
                className="px-3 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>⚡ Support Blue (+200)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DATING MODE CUPID RADAR BANNER (IF DATING ACTIVE) */}
      {currentRoom.isDatingMode && (
        <div className="relative z-10 px-4 py-1.5 bg-rose-500/15 border-b border-rose-500/30 flex items-center justify-between text-xs text-rose-200">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span className="font-bold">Cupid Blind Date Mode:</span>
            <span>Tap your favorite seat to send a secret heart match request!</span>
          </div>
          {mySeatIndex !== null && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-rose-300">Choose match:</span>
              <select
                value={targetHeartSeat}
                onChange={(e) => setTargetHeartSeat(Number(e.target.value))}
                className="bg-slate-900 border border-rose-500/40 rounded px-2 py-0.5 text-xs text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8]
                  .filter((i) => i !== mySeatIndex)
                  .map((i) => (
                    <option key={i} value={i}>
                      Seat #{i}
                    </option>
                  ))}
              </select>
              <button
                onClick={() => sendCupidHeart(mySeatIndex, targetHeartSeat)}
                className="px-2.5 py-0.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                <Heart className="w-3 h-3 fill-white" />
                <span>Send Heart</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. MAIN STAGE: 8-SEAT VOICE MIC GRID */}
      <div className="relative z-10 flex-1 px-4 py-4 max-w-5xl mx-auto w-full flex flex-col justify-center">
        <div className="grid grid-cols-4 gap-3 sm:gap-6 py-2">
          {currentRoom.seats.map((seat) => {
            const isOccupied = !!seat.userId;
            const isMe = seat.userId === user.id;
            const speakingNow = isMe ? isUserSpeaking : seat.isSpeaking;

            return (
              <div
                key={seat.seatIndex}
                onClick={() => setSelectedSeatAction(seat)}
                className={`relative flex flex-col items-center justify-center p-3 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer ${
                  isOccupied
                    ? 'bg-slate-900/80 border-slate-700/80 hover:border-rose-500/60 shadow-lg'
                    : 'bg-slate-900/40 border-dashed border-slate-800 hover:border-slate-600 hover:bg-slate-900/60'
                }`}
              >
                {/* Seat Number Tag */}
                <span className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 font-bold">
                  #{seat.seatIndex}
                </span>

                {/* Received Gift Value tag */}
                {seat.receivedGiftsValue > 0 && (
                  <span className="absolute top-2 right-2 flex items-center gap-0.5 text-[9px] font-bold text-amber-300 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                    <span>🪙</span>
                    <span className="tabular-nums font-mono">{seat.receivedGiftsValue}</span>
                  </span>
                )}

                {/* Avatar / Mic Orb */}
                <div className="relative my-1">
                  {isOccupied ? (
                    <div
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-transform ${
                        speakingNow ? 'speaking-pulse scale-105' : ''
                      }`}
                    >
                      <img
                        src={seat.userAvatar}
                        alt={seat.userName}
                        className={`w-full h-full rounded-full object-cover ring-2 ${
                          speakingNow ? 'ring-rose-500' : 'ring-slate-700'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      {/* Gender Badge */}
                      {seat.gender && (
                        <span
                          className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white ${
                            seat.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                          }`}
                        >
                          {seat.gender === 'female' ? '♀' : '♂'}
                        </span>
                      )}

                      {/* Mic Status */}
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                          seat.isMuted ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                      >
                        {seat.isMuted ? (
                          <MicOff className="w-2.5 h-2.5" />
                        ) : (
                          <Mic className="w-2.5 h-2.5" />
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center text-slate-400 group-hover:text-rose-400 transition-colors">
                      <Mic className="w-5 h-5 text-slate-500" />
                      <span className="text-[10px] mt-0.5 font-semibold text-slate-400">Empty</span>
                    </div>
                  )}
                </div>

                {/* User Name & Status */}
                <div className="text-center w-full mt-1">
                  {isOccupied ? (
                    <>
                      <div className="text-xs font-bold text-white truncate max-w-[80px] sm:max-w-[110px] mx-auto">
                        {seat.userName}
                        {isMe && <span className="text-rose-400"> (You)</span>}
                      </div>

                      {/* Mutual Heart Match badge if applicable */}
                      {seat.matchedWith ? (
                        <div className="mt-1 flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                          <Heart className="w-2.5 h-2.5 fill-rose-400" />
                          <span>Matched #{seat.matchedWith}</span>
                        </div>
                      ) : seat.heartMatchTarget ? (
                        <div className="text-[10px] text-pink-400/80 font-mono">
                          Crush on #{seat.heartMatchTarget}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-mono">
                          {speakingNow ? 'Speaking...' : 'Listening'}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        takeSeat(seat.seatIndex);
                      }}
                      className="text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      + Take Seat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. LIVE CHAT & AUDIENCE FEED */}
      <div className="relative z-10 px-4 max-w-5xl mx-auto w-full mb-3">
        <div className="h-36 sm:h-44 overflow-y-auto rounded-2xl bg-slate-950/70 border border-slate-800/80 p-3 space-y-2 backdrop-blur-sm shadow-inner text-xs">
          {messages.map((msg) => (
            <div key={msg.id} className="leading-relaxed">
              {msg.type === 'system' && (
                <div className="text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{msg.text}</span>
                </div>
              )}

              {msg.type === 'volunteer' && (
                <div className="text-emerald-300 font-semibold flex items-center gap-1.5 bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-500/20">
                  <Shield className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>
                    <strong className="text-emerald-200">{msg.senderName}:</strong> {msg.text}
                  </span>
                </div>
              )}

              {msg.type === 'match' && (
                <div className="text-rose-300 font-bold flex items-center gap-1.5 bg-rose-950/40 p-1.5 rounded-lg border border-rose-500/30">
                  <Heart className="w-3.5 h-3.5 shrink-0 fill-rose-400" />
                  <span>{msg.text}</span>
                </div>
              )}

              {msg.type === 'gift' && (
                <div className="text-purple-300 font-semibold flex items-center gap-1 bg-purple-950/30 p-1 rounded-lg border border-purple-500/20">
                  <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    <span className="text-white font-bold">{msg.senderName}</span> {msg.text}
                  </span>
                </div>
              )}

              {msg.type === 'user' && (
                <div className="text-slate-200">
                  {msg.senderVip && (
                    <span className="mr-1.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      VIP {msg.senderVip}
                    </span>
                  )}
                  {msg.senderFamilyBadge && (
                    <span className="mr-1.5 px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                      {msg.senderFamilyBadge}
                    </span>
                  )}
                  {msg.isVolunteer && (
                    <span className="mr-1.5 px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      🛡️ Guardian
                    </span>
                  )}
                  <span className="font-bold text-slate-300">{msg.senderName}: </span>
                  <span className="text-slate-100">{msg.text}</span>
                </div>
              )}
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* 6. BOTTOM ACTION TOOLBAR */}
      <div className="relative z-20 px-4 py-3 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Chat Input & Fast Send */}
          <form onSubmit={handleSendMessage} className="flex-1 w-full flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Send message to room..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-all active:scale-95 cursor-pointer shrink-0"
              title="Send chat"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Floating Emojis bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {['❤️', '🔥', '💋', '👑', '🥳', '🌹', '💎', '🚀'].map((em) => (
              <button
                key={em}
                onClick={() => triggerFloatingEmoji(em)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-base hover:scale-125 transition-transform active:scale-95 cursor-pointer shrink-0"
                title={`Send ${em}`}
              >
                {em}
              </button>
            ))}
          </div>

          {/* Room Controls (Mic, Sit, PK, Games, Gifts) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mic Toggle if on seat */}
            {mySeatIndex !== null && (
              <button
                onClick={toggleMic}
                className={`p-2.5 rounded-full font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-xs ${
                  isMicMuted
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
                title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{isMicMuted ? 'Muted' : 'Speaking'}</span>
              </button>
            )}

            {/* Leave seat button if on seat */}
            {mySeatIndex !== null && (
              <button
                onClick={leaveSeat}
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Leave Seat
              </button>
            )}

            {/* In-room Mini Games */}
            <button
              onClick={() => openModal('games')}
              className="p-2.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Play Mini-Games"
            >
              <span>🎲</span>
              <span className="hidden sm:inline font-semibold">Games</span>
            </button>

            {/* 1v1 PK Duel Trigger */}
            <button
              onClick={() => {
                if (currentRoom.isPKActive) {
                  openModal('pk');
                } else {
                  startPKBattle();
                }
              }}
              className="p-2.5 rounded-full bg-gradient-to-r from-red-600/30 to-blue-600/30 border border-red-500/40 hover:border-red-400 text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
              title="1v1 PK Duel"
            >
              <Swords className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline font-bold">PK Battle</span>
            </button>

            {/* Primary Gifting Button */}
            <button
              onClick={() => {
                setSelectedGiftRecipient('host');
                openModal('gift');
              }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-rose-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4" />
              <span>Send Gift</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEAT ACTION MODAL (WHEN A SEAT IS CLICKED) */}
      {selectedSeatAction && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedSeatAction(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">Seat #{selectedSeatAction.seatIndex} Details</h3>
              <button
                onClick={() => setSelectedSeatAction(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {selectedSeatAction.userId ? (
              <div className="text-center">
                <img
                  src={selectedSeatAction.userAvatar}
                  alt={selectedSeatAction.userName}
                  className="w-20 h-20 rounded-full mx-auto object-cover ring-2 ring-rose-500 mb-2"
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-bold text-base">{selectedSeatAction.userName}</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Gifts Received: {selectedSeatAction.receivedGiftsValue} coins
                </p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => {
                      setSelectedGiftRecipient(selectedSeatAction.seatIndex);
                      setSelectedSeatAction(null);
                      openModal('gift');
                    }}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Send Gift</span>
                  </button>

                  {mySeatIndex !== null && mySeatIndex !== selectedSeatAction.seatIndex && (
                    <button
                      onClick={() => {
                        sendCupidHeart(mySeatIndex, selectedSeatAction.seatIndex);
                        setSelectedSeatAction(null);
                      }}
                      className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-400" />
                      <span>Send Heart</span>
                    </button>
                  )}
                </div>

                {/* Volunteer Guardian Controls */}
                {user.isVolunteer && (
                  <div className="pt-3 border-t border-slate-800">
                    <div className="text-[11px] text-emerald-400 font-semibold mb-2 flex items-center justify-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Guardian Moderation Tools</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          volunteerMuteSeat(selectedSeatAction.seatIndex);
                          setSelectedSeatAction(null);
                        }}
                        className="p-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                      >
                        {selectedSeatAction.isMuted ? 'Unmute Mic' : 'Mute Mic'}
                      </button>
                      <button
                        onClick={() => {
                          volunteerKickSeat(selectedSeatAction.seatIndex);
                          setSelectedSeatAction(null);
                        }}
                        className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold hover:bg-red-900 cursor-pointer"
                      >
                        Kick from Seat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Mic className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-300">This seat is currently empty</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Take the mic to speak, sing, or find your cupid match on stage!
                </p>
                <button
                  onClick={() => {
                    takeSeat(selectedSeatAction.seatIndex);
                    setSelectedSeatAction(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  Sit on Seat #{selectedSeatAction.seatIndex}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
