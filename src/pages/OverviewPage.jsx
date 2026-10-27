import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/formatters';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Plus,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function OverviewPage({ onOpenNewTransaction, onOpenGoalModal }) {
  const { summary, transactions, subscriptions, savingsGoals, insightsData, isLoading } = useFinance();
  const [trendRange, setTrendRange] = useState('6M');

  if (isLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-[#A7C4B5]">Loading financial telemetry...</span>
        </div>
      </div>
    );
  }

  // Derived metrics
  const budgetPct = summary.budget_used_percentage;
  const recentTransactions = transactions.slice(0, 6);
  const topInsights = insightsData.insights.slice(0, 3);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.2)] text-xs shadow-xl">
          <p className="font-semibold text-[#F0FDF4] mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-mono font-bold">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0D1D16] to-[#091510] border border-[rgba(110,231,183,0.16)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
            Financial Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
            Real-time balance telemetry, automated spending trends, and budget guardrails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Available Balance */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Available Balance</span>
            <div className="p-2 rounded-lg bg-[#11251B] text-[#10B981]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${summary.available_balance >= 0 ? 'text-[#F0FDF4]' : 'text-[#FB7185]'}`}>
              {formatCurrency(summary.available_balance)}
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1 flex items-center gap-1">
              <span>Net operating liquidity</span>
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Monthly Income</span>
            <div className="p-2 rounded-lg bg-[#34D399]/15 text-[#34D399]">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#34D399]">
              +{formatCurrency(summary.monthly_income)}
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1">
              Recorded inflows this month
            </div>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Monthly Expenses</span>
            <div className="p-2 rounded-lg bg-[#FB7185]/15 text-[#FB7185]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#FB7185]">
              -{formatCurrency(summary.monthly_expenses)}
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1">
              Outflows for current cycle
            </div>
          </div>
        </div>

        {/* Savings Goals Amount */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Savings Reserves</span>
            <div className="p-2 rounded-lg bg-[#10B981]/15 text-[#6EE7B7]">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#6EE7B7]">
              {formatCurrency(summary.savings_total_saved)}
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1">
              Target: {formatCurrency(summary.savings_total_target)}
            </div>
          </div>
        </div>

        {/* Monthly Budget Remaining */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Budget Remaining</span>
            <div className={`p-2 rounded-lg ${budgetPct > 90 ? 'bg-[#FB7185]/20 text-[#FB7185]' : 'bg-[#FBBF24]/20 text-[#FBBF24]'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#FBBF24]">
              {formatCurrency(summary.monthly_budget_remaining)}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#11251B] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetPct > 90 ? 'bg-[#FB7185]' : budgetPct > 75 ? 'bg-[#FBBF24]' : 'bg-[#10B981]'
                }`}
                style={{ width: `${Math.min(100, budgetPct)}%` }}
              />
            </div>
            <div className="text-[10px] text-[#A7C4B5] mt-1 flex justify-between">
              <span>{budgetPct.toFixed(0)}% used</span>
              <span>of {formatCurrency(summary.monthly_budget)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Income vs Expense Bar + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Inflow vs Outflow */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#F0FDF4]">Income vs Expenses</h2>
              <p className="text-xs text-[#A7C4B5]">6-month comparative cash flow history</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#34D399]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]"></span> Income
              </span>
              <span className="flex items-center gap-1.5 text-[#FB7185]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]"></span> Expense
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#A7C4B5" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#A7C4B5"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="#34D399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#FB7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Breakdown Donut */}
        <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-[#F0FDF4]">Spending by Category</h2>
            <p className="text-xs text-[#A7C4B5]">Relative expense distribution</p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            {summary.category_breakdown.length === 0 ? (
              <div className="text-xs text-[#A7C4B5]">No expense transactions recorded yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Spend']}
                    contentStyle={{ backgroundColor: '#091510', borderColor: 'rgba(110,231,183,0.2)', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Pie
                    data={summary.category_breakdown}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {summary.category_breakdown.map((entry) => (
                      <Cell
                        key={`cell-${entry.category}`}
                        fill={CATEGORY_COLORS[entry.category] || '#10B981'}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top 3 categories list */}
          <div className="mt-2 space-y-1.5 flex-1 overflow-y-auto max-h-28 pr-1">
            {summary.category_breakdown.slice(0, 4).map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#10B981' }}
                  />
                  <span className="text-[#A7C4B5] truncate">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#F0FDF4]">{formatCurrency(cat.amount)}</span>
                  <span className="text-[#A7C4B5]/70 text-[10px]">({cat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Transactions + Smart Observations & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#F0FDF4]">Recent Transactions</h2>
              <p className="text-xs text-[#A7C4B5]">Latest recorded inflows and outflows</p>
            </div>
            <button
              onClick={onOpenNewTransaction}
              className="text-xs text-[#6EE7B7] hover:text-[#10B981] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[rgba(110,231,183,0.1)]">
            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#A7C4B5]">
                No transactions recorded yet. Click "Add Transaction" to begin.
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-[#11251B]/40 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl flex-shrink-0 ${
                        tx.type === 'income' ? 'bg-[#34D399]/15 text-[#34D399]' : 'bg-[#10B981]/15 text-[#6EE7B7]'
                      }`}
                    >
                      {tx.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4 text-[#FB7185]" />}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-[#F0FDF4] truncate flex items-center gap-1.5">
                        <span>{tx.clean_merchant || tx.description}</span>
                        {tx.is_demo === 1 && (
                          <span className="px-1 py-0.2 rounded text-[9px] bg-white/5 text-[#A7C4B5] border border-white/10 font-normal">
                            demo
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#A7C4B5] flex items-center gap-2">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span className="text-[#6EE7B7]">{tx.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono">
                    <div className={`text-xs font-bold ${tx.type === 'income' ? 'text-[#34D399]' : 'text-[#FB7185]'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[10px] text-[#A7C4B5]/70">
                      {tx.type}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Rule-Based Observations & Upcoming Renewals */}
        <div className="space-y-6">
          {/* Real Observations */}
          <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
              <h2 className="text-sm font-bold text-[#F0FDF4]">Spending Observations</h2>
            </div>
            <div className="space-y-2.5">
              {topInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3 rounded-xl bg-[#11251B] border border-[rgba(110,231,183,0.14)] text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#F0FDF4] truncate">{insight.title}</span>
                    {insight.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#10B981]/20 text-[#6EE7B7] flex-shrink-0">
                        {insight.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A7C4B5] leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Subscriptions widget */}
          <div className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FBBF24]" />
                <h2 className="text-sm font-bold text-[#F0FDF4]">Upcoming Renewals</h2>
              </div>
              <span className="text-[11px] font-mono text-[#A7C4B5]">
                {formatCurrency(summary.monthly_recurring_subscriptions)}/mo
              </span>
            </div>

            <div className="space-y-2">
              {summary.upcoming_subscriptions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="p-2.5 rounded-xl bg-[#11251B]/60 border border-[rgba(110,231,183,0.12)] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-[#F0FDF4]">{sub.name}</div>
                    <div className="text-[10px] text-[#A7C4B5]">
                      Due {formatDate(sub.next_billing_date)} ({sub.billing_frequency})
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#FBBF24]">
                    {formatCurrency(sub.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
