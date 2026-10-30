import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Split,
  CreditCard,
  Target,
  ShieldCheck,
  Snowflake,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/transactions', icon: Receipt, label: 'Transactions' },
    { to: '/dashboard/insights', icon: TrendingUp, label: 'Spending Insights' },
    { to: '/dashboard/bills', icon: Split, label: 'Bill Splitting' },
    { to: '/dashboard/subscriptions', icon: CreditCard, label: 'Subscriptions' },
    { to: '/dashboard/savings-goals', icon: Target, label: 'Savings Goals' },
    { to: '/dashboard/affordability', icon: ShieldCheck, label: 'Affordability Checker' },
    { to: '/dashboard/cooling-off', icon: Snowflake, label: 'Cooling-Off Mode' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: isCollapsed ? '80px' : '280px',
          minWidth: isCollapsed ? '80px' : '280px',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#050B09',
          borderRight: '1px solid rgba(110, 231, 183, 0.12)',
          color: '#F0FDF4',
          transition: 'width 0.3s ease',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(110, 231, 183, 0.08)', flexShrink: 0, height: '81px', boxSizing: 'border-box' }}>
          {!isCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050B09', flexShrink: 0 }}>
                  <Wallet style={{ width: '20px', height: '20px', strokeWidth: 2.5 }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h1 style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 900, fontSize: '15px', color: '#F0FDF4', margin: 0, lineHeight: 1, whiteSpace: 'nowrap' }}>
                    PocketPilot
                  </h1>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '9px', color: '#A7C4B5', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '4px 0 0 0', whiteSpace: 'nowrap' }}>
                    PERSONAL FINANCE MANAGER
                  </p>
                </div>
              </div>

              {/* Collapse Button */}
              <button
                onClick={onToggleCollapse}
                style={{ background: 'transparent', border: '1px solid rgba(110, 231, 183, 0.15)', borderRadius: '8px', padding: '6px', color: '#A7C4B5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                title="Collapse sidebar"
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050B09' }}>
                <Wallet style={{ width: '20px', height: '20px', strokeWidth: 2.5 }} />
              </div>
              <button
                onClick={onToggleCollapse}
                style={{ position: 'absolute', right: '-4px', top: '-10px', background: '#050B09', border: '1px solid rgba(110, 231, 183, 0.2)', borderRadius: '50%', width: '20px', height: '20px', color: '#A7C4B5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Expand sidebar"
              >
                <ChevronRight style={{ width: '12px', height: '12px' }} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: isActive ? 'bold' : '600',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#10B981' : 'transparent',
                  color: isActive ? '#050B09' : '#A7C4B5',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                })}
              >
                <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                {!isCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Metadata */}
        {!isCollapsed && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(110, 231, 183, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#A7C4B5', flexShrink: 0, backgroundColor: '#050B09' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
              Obsidian + Emerald
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '10px' }}>v1.0 MVP</span>
          </div>
        )}
      </aside>
    </>
  );
}