import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters';
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
  Flame,
  ArrowRight
} from 'lucide-react';

export default function InsightsPage() {
  const { insightsData, summary, settings } = useFinance();

  const insights = insightsData.insights || [];
  const hasUserData = insightsData.has_user_data;

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
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0D1D16] to-[#091510] border border-[rgba(110,231,183,0.16)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10B981]/20 text-[#6EE7B7] border border-[#10B981]/30">
              Deterministic Intelligence Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F0FDF4]">
            Smart Spending Insights
          </h1>
          <p className="text-xs sm:text-sm text-[#A7C4B5] mt-0.5">
            Rule-driven telemetry derived mathematically from your recorded transactions without simulated hallucinations.
          </p>
        </div>

        {/* Data Origin Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#050B09] border border-white/10 text-xs text-[#A7C4B5]">
          <Database className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{hasUserData ? 'Live User Transactions' : 'Baseline Demo Telemetry'}</span>
        </div>
      </div>

      {/* Grid of Rule-Based Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-5 rounded-2xl border transition-all ${getVariantBorder(insight.type)} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-[#11251B] border border-white/5 flex-shrink-0">
                  {getVariantIcon(insight.type)}
                </div>
                <div className="flex items-center gap-2">
                  {insight.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#11251B] text-[#6EE7B7] border border-[#10B981]/30">
                      {insight.badge}
                    </span>
                  )}
                  <span className="text-[10px] text-[#A7C4B5] font-mono uppercase">
                    {insight.category}
                  </span>
                </div>
              </div>

              <h2 className="text-base font-bold text-[#F0FDF4] mb-1.5">
                {insight.title}
              </h2>
              <p className="text-xs text-[#A7C4B5] leading-relaxed">
                {insight.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(110,231,183,0.1)] flex items-center justify-between text-[11px] text-[#A7C4B5]">
              <span className="flex items-center gap-1.5 text-[#6EE7B7]">
                <BarChart3 className="w-3 h-3" />
                <span>Computed from ledger records</span>
              </span>
              <span className="text-[10px] text-[#A7C4B5]/60 font-mono">
                Rule verified
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Roadmap & Transparency Card */}
      <div className="p-5 rounded-2xl bg-[#091510] border border-[rgba(110,231,183,0.16)] text-xs text-[#A7C4B5]">
        <div className="flex items-center gap-2 text-[#6EE7B7] font-semibold text-sm mb-2">
          <Cpu className="w-4 h-4 text-[#10B981]" />
          <span>AI Architecture & Model Transparency</span>
        </div>
        <p className="leading-relaxed">
          The insights above are generated via deterministic heuristic analysis across monthly boundaries, category aggregates, variance bounds, and standard deviation outlier detection. This guarantees 100% mathematical accuracy without hallucinating fake connected banks. A genuine LLM agent or on-device model can easily consume this structured summary JSON via our backend endpoints.
        </p>
      </div>
    </div>
  );
}
