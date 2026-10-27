import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { formatCountdown } from '../utils/formatters';
import { Menu, Plus, ShieldAlert, Sparkles, Database } from 'lucide-react';

export default function Header({ onOpenSidebar, onOpenNewTransaction }) {
  const { cooldown, settings } = useFinance();
  const navigate = useNavigate();

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#091510]/85 backdrop-blur-md border-b border-[rgba(110,231,183,0.16)] px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile menu button & Title / Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B] transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-[#F0FDF4]">Financial Operating System</span>
          <span className="text-[11px] text-[#A7C4B5]">{todayStr}</span>
        </div>
      </div>

      {/* Right: Cooldown Pill, Demo Status, Quick Add Button */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Cooling-off status indicator */}
        <button
          onClick={() => navigate('/cooling-off')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            cooldown.is_active
              ? 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/50 emerald-glow-sm animate-pulse'
              : 'bg-[#11251B]/60 text-[#A7C4B5] border-[rgba(110,231,183,0.16)] hover:text-[#F0FDF4]'
          }`}
          title="Global Cooling-Off Mode protects against impulsive purchases"
        >
          <ShieldAlert className={`w-3.5 h-3.5 ${cooldown.is_active ? 'text-[#10B981]' : 'text-[#A7C4B5]'}`} />
          <span className="hidden md:inline">
            {cooldown.is_active ? 'Cooling-Off:' : 'Cooling-Off'}
          </span>
          <span className="font-mono font-bold">
            {cooldown.is_active ? formatCountdown(cooldown.remaining_seconds) : 'Standby'}
          </span>
        </button>

        {/* Demo Data badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#050B09] border border-white/10 text-[11px] text-[#A7C4B5]">
          <Database className="w-3 h-3 text-[#10B981]" />
          <span>Demo Data Loaded</span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenNewTransaction}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Record Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
