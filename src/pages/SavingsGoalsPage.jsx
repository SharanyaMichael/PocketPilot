// @refresh reload
import React, { useState } from 'react';
import { Plus, Calendar, Edit2, Trash2 } from 'lucide-react';

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'M4 MacBook Pro Upgrade',
      description: 'Tech workstation upgrade for AI dev and design workflows',
      targetAmount: 180000,
      currentAmount: 92000,
      targetDate: '25 Jan 2027',
      isDemo: true,
    },
    {
      id: 2,
      title: 'Tokyo Vacation Fund',
      description: 'Autumn trip',
      targetAmount: 100000,
      currentAmount: 35000,
      targetDate: '26 Mar 2027',
      isDemo: false,
    },
    {
      id: 3,
      title: 'Tokyo Vacation Fund',
      description: 'Autumn trip',
      targetAmount: 100000,
      currentAmount: 35000,
      targetDate: '27 Mar 2027',
      isDemo: false,
    },
    {
      id: 4,
      title: 'Emergency Fund (6 Months)',
      description: 'Liquid high-yield reserve for unplanned medical or job transitions',
      targetAmount: 200000,
      currentAmount: 145000,
      targetDate: '15 Dec 2027',
      isDemo: true,
    },
    {
      id: 5,
      title: 'Japan Autumn Vacation',
      description: 'Flights, JR pass, and Tokyo-Kyoto stay',
      targetAmount: 150000,
      currentAmount: 60000,
      targetDate: '10 Nov 2027',
      isDemo: true,
    },
  ]);

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPortfolioProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Top Total Goal Portfolio Banner */}
      <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#8EA399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Goal Portfolio
            </span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace', marginTop: '4px' }}>
              ₹{totalSaved.toLocaleString()} <span style={{ fontSize: '18px', fontWeight: 'normal', color: '#8EA399' }}>/ ₹{totalTarget.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {overallPortfolioProgress}% Achieved
          </div>
        </div>

        {/* Portfolio Progress Bar */}
        <div style={{ width: '100%', height: '8px', backgroundColor: '#1C3930', borderRadius: '9999px', overflow: 'hidden', marginTop: '16px' }}>
          <div style={{ width: `${overallPortfolioProgress}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Savings Goals Grid (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <div
              key={goal.id}
              style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
            >
              <div>
                {/* Header: Title & Progress Pill */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{goal.title}</span>
                    {goal.isDemo && (
                      <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '9px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#8EA399', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'normal' }}>
                        demo
                      </span>
                    )}
                  </h2>
                  <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 'bold', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'monospace' }}>
                    {progress}%
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: '#8EA399', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                  {goal.description}
                </p>

                {/* Amounts Box */}
                <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#8EA399', marginBottom: '2px' }}>Current Saved</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace', color: '#10B981' }}>
                        ₹{goal.currentAmount.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#8EA399', marginBottom: '2px' }}>Remaining</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', color: '#F0FDF4' }}>
                        ₹{remaining.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#8EA399', marginBottom: '10px' }}>
                    <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#1C3930', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                {/* Target Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#8EA399', marginBottom: '16px' }}>
                  <Calendar size={14} style={{ color: '#10B981' }} />
                  <span>Target Date: <strong style={{ color: '#F0FDF4' }}>{goal.targetDate}</strong></span>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(110,231,183,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(110,231,183,0.3)', color: '#10B981', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                >
                  <Plus size={14} /> Deposit Money
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    style={{ padding: '6px', borderRadius: '8px', color: '#8EA399', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    title="Edit goal"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    style={{ padding: '6px', borderRadius: '8px', color: '#8EA399', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    title="Delete goal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}