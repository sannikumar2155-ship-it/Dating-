import React, { useState } from 'react';
import { Award, Check, Clock, Heart, Shield, ShieldAlert, Sparkles, UserCheck, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_VOLUNTEERS } from '../data/mockData';
import { VolunteerMember } from '../types';

export const VolunteersModal: React.FC = () => {
  const { activeModal, closeModal, user, setUser } = useApp();

  const [volunteers, setVolunteers] = useState<VolunteerMember[]>(INITIAL_VOLUNTEERS);
  const [applyStep, setApplyStep] = useState<'view' | 'apply' | 'success'>('view');
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [reason, setReason] = useState('I love helping new streamers feel welcome and keeping the audio room positive!');

  if (activeModal !== 'volunteers') return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      isVolunteer: true,
      volunteerRank: 'Community Guardian',
    }));
    setApplyStep('success');
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
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Community Volunteers</h3>
              <p className="text-xs text-slate-400">Room Guardians ensuring safe, welcoming voice party rooms</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {applyStep === 'view' && (
          <div>
            {/* Guardian Mission Hero */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Guardian Council
                </span>
                <span className="text-xs text-slate-400">24/7 Community Care</span>
              </div>
              <h4 className="font-display text-lg font-bold text-white">
                Protecting Love, Duets & Good Vibes
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Room volunteers are community champions who welcome newcomers, assist stage hosts, resolve audio disputes, and prevent spam or harassment.
              </p>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setApplyStep('apply')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Apply for Room Volunteer</span>
                </button>
              </div>
            </div>

            {/* Guardian Perks */}
            <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-lg mb-1">🛡️</div>
                <div className="text-xs font-bold text-white">Guardian Badge</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Exclusive green shield icon</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-lg mb-1">🎙️</div>
                <div className="text-xs font-bold text-white">Mic Controls</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Mute trolls & manage seats</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="text-lg mb-1">💎</div>
                <div className="text-xs font-bold text-white">Monthly Stipend</div>
                <div className="text-[10px] text-slate-400 mt-0.5">+5,000 Diamonds monthly</div>
              </div>
            </div>

            {/* Active Guardians on Duty List */}
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Guardians Currently On Duty
              </h5>
              <div className="space-y-2">
                {volunteers.map((vol) => (
                  <div
                    key={vol.id}
                    className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={vol.avatar}
                          alt={vol.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{vol.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                            {vol.rank}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {vol.hoursActive} Hours logged · {vol.roomsProtected} Rooms protected
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      On Duty
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {applyStep === 'apply' && (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
              <strong className="block font-bold text-white mb-1">Guardian Oath & Requirements:</strong>
              • Be friendly, respectful, and impartial during audio disputes.<br />
              • Welcome new listeners and encourage positive chat.<br />
              • Help stage hosts keep room energy high.
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Why do you want to become a Room Volunteer?
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pledge"
                checked={pledgeChecked}
                onChange={(e) => setPledgeChecked(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-800 border-slate-700"
                required
              />
              <label htmlFor="pledge" className="text-xs text-slate-300 cursor-pointer">
                I agree to the Community Code of Conduct and commit to at least 2 hours weekly.
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyStep('view')}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!pledgeChecked}
                className="w-2/3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}

        {applyStep === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-3xl">
              🛡️
            </div>
            <h4 className="font-display text-lg font-bold text-white">Application Approved!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1 mb-5">
              Welcome to the Guardian Council! You now have the Guardian Shield badge and moderation tools in all party rooms.
            </p>
            <button
              onClick={() => {
                setApplyStep('view');
                closeModal();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs cursor-pointer shadow-md"
            >
              Back to Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
