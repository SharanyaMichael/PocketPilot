// @refresh reload
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, CheckCircle2, Lock, Plus, Trash2, Bell, Settings, Wallet } from 'lucide-react';

export default function CoolingOffPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Sony WH-1000XM5 Headphones',
      amount: 24990,
      category: 'Electronics',
      timeLeft: '42 hours remaining',
      status: 'Active Cooling-Off',
    },
    {
      id: 2,
      title: 'Mechanical Keyboards & Keycaps',
      amount: 6500,
      category: 'Gadgets',
      timeLeft: 'Unlocked & Ready',
      status: 'Eligible for Purchase',
    },
  ]);

  // Cooling-Off Time Window State
  const [startTime, setStartTime] = useState(() => localStorage.getItem('cooling_start_time') || '23:00');
  const [endTime, setEndTime] = useState(() => localStorage.getItem('cooling_end_time') || '06:00');
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Daily Budget State
  const [dailyBudget, setDailyBudget] = useState(() => {
    return parseFloat(localStorage.getItem('user_daily_budget')) || 2500;
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(dailyBudget);

  useEffect(() => {
    localStorage.setItem('cooling_start_time', startTime);
    localStorage.setItem('cooling_end_time', endTime);
  }, [startTime, endTime]);

  useEffect(() => {
    localStorage.setItem('user_daily_budget', dailyBudget);
  }, [dailyBudget]);

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Shopping');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newItem = {
      id: Date.now(),
      title: newTitle,
      amount: parseFloat(newAmount),
      category: newCategory,
      timeLeft: '72 hours remaining',
      status: 'Active Cooling-Off',
    };

    setItems([newItem, ...items]);
    setNewTitle('');
    setNewAmount('');
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const simulateCheckoutAttempt = () => {
    setShowNotification(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    setDailyBudget(parseFloat(tempBudget) || 2500);
    setIsEditingBudget(false);
  };

  const activeCount = items.filter(i => i.status.includes('Cooling')).length;
  const totalLockedAmount = items
    .filter(i => i.status.includes('Cooling'))
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>

      {/* Simulated Popup Notification */}
      {showNotification && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(5,11,9,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#091510', border: '1px solid rgba(251,191,36,0.4)', borderRadius: '20px', padding: '32px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(251,191,36,0.15)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', border: '1px solid rgba(251,191,36,0.3)' }}>
              <Bell size={28} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 8px 0' }}>Cooling-Off Window Active</h2>
            <p style={{ fontSize: '13px', color: '#8EA399', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              You configured a spending blackout between <strong style={{ color: '#FBBF24' }}>{startTime}</strong> and <strong style={{ color: '#FBBF24' }}>{endTime}</strong>. Step back and let your impulse cool down!
            </p>
            <button
              onClick={() => setShowNotification(false)}
              style={{ backgroundColor: '#10B981', color: '#050B09', fontWeight: 'bold', fontSize: '13px', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
            >
              I Understand, Pause Spending
            </button>
          </div>
        </div>
      )}

      {/* Top Header Banner */}
      <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Cooling-Off Vault</h1>
            <span style={{ fontSize: '11px', fontWeight: '600', backgroundColor: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)', padding: '2px 10px', borderRadius: '9999px', fontFamily: 'monospace' }}>
              Impulse Guard
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#8EA399', margin: 0 }}>
            Mandatory holding periods and nighttime blackout windows to eliminate buyer's remorse.
          </p>
        </div>
      </div>

      {/* Grid for Configuration Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>

        {/* Cooling-Off Time Window Configuration */}
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(251,191,36,0.15)', color: '#FBBF24', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(251,191,36,0.3)', flexShrink: 0 }}>
              <Clock size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 4px 0' }}>Cooling-Off Time Window</h2>
              <p style={{ fontSize: '12px', color: '#8EA399', margin: 0 }}>
                No spend hours: <strong style={{ color: '#FBBF24' }}>{startTime}</strong> to <strong style={{ color: '#FBBF24' }}>{endTime}</strong>.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(251,191,36,0.1)' }}>
            <button
              onClick={simulateCheckoutAttempt}
              style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Test Popup Alert
            </button>

            {isEditingTime ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '8px', padding: '6px 8px', color: '#F0FDF4', fontSize: '12px', outline: 'none' }}
                />
                <span style={{ color: '#8EA399', fontSize: '12px' }}>to</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={{ backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '8px', padding: '6px 8px', color: '#F0FDF4', fontSize: '12px', outline: 'none' }}
                />
                <button
                  onClick={() => setIsEditingTime(false)}
                  style={{ backgroundColor: '#10B981', color: '#050B09', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTime(true)}
                style={{ backgroundColor: '#1C3930', color: '#F0FDF4', border: '1px solid rgba(110,231,183,0.2)', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Settings size={14} /> Set Time
              </button>
            )}
          </div>
        </div>

        {/* Daily Budget Configuration */}
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.3)', flexShrink: 0 }}>
              <Wallet size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 4px 0' }}>Daily Budget</h2>
              <p style={{ fontSize: '12px', color: '#8EA399', margin: 0 }}>
                Active Limit: <strong style={{ color: '#10B981', fontFamily: 'monospace' }}>₹{dailyBudget.toLocaleString()}</strong> / day
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid rgba(16,185,129,0.1)' }}>
            {isEditingBudget ? (
              <form onSubmit={handleSaveBudget} style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  style={{ backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '8px', padding: '6px 12px', color: '#F0FDF4', fontSize: '13px', width: '130px', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#10B981', color: '#050B09', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save Budget
                </button>
              </form>
            ) : (
              <button
                onClick={() => { setTempBudget(dailyBudget); setIsEditingBudget(true); }}
                style={{ backgroundColor: '#1C3930', color: '#F0FDF4', border: '1px solid rgba(110,231,183,0.2)', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Settings size={14} /> Set Daily Budget
              </button>
            )}
          </div>
        </div>

      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Items in Holding</span>
            <Lock size={16} style={{ color: '#FBBF24' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FBBF24', fontFamily: 'monospace' }}>
            {activeCount} Active
          </div>
        </div>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Locked Capital</span>
            <ShieldAlert size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace' }}>
            ₹{totalLockedAmount.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Default Holding Period</span>
            <Clock size={16} style={{ color: '#38BDF8' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>
            72 Hours
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        {items.map((item) => {
          const isActive = item.status.includes('Cooling');
          return (
            <div
              key={item.id}
              style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 4px 0' }}>{item.title}</h2>
                    <span style={{ fontSize: '11px', color: '#8EA399', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{item.category}</span>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold', backgroundColor: isActive ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.2)', color: isActive ? '#FBBF24' : '#10B981', border: `1px solid ${isActive ? 'rgba(251,191,36,0.4)' : 'rgba(16,185,129,0.4)'}` }}>
                    {item.status}
                  </span>
                </div>

                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)', marginBottom: '16px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#8EA399' }}>Locked Amount</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace', color: '#F0FDF4' }}>
                      ₹{item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isActive ? '#FBBF24' : '#10B981', marginTop: '8px' }}>
                    <Clock size={14} />
                    <span>{item.timeLeft}</span>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(110,231,183,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  style={{ backgroundColor: isActive ? 'rgba(251,191,36,0.15)' : '#10B981', color: isActive ? '#FBBF24' : '#050B09', border: isActive ? '1px solid rgba(251,191,36,0.3)' : 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {isActive ? 'Cooling Active' : 'Release Funds'}
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  style={{ padding: '6px', borderRadius: '8px', color: '#8EA399', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                  title="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}