import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatCountdown, formatDate } from '../utils/formatters';
import {
  ShieldAlert,
  Timer,
  Play,
  Square,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PiggyBank,
  ArrowRight,
  Flame,
  Plus,
  Wallet
} from 'lucide-react';

const DURATION_PRESETS = [
  { label: '5 Minutes', seconds: 300 },
  { label: '15 Minutes', seconds: 900 },
  { label: '30 Minutes', seconds: 1800 },
  { label: '1 Hour', seconds: 3600 },
];

export default function CoolingOffPage({ onOpenNewTransaction }) {
  const { cooldown, activateCooldown, cancelCooldownSession, cooldownLogs, dailyLimit, updateDailyLimit } = useFinance();

  const [selectedDuration, setSelectedDuration] = useState(900); // 15 mins default
  const [customMinutes, setCustomMinutes] = useState('');
  const [reason, setReason] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handleStartCooldown = async () => {
    setIsActivating(true);
    let duration = selectedDuration;
    if (customMinutes && parseInt(customMinutes) > 0) {
      duration = parseInt(customMinutes) * 60;
    }

    try {
      await activateCooldown(duration, reason || 'Discretionary spending pause');
      setReason('');
      setCustomMinutes('');
    } finally {
      setIsActivating(false);
    }
  };

  const handleCancelSession = async () => {
    if (window.confirm('Are you sure you want to stop the active Cooling-Off session early?')) {
      await cancelCooldownSession();
    }
  };

  // Calculate total money saved by cancelled purchases in log
  const totalMoneySaved = cooldownLogs
    .filter(log => log.action_taken === 'cancelled')
    .reduce((sum, log) => sum + log.attempted_amount, 0);

  const cancelledCount = cooldownLogs.filter(l => l.action_taken === 'cancelled').length;
  const continuedCount = cooldownLogs.filter(l => l.action_taken === 'continued').length;
  const overrodeCount = cooldownLogs.filter(l => l.action_taken === 'overrode').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0D1D16] to-[#091510] border border-[rgba(110,231,183,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30">
              Core Differentiator
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
            Global Cooling-Off Mode
          </h1>
          <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
            Behavioral friction to break impulsive spending loops. One global persistent session across the entire system.
          </p>
        </div>

        {/* Test Interception CTA */}
        <button
          onClick={onOpenNewTransaction}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#11251B] hover:bg-[#163023] border border-[#10B981]/40 text-[#6EE7B7] font-semibold text-xs transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#10B981]" />
          <span>Test Expense Intercept</span>
        </button>
      </div>

      {/* Optional Daily Spend Limit Section */}
      <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-sm font-bold text-[#F0FDF4]">Optional Daily Spend Limit</h2>
          </div>
          <p className="text-xs text-[#A7C4B5]">
            Set an automated daily limit. Whenever any transaction crosses this cap, an instant cooling-off pop-up will offer you a choice to skip & back off or proceed.
          </p>
        </div>

        <div className="min-w-[220px] relative">
          <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono text-sm">₹</span>
          <input
            type="number"
            min="0"
            step="100"
            placeholder="Disabled (e.g. 2000)"
            value={dailyLimit}
            onChange={(e) => updateDailyLimit(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.2)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] font-mono placeholder:text-[#A7C4B5]/40"
          />
        </div>
      </div>

      {/* Main Status & Activation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Session Display / Activator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {cooldown.is_active ? (
            <div className="p-6 rounded-2xl bg-[#0D1D16] border border-[#10B981]/40 emerald-glow shadow-2xl relative overflow-hidden">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#11251B] border border-[#10B981]/40 text-[#6EE7B7]">
                    <ShieldAlert className="w-8 h-8 text-[#10B981] animate-pulse" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/40 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                      Session Active
                    </span>
                    <h2 className="text-lg font-bold text-[#F0FDF4]">Impulse Shield Engaged</h2>
                  </div>
                </div>

                <button
                  onClick={handleCancelSession}
                  className="px-3 py-1.5 rounded-xl bg-[#FB7185]/10 hover:bg-[#FB7185]/20 border border-[#FB7185]/30 text-[#FB7185] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop Session</span>
                </button>
              </div>

              {/* Large Visible Countdown */}
              <div className="py-6 my-2 text-center rounded-2xl bg-[#091510] border border-[rgba(110,231,183,0.16)]">
                <div className="text-[11px] uppercase tracking-wider text-[#A7C4B5] font-semibold mb-1">
                  Remaining Cooldown Time
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-[#6EE7B7]">
                  {formatCountdown(cooldown.remaining_seconds)}
                </div>
                {cooldown.reason && (
                  <p className="text-xs text-[#A7C4B5] mt-2 italic">
                    Reason: "{cooldown.reason}"
                  </p>
                )}
              </div>

              {/* Session Timestamps */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-[#11251B] border border-[rgba(110,231,183,0.12)]">
                  <span className="text-[#A7C4B5] block mb-0.5">Activated At:</span>
                  <strong className="text-[#F0FDF4] font-mono">
                    {cooldown.start_time ? new Date(cooldown.start_time).toLocaleTimeString() : 'N/A'}
                  </strong>
                </div>
                <div className="p-3 rounded-xl bg-[#11251B] border border-[rgba(110,231,183,0.12)]">
                  <span className="text-[#A7C4B5] block mb-0.5">Expires At:</span>
                  <strong className="text-[#6EE7B7] font-mono">
                    {cooldown.expiry_time ? new Date(cooldown.expiry_time).toLocaleTimeString() : 'N/A'}
                  </strong>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-[#A7C4B5] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Timer strictly persists across browser refreshes, tab changes, and backend reboots.</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#11251B] border border-white/5 text-[#A7C4B5]">
                  <Timer className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#F0FDF4]">Activate Spending Cooldown</h2>
                  <p className="text-xs text-[#A7C4B5]">Choose a duration to pause discretionary transactions.</p>
                </div>
              </div>

              {/* Duration Presets */}
              <div className="space-y-3 mb-4">
                <label className="block text-xs font-medium text-[#A7C4B5]">
                  Select Predefined Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DURATION_PRESETS.map((p) => (
                    <button
                      key={p.seconds}
                      type="button"
                      onClick={() => { setSelectedDuration(p.seconds); setCustomMinutes(''); }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedDuration === p.seconds && !customMinutes
                          ? 'bg-[#11251B] text-[#6EE7B7] border-[#10B981] emerald-glow-sm'
                          : 'bg-[#091510] text-[#A7C4B5] border-[rgba(110,231,183,0.16)] hover:text-[#F0FDF4]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Duration Input */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                  Or Custom Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  placeholder="e.g. 45"
                  value={customMinutes}
                  onChange={(e) => { setCustomMinutes(e.target.value); setSelectedDuration(0); }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] placeholder:text-[#A7C4B5]/40"
                />
              </div>

              {/* Reason */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                  Intent / Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prevent impulsive late-night electronics purchase"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] placeholder:text-[#A7C4B5]/40"
                />
              </div>

              <button
                type="button"
                onClick={handleStartCooldown}
                disabled={isActivating}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 stroke-[2.5]" />
                <span>{isActivating ? 'Engaging Shield...' : 'Engage Cooling-Off Shield'}</span>
              </button>
            </div>
          )}

          {/* Honest Limitation Disclaimer */}
          <div className="p-4 rounded-xl bg-[#050B09] border border-white/5 text-xs text-[#A7C4B5] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Honest Architecture Limitation:</strong> PocketPilot intercepts and pauses expense records entered inside this application. It cannot independently lock physical bank accounts, UPI PIN entry screens on external banking apps, or debit card POS terminals without licensed open-banking/account-aggregator API access.
            </p>
          </div>
        </div>

        {/* Stats & Rules Overview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Prevented Outflows Stat Card */}
          <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[#10B981]/30 emerald-glow-sm">
            <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
              <span>Impulse Purchases Averted</span>
              <PiggyBank className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#34D399]">
              {formatCurrency(totalMoneySaved)}
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1">
              Preserved in your bank accounts through mindful cancellations
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-[#0D1D16] border border-[rgba(110,231,183,0.14)] text-center">
              <span className="text-[10px] text-[#A7C4B5] uppercase font-semibold">Cancelled</span>
              <div className="text-lg font-bold font-mono text-[#34D399] mt-0.5">{cancelledCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D1D16] border border-[rgba(110,231,183,0.14)] text-center">
              <span className="text-[10px] text-[#A7C4B5] uppercase font-semibold">Continued</span>
              <div className="text-lg font-bold font-mono text-[#FBBF24] mt-0.5">{continuedCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D1D16] border border-[rgba(110,231,183,0.14)] text-center">
              <span className="text-[10px] text-[#A7C4B5] uppercase font-semibold">Overridden</span>
              <div className="text-lg font-bold font-mono text-[#FB7185] mt-0.5">{overrodeCount}</div>
            </div>
          </div>

          {/* Rules Card */}
          <div className="p-5 rounded-2xl bg-[#091510] border border-[rgba(110,231,183,0.16)] text-xs text-[#A7C4B5] space-y-2.5">
            <h3 className="font-bold text-[#F0FDF4] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>Interception Protocol Rules</span>
            </h3>
            <ul className="space-y-2 list-disc list-inside leading-relaxed text-[11px]">
              <li><strong>Expense Blocking:</strong> Every new expense attempt is halted before persisting.</li>
              <li><strong>Three Strict Outcomes:</strong> Cancel Purchase, Continue Cooldown, or Yes I Want to Spend.</li>
              <li><strong>Inflows Allowed:</strong> Income entries bypass cooldown freely.</li>
              <li><strong>Anti-Bypass:</strong> Editing existing expenses does not allow stealth additions.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Cooldown Activity Log */}
      <div className="rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#091510] border-b border-[rgba(110,231,183,0.16)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F0FDF4]">
              Cooling-Off Interception Log
            </h2>
          </div>
          <span className="text-[11px] text-[#A7C4B5]">
            Separate from transactions • Cancelled items are never charged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#050B09] border-b border-[rgba(110,231,183,0.1)] text-[#A7C4B5] text-[10px] uppercase font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Attempted Item / Merchant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Decision Taken</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(110,231,183,0.08)] text-[#F0FDF4]">
              {cooldownLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-[#A7C4B5]">
                    No cooldown interceptions recorded yet.
                  </td>
                </tr>
              ) : (
                cooldownLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#11251B]/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#A7C4B5] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#F0FDF4]">
                      {log.merchant}
                    </td>
                    <td className="py-3 px-4 text-[#A7C4B5]">
                      {log.category}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                      {formatCurrency(log.attempted_amount)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {log.action_taken === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40">
                          <XCircle className="w-3 h-3" />
                          Purchase Cancelled (Saved)
                        </span>
                      ) : log.action_taken === 'continued' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40">
                          <Timer className="w-3 h-3" />
                          Paused & Waiting
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40">
                          <CheckCircle2 className="w-3 h-3" />
                          Overrode Cooldown
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#A7C4B5] italic">
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}