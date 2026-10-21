import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Calendar, Check, Gift, Heart, Sparkles, Trophy, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_EVENTS } from '../data/mockData';
import { AppEvent } from '../types';

export const EventsModal: React.FC = () => {
  const { activeModal, closeModal, user, setUser } = useApp();

  const [events, setEvents] = useState<AppEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent>(INITIAL_EVENTS[0]);

  if (activeModal !== 'events') return null;

  const handleClaimQuest = (questId: string, reward: number) => {
    // Add reward
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + reward,
    }));

    // Update quest claimed status
    setEvents((prev) =>
      prev.map((ev) => ({
        ...ev,
        quests: ev.quests.map((q) =>
          q.id === questId ? { ...q, claimed: true } : q
        ),
      }))
    );

    setSelectedEvent((curr) => ({
      ...curr,
      quests: curr.quests.map((q) =>
        q.id === questId ? { ...q, claimed: true } : q
      ),
    }));

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
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
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Events & Grand Prizes</h3>
              <p className="text-xs text-slate-400">Complete quests, climb rankings, win rare flairs</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedEvent.id === ev.id
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {ev.title.split(' ')[0]} {ev.title.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Selected Event Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-purple-950/60 to-slate-900 border border-rose-500/30 mb-5">
          <div className="flex items-center justify-between text-xs text-rose-300 mb-2">
            <span className="font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {selectedEvent.endTime}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono">
              Pool: {selectedEvent.prizePool}
            </span>
          </div>

          <h4 className="font-display text-xl font-bold text-white">{selectedEvent.title}</h4>
          <p className="text-xs text-slate-300 mt-1">{selectedEvent.subtitle}</p>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Event Rules & Objectives
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedEvent.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">·</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Event Quests & Tasks */}
        <div>
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Event Quests (Claim Free Coins)
          </h5>
          <div className="space-y-2.5">
            {selectedEvent.quests.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{q.task}</div>
                  <div className="text-[11px] font-mono text-amber-300 font-semibold mt-0.5 flex items-center gap-1">
                    <span>🪙</span>
                    <span>+{q.reward} Coins</span>
                  </div>
                </div>

                <div>
                  {q.claimed ? (
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-500 text-xs font-bold">
                      Claimed ✓
                    </span>
                  ) : q.completed ? (
                    <button
                      onClick={() => handleClaimQuest(q.id, q.reward)}
                      className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 text-xs font-medium">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
