import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORIES } from '../utils/formatters';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  Info
} from 'lucide-react';

const PRESETS = [
  { name: 'Dinner at Fine Dining Bistro', price: 3200, category: 'Food and Dining' },
  { name: 'Sony WH-1000XM5 Headphones', price: 24990, category: 'Shopping' },
  { name: 'Ergonomic Standing Desk', price: 34500, category: 'Shopping' },
  { name: 'iPhone 16 Pro Max 256GB', price: 144900, category: 'Shopping' },
];

export default function AffordabilityPage() {
  const { settings, summary } = useFinance();

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Shopping');
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    const price = parseFloat(itemPrice);
    if (!itemName.trim() || isNaN(price) || price <= 0) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/affordability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_name: itemName,
          item_price: price,
          category: itemCategory
        })
      });

      if (res.ok) {
        const data = await res.json();
        setEvaluation(data);
      }
    } catch (err) {
      console.error('Affordability check failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setItemName(preset.name);
    setItemPrice(String(preset.price));
    setItemCategory(preset.category);
    // Auto-trigger evaluation
    setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/affordability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item_name: preset.name,
            item_price: preset.price,
            category: preset.category
          })
        });
        if (res.ok) {
          const data = await res.json();
          setEvaluation(data);
        }
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
          Affordability Guidance Engine
        </h1>
        <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
          Evaluate planned expenses against liquid reserves, monthly budget pacing, and your minimum safety buffer.
        </p>
      </div>

      {/* Interactive Form & Presets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
            <h2 className="text-sm font-bold text-[#F0FDF4] mb-3">Planned Purchase Assessment</h2>
            
            <form onSubmit={handleEvaluate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                  Item / Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Keyboard, Weekend Trip, iPad Air"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] placeholder:text-[#A7C4B5]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                    Price (₹ INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#A7C4B5] font-mono">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="0.00"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      required
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A7C4B5] mb-1">
                    Category
                  </label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.16)] focus:border-[#10B981] focus:outline-none text-sm text-[#F0FDF4] [color-scheme:dark]"
                  >
                    {CATEGORIES.filter(c => c !== 'Income').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !itemName || !itemPrice}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>{isLoading ? 'Computing Financial Impact...' : 'Evaluate Affordability'}</span>
              </button>
            </form>

            {/* Quick Demo Presets */}
            <div className="mt-5 pt-4 border-t border-[rgba(110,231,183,0.12)]">
              <span className="text-[11px] text-[#A7C4B5] font-semibold uppercase tracking-wider block mb-2">
                Quick Test Scenarios
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="p-2.5 rounded-xl bg-[#11251B] hover:bg-[#163023] border border-[rgba(110,231,183,0.16)] text-left text-xs transition-colors cursor-pointer group"
                  >
                    <div className="font-semibold text-[#F0FDF4] truncate group-hover:text-[#6EE7B7]">
                      {p.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#A7C4B5] mt-0.5">
                      {formatCurrency(p.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {evaluation ? (
            <div className={`p-6 rounded-2xl border shadow-xl ${
              evaluation.badge_variant === 'positive'
                ? 'bg-[#0D1D16] border-[#10B981]/50 emerald-glow'
                : evaluation.badge_variant === 'warning'
                ? 'bg-[#0D1D16] border-[#FBBF24]/50 warning-glow'
                : 'bg-[#0D1D16] border-[#FB7185]/50'
            }`}>
              {/* Verdict Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  evaluation.badge_variant === 'positive'
                    ? 'bg-[#34D399]/20 text-[#34D399]'
                    : evaluation.badge_variant === 'warning'
                    ? 'bg-[#FBBF24]/20 text-[#FBBF24]'
                    : 'bg-[#FB7185]/20 text-[#FB7185]'
                }`}>
                  {evaluation.badge_variant === 'positive' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : evaluation.badge_variant === 'warning' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A7C4B5]">Verdict</span>
                  <div className={`text-xl font-black ${
                    evaluation.badge_variant === 'positive'
                      ? 'text-[#34D399]'
                      : evaluation.badge_variant === 'warning'
                      ? 'text-[#FBBF24]'
                      : 'text-[#FB7185]'
                  }`}>
                    {evaluation.verdict}
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <p className="text-xs text-[#F0FDF4] leading-relaxed mb-4 p-3 rounded-xl bg-[#091510] border border-white/5">
                {evaluation.explanation}
              </p>

              {/* Metrics Table */}
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between text-[#A7C4B5]">
                  <span>Current Liquid Balance:</span>
                  <span className="font-mono font-bold text-[#F0FDF4]">{formatCurrency(evaluation.metrics.liquid_balance)}</span>
                </div>
                <div className="flex justify-between text-[#A7C4B5]">
                  <span>Configured Emergency Buffer:</span>
                  <span className="font-mono text-[#6EE7B7]">{formatCurrency(evaluation.metrics.min_savings_buffer)}</span>
                </div>
                <div className="flex justify-between text-[#A7C4B5]">
                  <span>Remaining Monthly Budget:</span>
                  <span className="font-mono text-[#FBBF24]">{formatCurrency(evaluation.metrics.remaining_budget)}</span>
                </div>
                <div className="pt-2 border-t border-[rgba(110,231,183,0.12)] flex justify-between font-semibold">
                  <span className="text-[#A7C4B5]">Projected Balance After Purchase:</span>
                  <span className={`font-mono font-bold ${evaluation.metrics.post_purchase_balance >= evaluation.metrics.min_savings_buffer ? 'text-[#34D399]' : 'text-[#FB7185]'}`}>
                    {formatCurrency(evaluation.metrics.post_purchase_balance)}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-[10px] text-[#A7C4B5]/70 italic leading-snug">
                {evaluation.disclaimer}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-3 rounded-xl bg-[#11251B] text-[#10B981] mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#F0FDF4] mb-1">Awaiting Assessment</h3>
              <p className="text-xs text-[#A7C4B5] max-w-xs">
                Fill in the item details or select a quick scenario to inspect affordability metrics.
              </p>
            </div>
          )}

          {/* Current Buffer Reference Card */}
          <div className="p-4 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.14)] text-xs flex items-center justify-between">
            <span className="text-[#A7C4B5]">Active Safety Buffer Setting:</span>
            <span className="font-mono font-bold text-[#6EE7B7]">
              {formatCurrency(settings.min_savings_buffer)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
