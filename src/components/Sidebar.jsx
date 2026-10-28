import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  CreditCard, 
  Target, 
  Calculator, 
  Clock, 
  Settings, 
  Users, 
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
    { path: '/dashboard/insights', label: 'Spending Insights', icon: BarChart3 },
    { path: '/dashboard/bills', label: 'Bill Splitting', icon: Users },
    { path: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/dashboard/savings-goals', label: 'Savings Goals', icon: Target },
    { path: '/dashboard/affordability', label: 'Affordability Checker', icon: Calculator },
    { path: '/dashboard/cooling-off', label: 'Cooling-Off Mode', icon: Clock },
    { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#050B09] border-r border-[#1C3930] p-4 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          {/* Header / Brand */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                <LayoutDashboard size={18} />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#F0FDF4] leading-none">PocketPilot</h2>
                <span className="text-[10px] uppercase tracking-wider text-[#71877D] font-medium">
                  Personal Finance Manager
                </span>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-[#71877D] hover:text-[#F0FDF4]">
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition
                    ${isActive 
                      ? 'bg-[#10B981]/15 text-[#6EE7B7] border border-[#10B981]/30' 
                      : 'text-[#A7BDB2] hover:bg-[#102820] hover:text-[#F0FDF4]'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="px-2 pt-4 border-t border-[#1C3930] flex items-center justify-between text-[11px] text-[#71877D]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Obsidian + Emerald
          </span>
          <span>v1.0 MVP</span>
        </div>
      </aside>
    </>
  );
}