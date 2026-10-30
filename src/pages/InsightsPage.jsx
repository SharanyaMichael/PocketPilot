import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Database,
  BarChart3,
  Flame
} from 'lucide-react';

export default function InsightsPage() {
  const { insightsData } = useFinance();

  const insights = insightsData?.insights || [];
  const hasUserData = insightsData?.has_user_data;

  const getVariantIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#FBBF24]" />;
      case 'negative':
        return <Flame className="w-5 h-5 text-[#FB7185]" />;
      case 'positive':
        return <CheckCircle2 className="w-5 h-5 text-[#34D399]" />;
      default:
        return <Lightbulb className="w-5 h-5 text-[#6EE7B7]" />;
    }
  };

  const getVariantBorder = (type) => {
    switch (type) {
      case 'warning':
        return 'border-[#FBBF24]/30 hover:border-[#FBBF24]/60 bg-[#0D1D16]';
      case 'negative':
        return 'border-[#FB7185]/30 hover:border-[#FB7185]/60 bg-[#0D1D16]';
      case 'positive':
        return 'border-[#10B981]/30 hover:border-[#10B981]/60 bg-[#0D1D16]';
      default:
        return 'border-[rgba(110,231,183,0.16)] hover:border-[#10B981]/40 bg-[#0D1D16]';
    }
  };

  return (
    <div style={{ paddingBottom: '48px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(to right, #0D1D16, #091510)', border: '1px solid rgba(110,231,183,0.16)', padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.2)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.3)', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>
            Deterministic Intelligence Engine
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#F0FDF4', margin: 0, letterSpacing: '-0.025em' }}>
            Smart Spending Insights
          </h1>
          <p style={{ fontSize: '13px', color: '#A7C4B5', marginTop: '4px', margin: 0 }}>
            Rule-driven telemetry derived mathematically from your recorded transactions without simulated hallucinations.
          </p>
        </div>

        {/* Data Origin Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '12px', background: '#050B09', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', color: '#A7C4B5' }}>
          <Database style={{ width: '14px', height: '14px', color: '#10B981' }} />
          <span>{hasUserData ? 'Live User Transactions' : 'Baseline Demo Telemetry'}</span>
        </div>
      </div>

      {/* Grid of Rule-Based Insights (Forced 2-Column Grid Layout) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {insights.map((insight, idx) => (
          <div
            key={insight.id || idx}
            style={{
              background: '#0D1D16',
              border: insight.type === 'warning' ? '1px solid rgba(251,191,36,0.3)' : insight.type === 'negative' ? '1px solid rgba(251,113,133,0.3)' : '1px solid rgba(110,231,183,0.16)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            <div>
              {/* Top Row: Icon on left, Badges on right */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: '#11251B', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getVariantIcon(insight.type)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {insight.badge && (
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', background: '#11251B', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.3)' }}>
                      {insight.badge}
                    </span>
                  )}
                  {insight.category && (
                    <span style={{ fontSize: '10px', color: '#A7C4B5', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {insight.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#F0FDF4', marginBottom: '8px', lineHeight: '1.4' }}>
                {insight.title}
              </h2>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#A7C4B5', lineHeight: '1.5', margin: 0 }}>
                {insight.description}
              </p>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid rgba(110,231,183,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#A7C4B5' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6EE7B7' }}>
                <BarChart3 style={{ width: '14px', height: '14px' }} />
                <span>Computed from ledger records</span>
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(167,196,181,0.6)', fontFamily: 'monospace' }}>
                Rule verified
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Roadmap & Transparency Card */}
      <div style={{ background: '#091510', border: '1px solid rgba(110,231,183,0.16)', padding: '24px', borderRadius: '16px', fontSize: '12px', color: '#A7C4B5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6EE7B7', fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}>
          <Cpu style={{ width: '16px', height: '16px', color: '#10B981' }} />
          <span>AI Architecture & Model Transparency</span>
        </div>
        <p style={{ lineHeight: '1.6', margin: 0 }}>
          The insights above are generated via deterministic heuristic analysis across monthly boundaries, category aggregates, variance bounds, and standard deviation outlier detection. This guarantees 100% mathematical accuracy without hallucinating fake connected banks. A genuine LLM agent or on-device model can easily consume this structured summary JSON via our backend endpoints.
        </p>
      </div>

    </div>
  );
}