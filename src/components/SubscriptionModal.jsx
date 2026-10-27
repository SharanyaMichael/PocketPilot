import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { X, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export default function SubscriptionModal({ isOpen, onClose, initialData = null }) {
  const { addSubscription, updateSubscription } = useFinance();

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billing_frequency: 'monthly',
    next_billing_date: new Date().toISOString().split('T')[0],
    category: 'Entertainment',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        amount: initialData.amount ? String(initialData.amount) : '',
        billing_frequency: initialData.billing_frequency || 'monthly',
        next_billing_date: initialData.next_billing_date || new Date().toISOString().split('T')[0],
        category: initialData.category || 'Entertainment',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        billing_frequency: 'monthly',
        next_billing_date: new Date().toISOString().split('T')[0],
        category: 'Entertainment',
        notes: ''
      });
    }
    setErrorMessage('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid positive subscription amount.');
      return;
    }

    if (!formData.name.trim()) {
      setErrorMessage('Subscription name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData && initialData.id) {
        await updateSubscription(initialData.id, {
          ...formData,
          amount: numAmount
        });
      } else {
        await addSubscription({
          ...formData,
          amount: numAmount
        });
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error saving subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthlyEquivalent = formData.amount && !isNaN(formData.amount)
    ? formData.billing_frequency === 'monthly'
      ? parseFloat(formData.amount)
      : parseFloat(formData.amount) / 12
    : 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0D1D16] border border-[#10B981]/20 rounded-2xl p-6 shadow-2xl emerald-glow text-[#F0FDF4]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(110,231,183,0.16)] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#10B981]/20 text-[#6EE7B7]">
              <RefreshCw className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F0FDF4]">
                {initialData ? 'Edit Subscription' : 'Add Subscription'}
              </h2>
              <p className="text-xs text-[#A7C4B5]">Track recurring SaaS, streaming, and services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-[#FB7185]/10 border border-[#FB7185]/30 text-[#FB7185] text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Service / Tool Name
            </label>
            <input
              type="text"
              placeholder="e.g. Netflix, Spotify, Claude Pro, Gym"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] placeholder:text-[#A7C4B5]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                Amount (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                Billing Cycle
              </label>
              <select
                value={formData.billing_frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, billing_frequency: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] [color-scheme:dark]"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Monthly equivalent preview */}
          {formData.billing_frequency === 'yearly' && monthlyEquivalent > 0 && (
            <div className="p-2.5 rounded-xl bg-[#11251B] border border-[#10B981]/20 text-xs text-[#6EE7B7] flex justify-between items-center">
              <span>Equivalent Monthly Impact:</span>
              <strong className="font-mono text-[#F0FDF4]">₹{monthlyEquivalent.toFixed(2)}/mo</strong>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                Next Renewal Date
              </label>
              <input
                type="date"
                value={formData.next_billing_date}
                onChange={(e) => setFormData(prev => ({ ...prev, next_billing_date: e.target.value }))}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] [color-scheme:dark]"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills and Utilities">Bills & Tech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Shared with roommates, annual discount"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] placeholder:text-[#A7C4B5]/40"
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
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
