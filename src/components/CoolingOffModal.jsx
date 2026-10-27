import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatCountdown } from '../utils/formatters';
import { ShieldAlert, XCircle, Timer, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function CoolingOffModal() {
  const { interceptModal, closeInterceptModal, cooldown, logCooldownAction } = useFinance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!interceptModal.isOpen || !interceptModal.attemptedPurchase) return null;

  const purchase = interceptModal.attemptedPurchase;

  // Button 1: Cancel Purchase
  const handleCancelPurchase = async () => {
    setIsSubmitting(true);
    await logCooldownAction('cancelled', purchase, 'User decided to cancel purchase during cooling-off interception');
    if (interceptModal.onSuccessCallback) {
      interceptModal.onSuccessCallback(false, false);
    }
    setIsSubmitting(false);
    closeInterceptModal();
  };

  // Button 2: Continue Cooldown
  const handleContinueCooldown = async () => {
    setIsSubmitting(true);
    await logCooldownAction('continued', purchase, 'User paused and elected to wait out the remainder of cooling-off timer');
    if (interceptModal.onSuccessCallback) {
      interceptModal.onSuccessCallback(false, false);
    }
    setIsSubmitting(false);
    closeInterceptModal();
  };

  // Button 3: Yes, I Want to Spend
  const handleYesSpend = async () => {
    setIsSubmitting(true);
    await logCooldownAction('overrode', purchase, 'User overrode the active cooling-off timer and confirmed expense');
    if (interceptModal.onSuccessCallback) {
      await interceptModal.onSuccessCallback(true, true);
    }
    setIsSubmitting(false);
    closeInterceptModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0D1D16] border border-[#10B981]/30 rounded-2xl p-6 sm:p-8 shadow-2xl emerald-glow text-[#F0FDF4]">
        
        {/* Header with shield icon */}
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3.5 rounded-xl bg-[#11251B] border border-[#10B981]/40 text-[#6EE7B7] flex-shrink-0">
            <ShieldAlert className="w-8 h-8 text-[#10B981]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30 mb-1">
              <Timer className="w-3.5 h-3.5" />
              Cooling-Off Mode Active
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#F0FDF4]">
              Pause & Reflect Before Spending
            </h2>
            <p className="text-sm text-[#A7C4B5] mt-0.5">
              PocketPilot intercepted this expense to protect you from impulsive purchases.
            </p>
          </div>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#11251B]/80 border border-[#10B981]/20 mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="text-xs uppercase tracking-wider text-[#A7C4B5] font-semibold">Time Remaining:</span>
          </div>
          <span className="font-mono text-lg font-bold text-[#6EE7B7] tracking-wider">
            {formatCountdown(cooldown.remaining_seconds)}
          </span>
        </div>

        {/* Attempted Purchase Details */}
        <div className="p-4 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] mb-6">
          <div className="text-xs text-[#A7C4B5] uppercase font-semibold mb-2">Attempted Outflow</div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-lg font-semibold text-[#F0FDF4] truncate pr-2">
              {purchase.description || 'Discretionary Purchase'}
            </span>
            <span className="text-2xl font-black text-[#FB7185] font-mono">
              {formatCurrency(purchase.amount)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#A7C4B5]">
            <span>Category: <strong className="text-[#6EE7B7]">{purchase.category || 'Shopping'}</strong></span>
            <span>Date: <strong className="text-[#F0FDF4]">{purchase.date}</strong></span>
          </div>
        </div>

        {/* Honest Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[#050B09] border border-white/5 text-[11px] text-[#A7C4B5]/80 mb-6">
          <AlertTriangle className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> PocketPilot intercepts expenses recorded inside this application. It cannot physically block external bank apps, UPI handles, or debit/credit card POS terminals without authorized banking integrations.
          </span>
        </div>

        {/* 3 Explicit Action Buttons */}
        <div className="space-y-3">
          {/* Action 1: Cancel Purchase */}
          <button
            onClick={handleCancelPurchase}
            disabled={isSubmitting}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/50 text-[#6EE7B7] font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <XCircle className="w-5 h-5 text-[#34D399]" />
              <div className="text-left">
                <div className="font-semibold text-sm">1. Cancel Purchase</div>
                <div className="text-[11px] text-[#A7C4B5] font-normal">Save money, discard this expense, and log as impulse prevented</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#6EE7B7]" />
          </button>

          {/* Action 2: Continue Cooldown */}
          <button
            onClick={handleContinueCooldown}
            disabled={isSubmitting}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#11251B] hover:bg-[#163023] border border-[rgba(110,231,183,0.2)] text-[#F0FDF4] font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Timer className="w-5 h-5 text-[#FBBF24]" />
              <div className="text-left">
                <div className="font-semibold text-sm">2. Continue Cooldown</div>
                <div className="text-[11px] text-[#A7C4B5] font-normal">Step away and rethink without recording the expense yet</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#A7C4B5]" />
          </button>

          {/* Action 3: Yes, I Want to Spend */}
          <button
            onClick={handleYesSpend}
            disabled={isSubmitting}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#091510] hover:bg-[#FB7185]/10 border border-[#FB7185]/30 text-[#FB7185] font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#FB7185]" />
              <div className="text-left">
                <div className="font-semibold text-sm">3. Yes, I Want to Spend</div>
                <div className="text-[11px] text-[#A7C4B5] font-normal">I have carefully evaluated this and choose to override cooldown</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#FB7185]" />
          </button>
        </div>

      </div>
    </div>
  );
}
