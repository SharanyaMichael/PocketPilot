import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import {
  Settings,
  ShieldCheck,
  Database,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Wallet
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetDemoData } = useFinance();

  const [formData, setFormData] = useState({
    monthly_budget: 65000,
    min_savings_buffer: 20000,
    preferred_currency: 'INR',
    currency_symbol: '₹',
    demo_mode_enabled: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        monthly_budget: settings.monthly_budget,
        min_savings_buffer: settings.min_savings_buffer,
        preferred_currency: settings.preferred_currency,
        currency_symbol: settings.currency_symbol,
        demo_mode_enabled: settings.demo_mode_enabled
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async (mode) => {
    const confirmation = window.confirm(
      mode === 'restore'
        ? 'Reset data to fresh demo state?'
        : mode === 'clear_demo_only'
        ? 'Remove all demo records and keep only your custom entries?'
        : 'Wipe all records completely and start fresh?'
    );

    if (confirmation) {
      try {
        await resetDemoData(mode);
        setResetMessage('Database operation executed successfully.');
        setTimeout(() => setResetMessage(''), 4000);
      } catch (err) {
        alert('Reset operation failed');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
          System Settings & Privacy Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
          Configure spending guardrails, manage demo telemetry, and review local data persistence policies.
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#6EE7B7] text-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#10B981]" />
          <span>Financial settings updated and synced across all dashboard modules.</span>
        </div>
      )}

      {resetMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8] text-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[rgba(110,231,183,0.12)]">
          <Wallet className="w-4 h-4 text-[#10B981]" />
          <h2 className="text-sm font-bold text-[#F0FDF4]">Financial Parameters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Monthly Budget Cap (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono">₹</span>
              <input
                type="number"
                step="500"
                min="1000"
                value={formData.monthly_budget}
                onChange={(e) => setFormData(prev => ({ ...prev, monthly_budget: parseFloat(e.target.value) || 0 }))}
                required
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] font-mono"
              />
            </div>
            <p className="text-[11px] text-[#A7C4B5] mt-1">
              Maximum monthly ceiling used for budget warnings & affordability scoring.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Minimum Safety Buffer (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono">₹</span>
              <input
                type="number"
                step="500"
                min="0"
                value={formData.min_savings_buffer}
                onChange={(e) => setFormData(prev => ({ ...prev, min_savings_buffer: parseFloat(e.target.value) || 0 }))}
                required
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] font-mono"
              />
            </div>
            <p className="text-[11px] text-[#A7C4B5] mt-1">
              Untouchable emergency floor. The Affordability Engine warns if any purchase breaches this.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
              Preferred Currency
            </label>
            <select
              value={formData.preferred_currency}
              onChange={(e) => {
                const curr = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  preferred_currency: curr,
                  currency_symbol: curr === 'INR' ? '₹' : curr === 'USD' ? '$' : '€'
                }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-xs text-[#F0FDF4] [color-scheme:dark]"
            >
              <option value="INR">Indian Rupee (₹ INR)</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] cursor-pointer"
          >
            {isSaving ? 'Saving Changes...' : 'Save Financial Parameters'}
          </button>
        </div>
      </form>

      {/* Demo Data Management */}
      <div className="p-6 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[rgba(110,231,183,0.12)]">
          <Database className="w-4 h-4 text-[#38BDF8]" />
          <h2 className="text-sm font-bold text-[#F0FDF4]">Demo Data Controls</h2>
        </div>
        <p className="text-xs text-[#A7C4B5] leading-relaxed">
          Switch between sample hackathon demonstration data and your own real transactions, or perform a clean slate reset anytime.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleReset('restore')}
            className="px-4 py-2 rounded-xl bg-[#11251B] hover:bg-[#163023] border border-[#10B981]/40 text-[#6EE7B7] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Clean Demo State</span>
          </button>

          <button
            type="button"
            onClick={() => handleReset('clear_demo_only')}
            className="px-4 py-2 rounded-xl bg-[#11251B] hover:bg-[#163023] border border-[rgba(110,231,183,0.16)] text-[#F0FDF4] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Remove Demo Records (Keep Custom Only)</span>
          </button>

          <button
            type="button"
            onClick={() => handleReset('clear_all')}
            className="px-4 py-2 rounded-xl bg-[#FB7185]/10 hover:bg-[#FB7185]/20 border border-[#FB7185]/30 text-[#FB7185] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Privacy & Storage Transparency */}
      <div className="p-6 rounded-2xl bg-[#091510] border border-[rgba(110,231,183,0.16)] space-y-3 text-xs text-[#A7C4B5]">
        <div className="flex items-center gap-2 text-[#6EE7B7] font-semibold text-sm">
          <Lock className="w-4 h-4 text-[#10B981]" />
          <span>Zero-Knowledge Privacy Policy & Storage Transparency</span>
        </div>

        <ul className="space-y-2 leading-relaxed list-disc list-inside">
          <li>
            <strong>No Banking Credentials Requested:</strong> PocketPilot never asks for or stores bank passwords, netbanking IDs, UPI PINs, OTPs, or debit/credit card CVVs.
          </li>
          <li>
            <strong>Transparent Persistence:</strong> Your financial data is persisted locally in the workspace SQLite database (backed by Python FastAPI) and cached in your browser.
          </li>
          <li>
            <strong>Local Storage Notice:</strong> This build operates on local persistence. It is not synced to third-party cloud analytics or unencrypted external databases.
          </li>
          <li>
            <strong>No Fabricated Connections:</strong> We do not display fake "Bank Account Connected: HDFC / SBI" badges when real open-banking credentials are not authorized.
          </li>
        </ul>
      </div>
    </div>
  );
}
