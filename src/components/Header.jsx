import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { formatCountdown } from '../utils/formatters';
import { Plus, ShieldAlert, Database } from 'lucide-react';

export default function Header({ onOpenNewTransaction }) {
  const { cooldown } = useFinance();
  const navigate = useNavigate();

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header style={{ height: '81px', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
      {/* Left: Title & Date */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#F0FDF4', letterSpacing: '-0.01em' }}>Financial Operating System</span>
        <span style={{ fontSize: '11px', color: '#9CAFA3', marginTop: '2px' }}>{todayStr}</span>
      </div>

      {/* Right: Cooling-Off, Demo Data, and Record Transaction Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Cooling-off status button */}
        <button
          onClick={() => navigate('/dashboard/cooling-off')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: cooldown.is_active ? 'rgba(16, 185, 129, 0.15)' : '#091510',
            color: cooldown.is_active ? '#6EE7B7' : '#9CAFA3',
            border: cooldown.is_active ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(110, 231, 183, 0.16)',
            transition: 'all 0.2s ease',
          }}
        >
          <ShieldAlert style={{ width: '16px', height: '16px', color: cooldown.is_active ? '#10B981' : '#9CAFA3', flexShrink: 0 }} />
          <span>Cooling-Off</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#F0FDF4', marginLeft: '2px' }}>
            {cooldown.is_active ? formatCountdown(cooldown.remaining_seconds) : 'Standby'}
          </span>
        </button>

        {/* Demo Data Loaded Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '12px', backgroundColor: '#091510', border: '1px solid rgba(110, 231, 183, 0.16)', fontSize: '12px', color: '#9CAFA3' }}>
          <Database style={{ width: '16px', height: '16px', color: '#10B981', flexShrink: 0 }} />
          <span>Demo Data Loaded</span>
        </div>

        {/* Record Transaction Button */}
        <button
          onClick={onOpenNewTransaction}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            backgroundColor: '#10B981',
            color: '#050B09',
            fontWeight: 'bold',
            fontSize: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          <Plus style={{ width: '16px', height: '16px', strokeWidth: 2.5, flexShrink: 0 }} />
          <span>Record Transaction</span>
        </button>
      </div>
    </header>
  );
}