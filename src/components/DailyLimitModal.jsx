import React from 'react';
import { useFinance } from '../context/FinanceContext';

export default function DailyLimitModal() {
  const { interceptModal, closeInterceptModal } = useFinance();

  if (!interceptModal.isOpen) return null;

  const { attemptedPurchase, todaySpent = 0, dailyLimit, reason, onSuccessCallback } = interceptModal;
  const amount = Number(attemptedPurchase?.amount || 0);
  const projectedTotal = todaySpent + amount;
  const isDailyLimitReason = reason === 'daily_limit';

  const handleSkipAndBackOff = async () => {
    if (onSuccessCallback) {
      await onSuccessCallback(false, false);
    }
    closeInterceptModal();
  };

  const handleProceed = async () => {
    if (onSuccessCallback) {
      await onSuccessCallback(true, true);
    }
    closeInterceptModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#121816] border border-emerald-500/30 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 text-xl">
            ⚠️
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {isDailyLimitReason ? 'Daily Spend Limit Exceeded' : 'Cooling-Off Intercept'}
            </h3>
            <p className="text-xs text-zinc-400">Behavioral friction triggered to protect your budget.</p>
          </div>
        </div>

        {/* Breakdown Box */}
        <div className="bg-zinc-900/90 rounded-xl p-4 mb-5 space-y-2 text-sm border border-zinc-800/80">
          {isDailyLimitReason && (
            <>
              <div className="flex justify-between">
                <span className="text-zinc-400">Daily Limit:</span>
                <span className="font-semibold text-emerald-400">₹{dailyLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Already Spent Today:</span>
                <span className="font-semibold">₹{todaySpent}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-zinc-400">Attempted Payment:</span>
            <span className="font-semibold text-red-400">
              ₹{amount} ({attemptedPurchase?.clean_merchant || attemptedPurchase?.title || attemptedPurchase?.description || 'Expense'})
            </span>
          </div>
          {isDailyLimitReason && (
            <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold">
              <span>Projected Total:</span>
              <span className="text-amber-400">₹{projectedTotal}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-zinc-400 mb-6 text-center">
          Would you like to skip and back off, or proceed with the payment anyway?
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSkipAndBackOff}
            className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium text-sm transition-all border border-zinc-700 text-center"
          >
            🛑 Skip & Back Off
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-emerald-900/30 text-center"
          >
            Proceed Anyway
          </button>
        </div>

      </div>
    </div>
  );
}