import React, { useState } from 'react';
import { ShieldAlert, X, ArrowRight, Clock, Wallet } from 'lucide-react';

export default function CoolingOffModal({ isOpen, mode = 'TIME_WINDOW', onClose }) {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('');
  const [simulateTime, setSimulateTime] = useState('active');
  const [result, setResult] = useState(null);

  const handleSimulate = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount) || 0;

    if (mode === 'DAILY_BUDGET') {
      const dailyLimit = 2500;
      const isExceeded = numericAmount > dailyLimit;
      setResult({
        type: isExceeded ? 'danger' : 'success',
        message: isExceeded
          ? `Transaction of ₹${numericAmount} exceeds your daily limit of ₹${dailyLimit}!`
          : `Transaction of ₹${numericAmount} is within your daily budget limit.`
      });
    } else {
      const isRestrictedTime = simulateTime === 'active';
      setResult({
        type: isRestrictedTime ? 'danger' : 'success',
        message: isRestrictedTime
          ? `Alert: Transaction attempted during restricted nighttime window (23:00 - 06:00). Cooling-off rule triggered!`
          : `Transaction time is clear. No active guardrail restrictions violated.`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">

      {/* Modal Card Container - Perfectly Centered & Well Formatted */}
      <div className="bg-[#091510] border border-[#10B981]/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/80 relative">

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#10B981]/20 bg-[#050B09]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              {mode === 'DAILY_BUDGET' ? <Wallet className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F8FAF9] tracking-wide">
                {mode === 'DAILY_BUDGET' ? 'Daily Budget Simulation' : 'Live Guardrail Testing'}
              </h2>
              <p className="text-xs text-[#9CAFA3]">
                {mode === 'DAILY_BUDGET' ? 'Evaluate spending against active daily limits.' : 'Test active nighttime blackout and restriction rules.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#050B09] border border-[#10B981]/20 text-[#9CAFA3] hover:text-[#F8FAF9] hover:bg-[#10B981]/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSimulate} className="p-6 space-y-5">

          {/* Info Badge Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#050B09] border border-[#10B981]/15 text-xs">
            <div>
              <span className="text-[#9CAFA3] block mb-1">Active Daily Limit:</span>
              <span className="text-[#6EE7B7] font-bold text-sm">₹2,500 / day</span>
            </div>
            <div>
              <span className="text-[#9CAFA3] block mb-1">Restricted Window:</span>
              <span className="text-[#6EE7B7] font-bold text-sm">23:00 to 06:00</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-wider text-[#6EE7B7] uppercase">
              Enter Transaction Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10B981] font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1500 or 5000"
                className="w-full bg-[#050B09] border border-[#10B981]/30 rounded-xl px-4 py-3 pl-9 text-sm text-[#F8FAF9] placeholder-[#9CAFA3]/50 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                required
              />
            </div>
          </div>

          {/* Condition Simulator Dropdown */}
          {mode !== 'DAILY_BUDGET' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-[#6EE7B7] uppercase">
                Simulate Restricted Time
              </label>
              <select
                value={simulateTime}
                onChange={(e) => setSimulateTime(e.target.value)}
                className="w-full bg-[#050B09] border border-[#10B981]/30 rounded-xl px-4 py-3 text-sm text-[#F8FAF9] focus:outline-none focus:border-[#10B981] transition-all cursor-pointer"
              >
                <option value="active">Active (Triggers Time Alert)</option>
                <option value="inactive">Inactive (Normal Hours)</option>
              </select>
            </div>
          )}

          {/* Simulation Feedback Result */}
          {result && (
            <div className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${result.type === 'danger'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{result.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#050B09] border border-[#10B981]/20 text-[#9CAFA3] hover:text-[#F8FAF9] hover:bg-[#10B981]/10 text-sm font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-[#050B09] text-sm font-bold hover:from-[#34D399] hover:to-[#10B981] transition-all shadow-lg shadow-[#10B981]/20 cursor-pointer flex items-center gap-2"
            >
              <span>Simulate Transaction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}