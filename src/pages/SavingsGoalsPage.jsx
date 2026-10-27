import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function SavingsGoalsPage({ onOpenNewGoal, onEditGoal, onContributeGoal }) {
  const { savingsGoals, deleteSavingsGoal } = useFinance();
  const [deletingId, setDeletingId] = useState(null);

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.current_amount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target_amount, 0);
  const overallPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleDelete = async (id) => {
    if (window.confirm('Delete this savings goal? Stored allocations will be removed.')) {
      setDeletingId(id);
      try {
        await deleteSavingsGoal(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
            Savings Targets & Goals
          </h1>
          <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
            Lock in dedicated reserves for emergency safety, life milestones, and gear upgrades.
          </p>
        </div>
        <button
          onClick={onOpenNewGoal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Aggregate Progress Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0D1D16] to-[#11251B] border border-[rgba(110,231,183,0.2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#A7C4B5] font-semibold">
              Total Goal Portfolio
            </div>
            <div className="text-3xl font-black font-mono text-[#6EE7B7] mt-1">
              {formatCurrency(totalSaved)}
              <span className="text-base font-normal text-[#A7C4B5]"> / {formatCurrency(totalTarget)}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/40">
              {overallPercentage.toFixed(1)}% Achieved
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#050B09] h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-500 shadow-sm"
            style={{ width: `${Math.min(100, overallPercentage)}%` }}
          />
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savingsGoals.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#A7C4B5] bg-[#0D1D16] rounded-2xl border border-[rgba(110,231,183,0.16)]">
            No savings goals established yet. Click "New Savings Goal" to track your targets.
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const isCompleted = goal.current_amount >= goal.target_amount;
            const pct = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
            const remaining = Math.max(0, goal.target_amount - goal.current_amount);

            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] hover:border-[#10B981]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Name & Completed badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h2 className="text-base font-bold text-[#F0FDF4] flex items-center gap-1.5">
                        <span>{goal.name}</span>
                        {goal.is_demo === 1 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/5 text-[#A7C4B5] border border-white/10 font-normal">
                            demo
                          </span>
                        )}
                      </h2>
                    </div>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#11251B] text-[#6EE7B7] border border-[#10B981]/20">
                        {pct.toFixed(0)}%
                      </span>
                    )}
                  </div>

                  {goal.description && (
                    <p className="text-xs text-[#A7C4B5] line-clamp-2 mb-4 leading-relaxed">
                      {goal.description}
                    </p>
                  )}

                  {/* Amounts */}
                  <div className="p-3 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.12)] mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs text-[#A7C4B5]">Current Saved</span>
                      <span className="text-lg font-bold font-mono text-[#6EE7B7]">
                        {formatCurrency(goal.current_amount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-[11px] text-[#A7C4B5]">
                      <span>Target: <strong>{formatCurrency(goal.target_amount)}</strong></span>
                      <span>Remaining: <strong className="text-[#F0FDF4]">{formatCurrency(remaining)}</strong></span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#11251B] h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-[#34D399]' : 'bg-[#10B981]'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {/* Target date */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#A7C4B5] mb-4">
                    <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Target Date: <strong>{formatDate(goal.target_date)}</strong></span>
                  </div>
                </div>

                {/* Bottom Actions: Deposit + Edit/Delete */}
                <div className="pt-3 border-t border-[rgba(110,231,183,0.12)] flex items-center justify-between">
                  <button
                    onClick={() => onContributeGoal(goal)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#11251B] hover:bg-[#163023] border border-[#10B981]/40 text-[#6EE7B7] text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Deposit Money</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditGoal(goal)}
                      className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#6EE7B7] hover:bg-[#11251B] transition-colors cursor-pointer"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      disabled={deletingId === goal.id}
                      className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#FB7185] hover:bg-[#11251B] transition-colors cursor-pointer disabled:opacity-40"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
