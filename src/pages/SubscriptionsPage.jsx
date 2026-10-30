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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Top Header Banner */}
      <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', margin: '0 0 4px 0' }}>
            Subscription Manager
          </h1>
          <p style={{ fontSize: '13px', color: '#8EA399', margin: 0 }}>
            Audit recurring SaaS, memberships, streaming, and automated utility commitments.
          </p>
        </div>
        {onOpenNewSubscription && (
          <button
            onClick={onOpenNewSubscription}
            style={{ backgroundColor: '#10B981', color: '#050B09', fontWeight: 'bold', fontSize: '12px', padding: '10px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}
          >
            <Plus size={16} /> Add Subscription
          </button>
        )}
      </div>

      {/* KPI Summary Cards (Forced Side-by-Side via Inline Styles) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Monthly Recurring Burn</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
              <RefreshCw size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', fontFamily: 'monospace' }}>
              {formatCurrency(totalMonthlyCost)}/mo
            </div>
            <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '4px' }}>
              Normalized monthly commitment
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Projected Annual Run-Rate</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(56,189,248,0.15)', color: '#38BDF8' }}>
              <CreditCard size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F0FDF4', fontFamily: 'monospace' }}>
              {formatCurrency(totalAnnualCost)}/yr
            </div>
            <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '4px' }}>
              Annualized service commitments
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8EA399', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
            <span>Active Subscriptions</span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}>
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FBBF24', fontFamily: 'monospace' }}>
              {subscriptions.length}
            </div>
            <div style={{ fontSize: '11px', color: '#8EA399', marginTop: '4px' }}>
              Tracked recurring services
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Cards Grid (3 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        {subscriptions.length === 0 ? (
          <div style={{ gridColumn: 'span 3 / span 3', padding: '64px 0', textAlign: 'center', fontSize: '12px', color: '#8EA399', backgroundColor: '#091510', borderRadius: '16px', border: '1px solid rgba(110,231,183,0.14)' }}>
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
                style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#091510', border: '1px solid rgba(110,231,183,0.14)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
              >
                <div>
                  {/* Top Bar: Title & Renewal Pill */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                        <span>{sub.name}</span>
                        {sub.is_demo === 1 && (
                          <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '9px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#8EA399', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'normal' }}>
                            demo
                          </span>
                        )}
                      </h2>
                      <span style={{ fontSize: '11px', color: '#8EA399', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{sub.category}</span>
                    </div>

                    {/* Due pill */}
                    <div style={{ flexShrink: 0 }}>
                      {isSoon ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold', backgroundColor: 'rgba(251,191,36,0.2)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.4)' }}>
                          <AlertTriangle size={12} />
                          {daysLeft === 0 ? 'Due in 0 days' : `Due in ${daysLeft} days`}
                        </span>
                      ) : isPast ? (
                        <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: 'bold', backgroundColor: 'rgba(251,113,133,0.2)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.4)' }}>
                          Renewal Passed
                        </span>
                      ) : (
                        <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '10px', fontWeight: '500', backgroundColor: '#11251B', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                          In {daysLeft} days
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amounts */}
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#050B09', border: '1px solid rgba(110,231,183,0.08)', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '12px', color: '#8EA399' }}>Billing Amount</span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace', color: '#F0FDF4' }}>
                        {formatCurrency(sub.amount)}
                        <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#8EA399' }}>/{sub.billing_frequency === 'monthly' ? 'mo' : 'yr'}</span>
                      </span>
                    </div>
                    {sub.billing_frequency === 'yearly' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px', fontSize: '11px', color: '#10B981' }}>
                        <span>Monthly Equivalent:</span>
                        <span style={{ fontFamily: 'monospace' }}>{formatCurrency(sub.amount / 12)}/mo</span>
                      </div>
                    )}
                  </div>

                  {sub.notes && (
                    <p style={{ fontSize: '12px', color: '#8EA399', fontStyle: 'italic', marginBottom: '12px', margin: 0 }}>
                      "{sub.notes}"
                    </p>
                  )}
                </div>

                {/* Footer details & actions */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(110,231,183,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8EA399' }}>
                    <Calendar size={14} style={{ color: '#10B981' }} />
                    <span>Next: <strong style={{ color: '#F0FDF4' }}>{daysLeft === 0 ? 'Today' : formatDate(sub.next_billing_date)}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {onEditSubscription && (
                      <button
                        onClick={() => onEditSubscription(sub)}
                        style={{ padding: '6px', borderRadius: '8px', color: '#8EA399', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                        title="Edit subscription"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      style={{ padding: '6px', borderRadius: '8px', color: '#8EA399', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', opacity: deletingId === sub.id ? 0.4 : 1 }}
                      title="Delete subscription"
                    >
                      <Trash2 size={14} />
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