import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES } from '../utils/formatters';
import { X, Sparkles, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, initialData = null }) {
  const { addTransaction, updateTransaction } = useFinance();
  
  const [formData, setFormData] = useState({
    description: '',
    clean_merchant: '',
    amount: '',
    type: 'expense',
    category: 'Food and Dining',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [cleanedSuggestion, setCleanedSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || '',
        clean_merchant: initialData.clean_merchant || '',
        amount: initialData.amount ? String(initialData.amount) : '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Food and Dining',
        date: initialData.date || new Date().toISOString().split('T')[0],
        notes: initialData.notes || ''
      });
      setCleanedSuggestion(initialData.clean_merchant || '');
    } else {
      setFormData({
        description: '',
        clean_merchant: '',
        amount: '',
        type: 'expense',
        category: 'Food and Dining',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setCleanedSuggestion('');
    }
    setErrorMessage('');
  }, [initialData, isOpen]);

  // Clean narration effect when description changes
  useEffect(() => {
    if (!formData.description.trim()) {
      setCleanedSuggestion('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/clean-narration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: formData.description })
        });
        if (res.ok) {
          const data = await res.json();
          setCleanedSuggestion(data.cleaned_merchant);
          // Auto suggest category if not explicitly changed by user
          if (!initialData && data.suggested_category && data.suggested_category !== 'Other') {
            setFormData(prev => ({
              ...prev,
              category: data.suggested_category,
              type: data.suggested_category === 'Income' ? 'income' : prev.type
            }));
          }
        }
      } catch (err) {
        console.warn('Narration cleaning error', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [formData.description, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid positive amount.');
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage('Description / Merchant is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData && initialData.id) {
        await updateTransaction(initialData.id, {
          ...formData,
          amount: numAmount
        });
        onClose();
      } else {
        const result = await addTransaction({
          ...formData,
          amount: numAmount
        });
        // If intercepted, the global modal opens; we can close this creation form
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error saving transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0D1D16] border border-[#10B981]/20 rounded-2xl p-6 sm:p-7 shadow-2xl emerald-glow text-[#F0FDF4] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(110,231,183,0.16)] mb-5">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${formData.type === 'income' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[#10B981]/20 text-[#6EE7B7]'}`}>
              {formData.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F0FDF4]">
                {initialData ? 'Edit Transaction' : 'Record Transaction'}
              </h2>
              <p className="text-xs text-[#A7C4B5]">
                {initialData ? 'Update details below' : 'Add manual entry or paste UPI narration'}
              </p>
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
          {/* Type Selector: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)]">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: prev.category === 'Income' ? 'Food and Dining' : prev.category }))}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                formData.type === 'expense'
                  ? 'bg-[#11251B] text-[#6EE7B7] border border-[#10B981]/40 shadow-sm'
                  : 'text-[#A7C4B5] hover:text-[#F0FDF4]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FB7185]" />
              Expense Outflow
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'Income' }))}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                formData.type === 'income'
                  ? 'bg-[#11251B] text-[#34D399] border border-[#34D399]/40 shadow-sm'
                  : 'text-[#A7C4B5] hover:text-[#F0FDF4]'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#34D399]" />
              Income Inflow
            </button>
          </div>

          {/* Description & UPI Auto Cleaner */}
          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Narration / Merchant Name
            </label>
            <input
              type="text"
              placeholder="e.g. UPI/P2A/987654/STARBUCKS INDIA or Swiggy"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] placeholder:text-[#A7C4B5]/40"
            />
            {cleanedSuggestion && cleanedSuggestion !== formData.description && (
              <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg bg-[#11251B] border border-[#10B981]/20 text-[11px] text-[#6EE7B7]">
                <Sparkles className="w-3 h-3 text-[#10B981]" />
                <span>UPI Cleaner detected: <strong>{cleanedSuggestion}</strong></span>
              </div>
            )}
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                Transaction Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] [color-scheme:dark]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-[#0D1D16] text-[#F0FDF4]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Dinner with team, client meeting, coffee run"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] placeholder:text-[#A7C4B5]/40 resize-none"
            />
          </div>

          {/* Actions */}
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
              {isSubmitting ? 'Recording...' : initialData ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
