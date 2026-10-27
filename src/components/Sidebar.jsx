import React from 'react';
import { NavLink } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { formatCountdown } from '../utils/formatters';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  RefreshCw,
  Target,
  Sparkles,
  ShieldAlert,
  Settings,
  Wallet,
  Timer
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Spending Insights', path: '/insights', icon: TrendingUp },
  { name: 'Subscriptions', path: '/subscriptions', icon: RefreshCw },
  { name: 'Savings Goals', path: '/savings-goals', icon: Target },
  { name: 'Affordability Checker', path: '/affordability', icon: Sparkles },
  { name: 'Cooling-Off Mode', path: '/cooling-off', icon: ShieldAlert },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { cooldown } = useFinance();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#091510] border-r border-[rgba(110,231,183,0.16)] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-[rgba(110,231,183,0.16)] gap-3 bg-[#050B09]/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
            <Wallet className="w-5 h-5 text-[#050B09]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#F0FDF4]">PocketPilot</span>
              <span className="px-1.5 py-0.2 bg-[#10B981]/20 border border-[#10B981]/40 rounded text-[9px] font-bold text-[#6EE7B7]">AI</span>
            </div>
            <span className="text-[10px] text-[#A7C4B5] tracking-wider uppercase font-medium">Finance Architecture</span>
          </div>
        </div>

        {/* Cooldown Mini Banner if active */}
        {cooldown.is_active && (
          <div className="m-3 p-3 rounded-xl bg-[#11251B] border border-[#10B981]/40 emerald-glow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6EE7B7] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                </span>
                Cooling-Off Active
              </span>
              <Timer className="w-3.5 h-3.5 text-[#FBBF24]" />
            </div>
            <div className="text-[11px] text-[#A7C4B5] flex justify-between">
              <span>Time Left:</span>
              <span className="font-mono font-bold text-[#F0FDF4]">{formatCountdown(cooldown.remaining_seconds)}</span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#11251B] text-[#6EE7B7] border border-[#10B981]/40 shadow-sm emerald-glow-sm'
                      : 'text-[#A7C4B5] hover:text-[#F0FDF4] hover:bg-[#11251B]/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#10B981]' : 'text-[#A7C4B5] group-hover:text-[#6EE7B7]'
                      }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.name === 'Cooling-Off Mode' && cooldown.is_active && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & theme badge */}
        <div className="p-4 border-t border-[rgba(110,231,183,0.16)] bg-[#050B09]/30">
          <div className="flex items-center justify-between text-[11px] text-[#A7C4B5]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>Obsidian + Emerald</span>
            </div>
            <span className="font-mono text-[10px] text-[#A7C4B5]/70">v1.0 MVP</span>
          </div>
        </div>
      </aside>
    </>
  );
}
