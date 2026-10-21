import React, { useState } from 'react';
import { Mic, Plus, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Room } from '../types';

export const CreateRoomModal: React.FC = () => {
  const { activeModal, closeModal, createCustomRoom } = useApp();

  const [title, setTitle] = useState('Cupid Duet & Late Night Confessions');
  const [tagline, setTagline] = useState('Chill voice room with music, matchmaking, and gift drops ❤️');
  const [category, setCategory] = useState<Room['category']>('dating');

  if (activeModal !== 'create_room') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createCustomRoom(title.trim(), category, tagline.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Create Voice Party Room</h3>
              <p className="text-xs text-slate-400">Open your 8-seat audio stage</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Room Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Leo's Cupid Lounge"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Room Category:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dating', label: '❤️ Cupid Dating' },
                { id: 'pk', label: '⚔️ 1v1 PK Arena' },
                { id: 'family', label: '🏛️ Family Clan' },
                { id: 'games', label: '🎲 Mini Games' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    category === c.id
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Room Tagline:
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Short bio or room rules"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Live Room</span>
          </button>
        </form>
      </div>
    </div>
  );
};
