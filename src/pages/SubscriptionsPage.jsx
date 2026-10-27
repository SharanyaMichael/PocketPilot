import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  RefreshCw,
  Plus,
  Calendar,
  AlertTriangle,
  Edit2,
  Trash2,
  CreditCard,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function SubscriptionsPage({ onOpenNewSubscription, onEditSubscription }) {
  const { subscriptions, deleteSubscription } = useFinance();
  const [deletingId, setDeletingId] = useState(null);

  const totalMonthlyCost = subscriptions.reduce((acc, s) => {
    return acc + (s.billing_frequency === 'monthly' ? s.amount : s.amount / 12);
  }, 0);

  const totalAnnualCost = totalMonthlyCost * 12;

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recurring subscription tracker?')) {
      setDeletingId(id);
      try {
        await deleteSubscription(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Helper to determine renewal urgency
  const getDaysUntilRenewal = (dateStr) => {
    if (!dateStr) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
            Subscription Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
            Audit recurring SaaS, memberships, streaming, and automated utility commitments.
          </p>
        </div>
        <button
          onClick={onOpenNewSubscription}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#050B09] font-bold text-xs tracking-wide transition-all shadow-md hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Monthly Recurring */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Monthly Recurring Burn</span>
            <div className="p-2 rounded-lg bg-[#10B981]/15 text-[#10B981]">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#6EE7B7]">
              {formatCurrency(totalMonthlyCost)}/mo
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1">
              Normalized monthly commitment
            </div>
          </div>
        </div>

        {/* Projected Annual Spend */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Projected Annual Run-Rate</span>
            <div className="p-2 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#F0FDF4]">
              {formatCurrency(totalAnnualCost)}/yr
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1">
              Annualized service commitments
            </div>
          </div>
        </div>

        {/* Active Subscriptions Count */}
        <div className="p-4 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A7C4B5] mb-2">
            <span>Active Subscriptions</span>
            <div className="p-2 rounded-lg bg-[#FBBF24]/15 text-[#FBBF24]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-[#FBBF24]">
              {subscriptions.length}
            </div>
            <div className="text-[11px] text-[#A7C4B5] mt-1">
              Tracked recurring services
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#A7C4B5] bg-[#0D1D16] rounded-2xl border border-[rgba(110,231,183,0.16)]">
            No active subscriptions tracked. Click "Add Subscription" to monitor renewal dates.
          </div>
        ) : (
          subscriptions.map((sub) => {
            const daysLeft = getDaysUntilRenewal(sub.next_billing_date);
            const isSoon = daysLeft <= 7 && daysLeft >= 0;
            const isPast = daysLeft < 0;

            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-[#0D1D16] border border-[rgba(110,231,183,0.16)] hover:border-[#10B981]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Title & Renewal Pill */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#F0FDF4] flex items-center gap-1.5">
                        <span>{sub.name}</span>
                        {sub.is_demo === 1 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/5 text-[#A7C4B5] border border-white/10 font-normal">
                            demo
                          </span>
                        )}
                      </h2>
                      <span className="text-[11px] text-[#A7C4B5]">{sub.category}</span>
                    </div>

                    {/* Due pill */}
                    <div className="flex-shrink-0">
                      {isSoon ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40">
                          <AlertTriangle className="w-3 h-3" />
                          Due in {daysLeft} days
                        </span>
                      ) : isPast ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40">
                          Renewal Passed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#11251B] text-[#6EE7B7] border border-[#10B981]/20">
                          In {daysLeft} days
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="p-3 rounded-xl bg-[#091510] border border-[rgba(110,231,183,0.12)] mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-[#A7C4B5]">Billing Amount</span>
                      <span className="text-lg font-bold font-mono text-[#F0FDF4]">
                        {formatCurrency(sub.amount)}
                        <span className="text-xs font-normal text-[#A7C4B5]">/{sub.billing_frequency === 'monthly' ? 'mo' : 'yr'}</span>
                      </span>
                    </div>
                    {sub.billing_frequency === 'yearly' && (
                      <div className="flex justify-between items-baseline mt-1 text-[11px] text-[#6EE7B7]">
                        <span>Monthly Equivalent:</span>
                        <span className="font-mono">{formatCurrency(sub.amount / 12)}/mo</span>
                      </div>
                    )}
                  </div>

                  {sub.notes && (
                    <p className="text-xs text-[#A7C4B5] italic mb-3">
                      "{sub.notes}"
                    </p>
                  )}
                </div>

                {/* Footer details & actions */}
                <div className="pt-3 border-t border-[rgba(110,231,183,0.12)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#A7C4B5]">
                    <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Next: <strong>{formatDate(sub.next_billing_date)}</strong></span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditSubscription(sub)}
                      className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#6EE7B7] hover:bg-[#11251B] transition-colors cursor-pointer"
                      title="Edit subscription"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="p-1.5 rounded-lg text-[#A7C4B5] hover:text-[#FB7185] hover:bg-[#11251B] transition-colors cursor-pointer disabled:opacity-40"
                      title="Delete subscription"
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
