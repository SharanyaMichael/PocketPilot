import React, { useState } from 'react';
import { Snowflake, Clock, AlertTriangle, CheckCircle, X, Wallet } from 'lucide-react';

export default function CoolingOffModal({ isOpen, onClose, mode = 'TIME_WINDOW' }) {
  // Load saved silent nudge window
  const [nudgeSettings, setNudgeSettings] = useState(() => {
    const saved = localStorage.getItem('pocketpilot_nudge_window');
    return saved ? JSON.parse(saved) : { enabled: false, startTime: '22:00', endTime: '06:00', locked: false };
  });

  const [tempStart, setTempStart] = useState(nudgeSettings.startTime);
  const [tempEnd, setTempEnd] = useState(nudgeSettings.endTime);

  // Load saved persistent daily budget
  const [dailyLimit, setDailyLimit] = useState(() => {
    const saved = localStorage.getItem('pocketpilot_daily_limit');
    return saved ? JSON.parse(saved) : { amount: '', locked: false };
  });
  const [tempLimit, setTempLimit] = useState(dailyLimit.amount);

  if (!isOpen) return null;

  const handleLockWindow = (e) => {
    e.preventDefault();
    const updated = { enabled: true, startTime: tempStart, endTime: tempEnd, locked: true };
    setNudgeSettings(updated);
    localStorage.setItem('pocketpilot_nudge_window', JSON.stringify(updated));
  };

  const handleSaveDailyLimit = (e) => {
    e.preventDefault();
    if (!tempLimit) return;
    const updated = { amount: tempLimit, locked: true };
    setDailyLimit(updated);
    localStorage.setItem('pocketpilot_daily_limit', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#07130E] border border-[#1C3930] rounded-2xl w-full max-w-lg p-6 text-[#F0FDF4] shadow-2xl relative space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C3930] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10B981]">
              {mode === 'DAILY_BUDGET' ? <Wallet className="w-5 h-5" /> : <Snowflake className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {mode === 'DAILY_BUDGET' ? 'Daily Budget Guardrail' : 'Cooling-Off Guardrails'}
              </h2>
              <p className="text-xs text-[#9CAFA3]">
                {mode === 'DAILY_BUDGET' ? 'Configure your permanent daily spend limit.' : 'Configure impulsive spending protection windows.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-white hover:bg-[#122A22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on Mode */}
        {mode === 'DAILY_BUDGET' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-semibold">Automated Daily Spend Limit</h3>
            </div>
            <p className="text-xs text-[#9CAFA3]">
              Set your maximum daily budget. Once configured, it will apply automatically every single day until you manually modify or reset it.
            </p>

            {dailyLimit.locked ? (
              <div className="bg-[#050B09] border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#F0FDF4]">
                      Active Daily Limit: <span className="text-[#10B981]">₹ {dailyLimit.amount}</span> / day
                    </p>
                    <p className="text-[11px] text-[#9CAFA3]">Permanent daily budget active.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const reset = { amount: '', locked: false };
                    setDailyLimit(reset);
                    setTempLimit('');
                    localStorage.removeItem('pocketpilot_daily_limit');
                  }}
                  className="text-[11px] text-red-400 hover:underline shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveDailyLimit} className="bg-[#050B09] border border-[#1C3930] p-4 rounded-xl space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#9CAFA3] mb-1">Enter Daily Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(e.target.value)}
                    className="w-full bg-[#091510] border border-[#1C3930] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                    required
                  />
                </div>

                <p className="text-[10px] text-amber-400/90 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  Applies daily until you manually change it.
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-[#050B09] font-bold text-xs transition-all"
                  >
                    Save Daily Budget
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-semibold">Vulnerable Time Window Nudge</h3>
            </div>
            <p className="text-xs text-[#9CAFA3]">
              Set a one-time mindful window. Transactions attempted during this period will trigger a gentle YouTube/Instagram-style confirmation nudge.
            </p>

            {nudgeSettings.locked ? (
              <div className="bg-[#050B09] border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#10B981] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#F0FDF4]">
                      Window Locked: <span className="text-[#10B981]">{nudgeSettings.startTime} to {nudgeSettings.endTime}</span>
                    </p>
                    <p className="text-[11px] text-[#9CAFA3]">Silent mindfulness nudge is active.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const reset = { enabled: false, startTime: '22:00', endTime: '06:00', locked: false };
                    setNudgeSettings(reset);
                    localStorage.setItem('pocketpilot_nudge_window', JSON.stringify(reset));
                  }}
                  className="text-[11px] text-red-400 hover:underline shrink-0"
                >
                  Reset
                </button>
              </div>
            ) : (
              <form onSubmit={handleLockWindow} className="bg-[#050B09] border border-[#1C3930] p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#9CAFA3] mb-1">Start Time</label>
                    <input
                      type="time"
                      value={tempStart}
                      onChange={(e) => setTempStart(e.target.value)}
                      className="w-full bg-[#091510] border border-[#1C3930] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#9CAFA3] mb-1">End Time</label>
                    <input
                      type="time"
                      value={tempEnd}
                      onChange={(e) => setTempEnd(e.target.value)}
                      className="w-full bg-[#091510] border border-[#1C3930] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10B981]"
                      required
                    />
                  </div>
                </div>

                <p className="text-[10px] text-amber-400/90 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  Can be configured once to prevent impulsive edits.
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-[#050B09] font-bold text-xs transition-all"
                  >
                    Lock Time Window
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer Close */}
        <div className="flex justify-end pt-2 border-t border-[#1C3930]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#122A22] hover:bg-[#1C3930] text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}