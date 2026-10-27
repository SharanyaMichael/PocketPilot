import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Target, AlertCircle, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SavingsGoalModal({ isOpen, onClose, initialData = null, mode = 'manage' }) {
  const { addSavingsGoal, updateSavingsGoal, contributeToGoal } = useFinance();

  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    current_amount: '',
    target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: ''
  });

  const [contributionAmount, setContributionAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        target_amount: initialData.target_amount ? String(initialData.target_amount) : '',
        current_amount: initialData.current_amount ? String(initialData.current_amount) : '0',
        target_date: initialData.target_date || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        target_amount: '',
        current_amount: '0',
        target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: ''
      });
    }
    setContributionAmount('');
    setErrorMessage('');
  }, [initialData, isOpen, mode]);

  if (!isOpen) return null;

  // Handle Add Contribution to Goal
  const handleContribute = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const amt = parseFloat(contributionAmount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMessage('Please enter a valid positive contribution amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await contributeToGoal(initialData.id, amt);
      if (updated.current_amount >= updated.target_amount) {
        // Trigger celebratory confetti if goal reached!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#6EE7B7', '#34D399', '#FBBF24']
          });
        } catch (_) {}
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error contributing to goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Create or Update Goal
  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const targetNum = parseFloat(formData.target_amount);
    const currentNum = parseFloat(formData.current_amount || '0');

    if (isNaN(targetNum) || targetNum <= 0) {
      setErrorMessage('Target amount must be greater than 0.');
      return;
    }

    if (isNaN(currentNum) || currentNum < 0) {
      setErrorMessage('Current saved amount cannot be negative.');
      return;
    }

    if (!formData.name.trim()) {
      setErrorMessage('Goal name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData && initialData.id) {
        await updateSavingsGoal(initialData.id, {
          ...formData,
          target_amount: targetNum,
          current_amount: currentNum
        });
      } else {
        await addSavingsGoal({
          ...formData,
          target_amount: targetNum,
          current_amount: currentNum
        });
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error saving goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'contribute' && initialData) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-md bg-[#0D1D16] border border-[#10B981]/25 rounded-2xl p-6 shadow-2xl emerald-glow text-[#F0FDF4]">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(110,231,183,0.16)] mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#6EE7B7]">
                <PlusCircle className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F0FDF4]">Deposit Toward Goal</h2>
                <p className="text-xs text-[#A7C4B5]">{initialData.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#FB7185]/10 border border-[#FB7185]/30 text-[#FB7185] text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] mb-4 flex justify-between text-xs">
            <span className="text-[#A7C4B5]">Current Progress:</span>
            <span className="font-semibold text-[#6EE7B7]">
              ₹{initialData.current_amount.toLocaleString('en-IN')} / ₹{initialData.target_amount.toLocaleString('en-IN')}
            </span>
          </div>

          <form onSubmit={handleContribute} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                Contribution Amount (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="e.g. 5000"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] font-mono"
                />
              </div>
              <p className="text-[11px] text-[#A7C4B5] mt-1.5">
                Note: Goal contributions are savings re-allocations and are not counted as new income.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(110,231,183,0.16)]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Contributing...' : 'Add Contribution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0D1D16] border border-[#10B981]/25 rounded-2xl p-6 shadow-2xl emerald-glow text-[#F0FDF4]">
        
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(110,231,183,0.16)] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#6EE7B7]">
              <Target className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F0FDF4]">
                {initialData ? 'Edit Savings Goal' : 'New Savings Goal'}
              </h2>
              <p className="text-xs text-[#A7C4B5]">Set target funds for vacations, tech, or emergency</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#FB7185]/10 border border-[#FB7185]/30 text-[#FB7185] text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Goal Name
            </label>
            <input
              type="text"
              placeholder="e.g. Emergency Fund, Japan Trip, MacBook M4"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] placeholder:text-[#A7C4B5]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                Target Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono">₹</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="100000"
                  value={formData.target_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_amount: e.target.value }))}
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                Initial Saved (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono">₹</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  value={formData.current_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_amount: e.target.value }))}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData(prev => ({ ...prev, target_date: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Description / Motivation
            </label>
            <textarea
              rows="2"
              placeholder="e.g. 6 months living expenses stored in liquid mutual fund"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] placeholder:text-[#A7C4B5]/40 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(110,231,183,0.16)]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
