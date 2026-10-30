// @refresh reload
import React, { useState, useEffect } from 'react';
import {
  PieChart as PieIcon,
  Settings,
  DollarSign,
  TrendingUp,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Plus,
  BarChart3,
  Lightbulb
} from 'lucide-react';

export default function OverviewPage() {
  // Permanent Daily Budget State stored in localStorage
  const [dailyBudget, setDailyBudget] = useState(() => {
    return parseFloat(localStorage.getItem('user_daily_budget')) || 2500;
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(dailyBudget);

  useEffect(() => {
    localStorage.setItem('user_daily_budget', dailyBudget);
  }, [dailyBudget]);

  const todaysSpendCategories = [
    { name: 'Food & Dining', amount: 850, color: '#10B981' },
    { name: 'Shopping', amount: 1200, color: '#38BDF8' },
    { name: 'Utilities & Transport', amount: 350, color: '#FBBF24' },
  ];

  const totalSpentToday = todaysSpendCategories.reduce((sum, c) => sum + c.amount, 0);
  const remainingBudget = dailyBudget - totalSpentToday;
  const spendPercentage = Math.min(100, Math.round((totalSpentToday / dailyBudget) * 100));

  const handleSaveBudget = (e) => {
    e.preventDefault();
    setDailyBudget(parseFloat(tempBudget) || 2500);
    setIsEditingBudget(false);
  };

  const recentTransactions = [
    { id: 1, title: 'Supermarket Groceries', category: 'Food & Dining', amount: -1250, date: 'Today, 2:15 PM' },
    { id: 2, title: 'Freelance Design Retainer', category: 'Income', amount: 25000, date: 'Yesterday' },
    { id: 3, title: 'Electric Utility Bill', category: 'Utilities', amount: -1840, date: '28 Oct' },
    { id: 4, title: 'Coffee & Snacks', category: 'Food & Dining', amount: -320, date: '27 Oct' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* 1. Financial Overview Top Banner */}
      <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 4px 0' }}>
            Financial Overview
          </h1>
          <p style={{ fontSize: '13px', color: '#8EA399', margin: 0 }}>
            Real-time balance telemetry, automated spending trends, and budget guardrails.
          </p>
        </div>
        <button
          style={{ backgroundColor: '#10B981', color: '#050B09', fontWeight: 'bold', fontSize: '12px', padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
        >
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* 2. Top 5 Metric Cards (Side-by-Side Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px' }}>

        {/* Available Balance */}
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '12px' }}>
            <span>Available Balance</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
              <Wallet size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>
              ₹1,30,267
            </div>
            <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '6px' }}>
              Net operating liquidity
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '12px' }}>
            <span>Monthly Income</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace' }}>
              +₹1,98,000
            </div>
            <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '6px' }}>
              Recorded inflows this month
            </div>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '12px' }}>
            <span>Monthly Expenses</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(251,113,133,0.15)', color: '#FB7185' }}>
              <ArrowDownRight size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#FB7185', fontFamily: 'monospace' }}>
              -₹67,733
            </div>
            <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '6px' }}>
              Outflows for current cycle
            </div>
          </div>
        </div>

        {/* Savings Reserves */}
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '12px' }}>
            <span>Savings Reserves</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
              <Shield size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>
              ₹3,67,000
            </div>
            <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '6px' }}>
              Target: ₹7,30,000
            </div>
          </div>
        </div>

        {/* Budget Remaining */}
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Budget Remaining</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(251,113,133,0.15)', color: '#FB7185' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace', marginBottom: '8px' }}>
              ₹0
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#1C3930', borderRadius: '9999px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: '100%', height: '100%', backgroundColor: '#FB7185', borderRadius: '9999px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#8EA399' }}>
              <span style={{ color: '#FB7185' }}>104% used</span>
              <span>of ₹65,000</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Permanent Daily Budget Target & Spending Ring */}
      <div style={{ backgroundColor: '#091510', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(110,231,183,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.3)' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 2px 0' }}>Permanent Daily Budget Target</h2>
              <p style={{ fontSize: '12px', color: '#8EA399', margin: 0 }}>
                Active Limit: <strong style={{ color: '#10B981', fontFamily: 'monospace' }}>₹{dailyBudget.toLocaleString()}</strong> / day (Persists permanently)
              </p>
            </div>
          </div>

          <div>
            {isEditingBudget ? (
              <form onSubmit={handleSaveBudget} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  style={{ backgroundColor: '#050B09', border: '1px solid #1C3930', borderRadius: '8px', padding: '6px 12px', color: '#F0FDF4', fontSize: '13px', width: '120px', outline: 'none' }}
                />
                <button
                  type="submit"
                  style={{ backgroundColor: '#10B981', color: '#050B09', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save
                </button>
              </form>
            ) : (
              <button
                onClick={() => { setTempBudget(dailyBudget); setIsEditingBudget(true); }}
                style={{ backgroundColor: '#1C3930', color: '#F0FDF4', border: '1px solid rgba(110,231,183,0.2)', borderRadius: '10px', padding: '6px 14px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Settings size={14} /> Change Daily Budget
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', alignItems: 'center' }}>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px', borderRadius: '50%', background: `conic-gradient(#10B981 0% 35%, #38BDF8 35% 75%, #FBBF24 75% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
              <div style={{ width: '104px', height: '104px', borderRadius: '50%', backgroundColor: '#091510', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', color: '#8EA399' }}>Spent Today</span>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>₹{totalSpentToday}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {todaysSpendCategories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8EA399' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#F0FDF4' }}>Daily Budget Utilization</span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', color: spendPercentage > 100 ? '#FB7185' : '#10B981' }}>
                {spendPercentage}% Used
              </span>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: '#1C3930', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${spendPercentage}%`, height: '100%', backgroundColor: spendPercentage > 100 ? '#FB7185' : '#10B981', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)' }}>
                <div style={{ fontSize: '11px', color: '#8EA399' }}>Remaining Budget</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', color: remainingBudget >= 0 ? '#10B981' : '#FB7185', marginTop: '2px' }}>
                  ₹{remainingBudget.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)' }}>
                <div style={{ fontSize: '11px', color: '#8EA399' }}>Daily Limit</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', color: '#F0FDF4', marginTop: '2px' }}>
                  ₹{dailyBudget.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Charts Section: Income vs Expense & Spending by Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Income vs Expense Trajectory</h3>
            <BarChart3 size={18} style={{ color: '#10B981' }} />
          </div>

          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px 8px 0 8px', borderBottom: '1px solid #1C3930' }}>
            {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, idx) => {
              const incomeHeight = [60, 75, 85, 70, 90, 95][idx];
              const expenseHeight = [45, 55, 50, 65, 60, 50][idx];
              return (
                <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '160px' }}>
                    <div style={{ width: '12px', height: `${incomeHeight}%`, backgroundColor: '#10B981', borderRadius: '4px 4px 0 0' }} title="Income" />
                    <div style={{ width: '12px', height: `${expenseHeight}%`, backgroundColor: '#FB7185', borderRadius: '4px 4px 0 0' }} title="Expense" />
                  </div>
                  <span style={{ fontSize: '11px', color: '#8EA399' }}>{month}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#8EA399' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#10B981' }} /> Income
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#8EA399' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#FB7185' }} /> Expense
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Spending by Category</h3>
            <PieIcon size={18} style={{ color: '#38BDF8' }} />
          </div>

          <div style={{ position: 'relative', width: '130px', height: '130px', borderRadius: '50%', background: `conic-gradient(#10B981 0% 40%, #38BDF8 40% 70%, #FBBF24 70% 90%, #FB7185 90% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#091510' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8EA399' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Food & Dining</span>
              <span style={{ fontFamily: 'monospace', color: '#F0FDF4' }}>40%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8EA399' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38BDF8' }} /> Subscriptions</span>
              <span style={{ fontFamily: 'monospace', color: '#F0FDF4' }}>30%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8EA399' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FBBF24' }} /> Utilities</span>
              <span style={{ fontFamily: 'monospace', color: '#F0FDF4' }}>20%</span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. Spending Observations & Recent Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Lightbulb size={18} style={{ color: '#FBBF24' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Spending Observations</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)', fontSize: '12px', color: '#8EA399', lineHeight: '1.5' }}>
              ⚡ <strong style={{ color: '#F0FDF4' }}>Subscription creep detected:</strong> Recurring commitments grew by 12% over the last 30 days.
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)', fontSize: '12px', color: '#8EA399', lineHeight: '1.5' }}>
              🛡️ <strong style={{ color: '#F0FDF4' }}>Emergency buffer healthy:</strong> Your 6-month runway remains fully secured above threshold.
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', margin: 0 }}>Recent Activity</h3>
            <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500', cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#050B09', border: '1px solid rgba(28,57,48,0.6)', padding: '12px 16px', borderRadius: '12px' }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#F0FDF4' }}>{tx.title}</div>
                  <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '2px' }}>{tx.category} • {tx.date}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', color: tx.amount > 0 ? '#10B981' : '#F0FDF4' }}>
                  {tx.amount > 0 ? `+₹${tx.amount.toLocaleString()}` : `-₹${Math.abs(tx.amount).toLocaleString()}`}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}